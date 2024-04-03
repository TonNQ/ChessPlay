import React, { useRef, useState } from 'react'
import Tile from '../Tile/Tile'
import './ChessBoard.css'
import Referee from 'src/referee/referee'

const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8']
const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

export interface Piece {
  image: string
  x: number
  y: number
  type: PieceType
  teamType: TeamType
}

export enum PieceType {
  PAWN,
  BISHOP,
  KNGHT,
  ROOK,
  QUEEN,
  KING
}

export enum TeamType {
  COMPUTERTEAM,
  USERTEAM
}

const initialPieces: Piece[] = []
// set up pieces
for (let p = 0; p < 2; p++) {
  const teamType = p === 0 ? TeamType.COMPUTERTEAM : TeamType.USERTEAM
  const type = teamType === TeamType.COMPUTERTEAM ? 'b' : 'w'
  const y = teamType === TeamType.COMPUTERTEAM ? 7 : 0

  initialPieces.push({ image: `assets/images/rook_${type}.png`, x: 0, y: y, type: PieceType.ROOK, teamType })
  initialPieces.push({ image: `assets/images/rook_${type}.png`, x: 7, y: y, type: PieceType.ROOK, teamType })
  initialPieces.push({ image: `assets/images/knight_${type}.png`, x: 1, y: y, type: PieceType.KNGHT, teamType })
  initialPieces.push({ image: `assets/images/knight_${type}.png`, x: 6, y: y, type: PieceType.KNGHT, teamType })
  initialPieces.push({ image: `assets/images/bishop_${type}.png`, x: 2, y: y, type: PieceType.BISHOP, teamType })
  initialPieces.push({ image: `assets/images/bishop_${type}.png`, x: 5, y: y, type: PieceType.BISHOP, teamType })
  initialPieces.push({ image: `assets/images/queen_${type}.png`, x: 3, y: y, type: PieceType.QUEEN, teamType })
  initialPieces.push({ image: `assets/images/king_${type}.png`, x: 4, y: y, type: PieceType.KING, teamType })
}

for (let i = 0; i < 8; i++) {
  initialPieces.push({
    image: 'assets/images/pawn_b.png',
    x: i,
    y: 6,
    type: PieceType.PAWN,
    teamType: TeamType.COMPUTERTEAM
  })
}

for (let i = 0; i < 8; i++) {
  initialPieces.push({
    image: 'assets/images/pawn_w.png',
    x: i,
    y: 1,
    type: PieceType.PAWN,
    teamType: TeamType.USERTEAM
  })
}

export default function ChessBoard() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null)
  const [gridX, setGridX] = useState(0) // grid x position
  const [gridY, setGridY] = useState(0) // grid y position
  const [pieces, setPieces] = useState<Piece[]>(initialPieces)
  const chessboardRef = useRef<HTMLDivElement>(null) // reference to the chessboard
  const referee = new Referee()

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement
    const chessboard = chessboardRef.current

    if (element.classList.contains('chess-piece') && chessboard) {
      // set the current grid position
      setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 80))
      setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 640) / 80)))
      // get the mouse coordinates
      const x = e.clientX - 40
      const y = e.clientY - 40

      // absolute and then adjusts its position based on the mouse coordinate
      element.style.position = 'absolute'
      element.style.left = `${x}px`
      element.style.top = `${y}px`

      setActivePiece(element)
    }
  }

  function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current

    if (activePiece && chessboard) {
      // find the minimum and maximum x and y coordinates
      const minX = chessboard.offsetLeft - 20
      const minY = chessboard.offsetTop - 20
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 60
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 60
      // get the mouse coordinates
      const x = e.clientX - 40
      const y = e.clientY - 40
      activePiece.style.position = 'absolute'

      if (x < minX) {
        activePiece.style.left = `${minX}px`
      } else if (x > maxX) {
        activePiece.style.left = `${maxX}px`
      } else {
        activePiece.style.left = `${x}px`
      }

      if (y < minY) {
        activePiece.style.top = `${minY}px`
      } else if (y > maxY) {
        activePiece.style.top = `${maxY}px`
      } else {
        activePiece.style.top = `${y}px`
      }
    }
  }

  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current
    if (activePiece && chessboard) {
      // find the current grid position
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 80)
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 640) / 80))

      // UPDATE THE PIECE POSITION
      setPieces((value) => {
        return value.map((piece) => {
          // if the piece is in the current grid position
          if (piece.x === gridX && piece.y === gridY) {
            const validMove = referee.isValidMove(gridX, gridY, x, y, piece.type, piece.teamType, value)

            if (validMove) {
              piece.x = x
              piece.y = y
            } else {
              activePiece.style.position = 'relative'
              activePiece.style.removeProperty('top')
              activePiece.style.removeProperty('left')
            }
          }
          return piece
        })
      })

      setActivePiece(null)
    }
  }

  const board = []

  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {
      let image = undefined

      pieces.forEach((piece) => {
        if (piece.x === i && piece.y === j) {
          image = piece.image
        }
      })
      board.push(<Tile key={`${j},${i}`} number_row={i} number_column={j} image={image} />)
    }
  }

  return (
    <div
      role='button'
      tabIndex={0}
      onMouseMove={(e) => movePiece(e)}
      onMouseDown={(e) => grabPiece(e)}
      onMouseUp={(e) => dropPiece(e)}
      id='chess-board'
      ref={chessboardRef}
    >
      {board}
    </div>
  )
}
