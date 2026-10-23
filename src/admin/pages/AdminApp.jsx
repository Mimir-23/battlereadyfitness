import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../admin/AuthProvider'
import { ToastProvider, ConfirmProvider, UnsavedProvider } from '../../admin/ui'
import AdminLayout from './AdminLayout'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import AdminSection from './AdminSection'

/* ------------------------------------------------------------------ */
/*  Self-contained admin app. Lazy-loaded as a whole so the Supabase    */
/*  SDK (auth/storage) it depends on never weighs on the public bundle. */
/* ------------------------------------------------------------------ */

export default function AdminApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          <UnsavedProvider>
            <Routes>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path=":key" element={<AdminSection />} />
              </Route>
            </Routes>
          </UnsavedProvider>
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  )
}
