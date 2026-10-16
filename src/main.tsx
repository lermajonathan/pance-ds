import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './site/App'
import { ThemeProvider } from './components'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
