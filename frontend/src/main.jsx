import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { RealtimeProvider } from './context/RealtimeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <RealtimeProvider>
        <App />
      </RealtimeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)