import { useEffect, useState } from 'react'
import './App.css'
import ChessRoom from 'src/pages/ChessRoom/ChessRoom'
import Home from './pages/Home/Home'
import { getGameIdFromLocalStorage, setGameIdToLocalStorage } from './utils/storage'
import boardApi from './apis/board.api'
import { toast } from 'react-toastify'

function App() {
  const [isGameExist, setIsGameExist] = useState<boolean>(false)
  useEffect(() => {
    const gameId = getGameIdFromLocalStorage()
    if (gameId === '') {
      boardApi
        .createGame()
        .then((response) => {
          setGameIdToLocalStorage(response.data.id)
        })
        .catch((error) => {
          toast.error(error.message)
        })
    } else {
      boardApi
        .findGame(gameId)
        .then((response) => {
          console.log(response.data)
          setIsGameExist(true)
        })
        .catch((error) => toast.error(error.message))
    }
  }, [])
  return <div id='app'>{isGameExist ? <ChessRoom /> : <Home setIsGameExist={setIsGameExist} />}</div>
}

export default App
