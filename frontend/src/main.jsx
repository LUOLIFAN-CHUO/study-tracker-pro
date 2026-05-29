import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' 
import './i18n'  // <--- 核心！必须在这里引入，多语言功能才会启动

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)