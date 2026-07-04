import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ContentProvider } from './content/ContentProvider'

// After a redeploy, a user with the previous HTML in cache may request lazy
// chunks that no longer exist. Vite emits this event in that case — a reload
// picks up the fresh HTML (and its new chunk names) instead of crashing.
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  window.location.reload()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <App />
      </ContentProvider>
    </BrowserRouter>
  </StrictMode>,
)
