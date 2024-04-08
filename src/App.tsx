import { useState } from 'react'
import './App.css'
import ChessRoom from 'src/pages/ChessRoom/ChessRoom'
import Home from './pages/Home/Home'

function App() {
  const [isGameExist, setIsGameExist] = useState<boolean>(false)
  return <div id='app'>{isGameExist ? <ChessRoom /> : <Home setIsGameExist={setIsGameExist} />}</div>
}

export default App
