import React from 'react'
import ReactDOM from 'react-dom/client'

import { enableMSW } from './api/mocks'
import { enableMockServer } from './api/mirage/enable-mock-server'
import { App } from './app'

Promise.all([enableMSW(), enableMockServer()]).then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
