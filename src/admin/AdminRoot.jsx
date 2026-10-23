import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ContentProvider } from '../content/ContentProvider'
import AdminApp from './pages/AdminApp'

/* ------------------------------------------------------------------ */
/*  Root of the /admin island (client-only). The panel keeps its own    */
/*  client-side routing under /admin and loads Supabase (auth/storage)  */
/*  only here, never on the public pages.                               */
/* ------------------------------------------------------------------ */

export default function AdminRoot() {
  return (
    <StrictMode>
      <BrowserRouter>
        <ContentProvider>
          <AdminApp />
        </ContentProvider>
      </BrowserRouter>
    </StrictMode>
  )
}
