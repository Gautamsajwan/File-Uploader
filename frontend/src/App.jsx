import { useState } from 'react'
import FileUpload from './components/FileUpload'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="max-w-[1280px] mx-auto">
      <FileUpload />
    </div>
  )
}

export default App
