import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { setupAxiosErrorHandling } from './utils/errorMessages'
import { installDebugRuntime } from './debug/debugRuntime'

setupAxiosErrorHandling();
installDebugRuntime();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
