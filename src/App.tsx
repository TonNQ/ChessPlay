import { useEffect, useState } from 'react'
import './App.css'
import ChessRoom from 'src/pages/ChessRoom/ChessRoom'
import Home from './pages/Home/Home'
import { getGameIdFromLocalStorage } from './utils/storage'
import boardApi from './apis/board.api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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
    teamType,
    hasMoved: false
  })
  initialPieces.push({
    image: `assets/images/rook-${type}.svg`,
    position: new Position(7, y),
    type: PieceType.ROOK,
    teamType,
    hasMoved: false
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
    teamType,
    hasMoved: false
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
  const [gameId, setGameId] = useState<string | null>(null)

  const [pieces, setPieces] = useState<Piece[]>(initialPieces)

  useEffect(() => {
    const id = getGameIdFromLocalStorage()
    if (id) {
      boardApi
        .findGame(id)
        .then((response) => {
          setPieces(exportPieces(response.data.chess_pieces, response.data.white_moved))
          setGameId(id)
        })
        .catch((error) => toast.error(error.message))
    }
  }, [gameId])

  return (
    <div id='app'>
      {gameId ? <ChessRoom pieces={pieces} /> : <Home setGameId={setGameId} />}
      <ToastContainer />
    </div>
  )
}

export default App
