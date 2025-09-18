import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UrlShortener from './pages/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UrlShortener />
  </StrictMode>,
)
