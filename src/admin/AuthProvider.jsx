/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

/* ------------------------------------------------------------------ */
/*  Admin authentication                                               */
/*  Wraps Supabase Auth and resolves whether the signed-in user is an   */
/*  authorised admin (their email exists in the `admins` table — RLS    */
/*  only returns rows to admins, so a non-empty result means access).   */
/* ------------------------------------------------------------------ */

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  // null = todavía comprobando; true/false = resuelto.
  const [isAdmin, setIsAdmin] = useState(isSupabaseConfigured ? null : false)
  // Only "loading" when there's actually a session to resolve.
  const [loading, setLoading] = useState(isSupabaseConfigured)

  const checkAdmin = useCallback(async (sess) => {
    if (!sess?.user?.email) {
      setIsAdmin(false)
      return
    }
    setIsAdmin(null)
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('email')
        .ilike('email', sess.user.email)
      if (error) throw error
      setIsAdmin((data?.length ?? 0) > 0)
    } catch {
      setIsAdmin(false)
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setLoading(false)
      checkAdmin(data.session)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setSession(sess)
      // Awaiting Supabase queries inside this callback deadlocks the SDK's
      // auth lock — defer the admin check to the next tick instead.
      setTimeout(() => {
        if (active) checkAdmin(sess)
      }, 0)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [checkAdmin])

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setIsAdmin(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isAdmin,
        loading,
        configured: isSupabaseConfigured,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
