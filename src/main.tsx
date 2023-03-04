import React from 'react'
import ReactDOM from 'react-dom/client'
import Chat from './App'
import { EXAMPLES, API_KEY } from './const'
import { ANSWERS } from './answer'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Chat
      apiKey={API_KEY}
      examples={EXAMPLES}
      answers={ANSWERS}
      initialMessage='hola! Soy un Bot preprado para atender algunas de tus preguntas para ayudarte a darte consejos para el mantenimiento a una impresora.'
    />
  </React.StrictMode>,
)
