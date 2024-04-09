import { useEffect, useState } from 'react'
import './App.css'
import ChessRoom from 'src/pages/ChessRoom/ChessRoom'
import Home from './pages/Home/Home'
import { getGameIdFromLocalStorage } from './utils/storage'
import boardApi from './apis/board.api'
import { ToastContainer, toast } from 'react-toastify'
import { exportPieces } from './utils/utils'
import { Piece, PieceType, TeamType } from './components/ChessBoard/ChessBoard'
import { Position } from './models/Position'

const initialPieces: Piece[] = []
// set up pieces
for (let p = 0; p < 2; p++) {
  const teamType = p === 0 ? TeamType.COMPUTERTEAM : TeamType.USERTEAM
  const type = teamType === TeamType.COMPUTERTEAM ? 'b' : 'w'
  const y = teamType === TeamType.COMPUTERTEAM ? 7 : 0

  initialPieces.push({
    image: `assets/images/rook-${type}.svg`,
    position: new Position(0, y),
    type: PieceType.ROOK,
    teamType
  })
  initialPieces.push({
    image: `assets/images/rook-${type}.svg`,
    position: new Position(7, y),
    type: PieceType.ROOK,
    teamType
  })
  initialPieces.push({
    image: `assets/images/knight-${type}.svg`,
    position: new Position(1, y),
    type: PieceType.KNIGHT,
    teamType
  })
  initialPieces.push({
    image: `assets/images/knight-${type}.svg`,
    position: new Position(6, y),
    type: PieceType.KNIGHT,
    teamType
  })
  initialPieces.push({
    image: `assets/images/bishop-${type}.svg`,
    position: new Position(2, y),
    type: PieceType.BISHOP,
    teamType
  })
  initialPieces.push({
    image: `assets/images/bishop-${type}.svg`,
    position: new Position(5, y),
    type: PieceType.BISHOP,
    teamType
  })
  initialPieces.push({
    image: `assets/images/queen-${type}.svg`,
    position: new Position(3, y),
    type: PieceType.QUEEN,
    teamType
  })
  initialPieces.push({
    image: `assets/images/king-${type}.svg`,
    position: new Position(4, y),
    type: PieceType.KING,
    teamType
  })
}

for (let i = 0; i < 8; i++) {
  initialPieces.push({
    image: 'assets/images/pawn-b.svg',
    position: new Position(i, 6),
    type: PieceType.PAWN,
    teamType: TeamType.COMPUTERTEAM
  })
}

for (let i = 0; i < 8; i++) {
  initialPieces.push({
    image: 'assets/images/pawn-w.svg',
    position: new Position(i, 1),
    type: PieceType.PAWN,
    teamType: TeamType.USERTEAM
  })
}

function App() {
  const [isGameExist, setIsGameExist] = useState<boolean>(false)

  const [pieces, setPieces] = useState<Piece[]>(initialPieces)

  useEffect(() => {
    const gameId = getGameIdFromLocalStorage()
    if (gameId !== '') {
      boardApi
        .findGame(gameId)
        .then((response) => {
          setPieces(exportPieces(response.data.chess_pieces))
          setIsGameExist(true)
        })
        .catch((error) => toast.error(error.message))
    }
  }, [isGameExist])
  return (
    <>
      <div id='app'>{isGameExist ? <ChessRoom pieces={pieces} /> : <Home setIsGameExist={setIsGameExist} />}</div>
      <ToastContainer />
    </>
  )
}

export default App
