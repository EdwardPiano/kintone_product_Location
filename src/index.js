import React from 'react'
import { createRoot } from 'react-dom/client'
import Main from './components/Main'

kintone.events.on(['app.record.index.show'], (event) => {
  const container = kintone.app.getHeaderMenuSpaceElement()
  const root = createRoot(container)
  root.render(<Main />)
})
