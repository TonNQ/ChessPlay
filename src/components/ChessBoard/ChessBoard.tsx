import React, { useRef } from 'react'
import Tile from '../Tile/Tile'
import './ChessBoard.css'

const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8']
const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

interface Piece {
  image: string
  x: number
  y: number
}

const pieces: Piece[] = []

// set up pieces
for (let p = 0; p < 2; p++) {
  const type = p === 0 ? 'b' : 'w'
  const y = p === 0 ? 7 : 0

  pieces.push({ image: `assets/images/rook_${type}.png`, x: 0, y: y })
  pieces.push({ image: `assets/images/rook_${type}.png`, x: 7, y: y })
  pieces.push({ image: `assets/images/knight_${type}.png`, x: 1, y: y })
  pieces.push({ image: `assets/images/knight_${type}.png`, x: 6, y: y })
  pieces.push({ image: `assets/images/bishop_${type}.png`, x: 2, y: y })
  pieces.push({ image: `assets/images/bishop_${type}.png`, x: 5, y: y })
  pieces.push({ image: `assets/images/queen_${type}.png`, x: 3, y: y })
  pieces.push({ image: `assets/images/king_${type}.png`, x: 4, y: y })
}

for (let i = 0; i < 8; i++) {
  pieces.push({ image: 'assets/images/pawn_b.png', x: i, y: 6 })
}

for (let i = 0; i < 8; i++) {
  pieces.push({ image: 'assets/images/pawn_w.png', x: i, y: 1 })
}

export default function ChessBoard() {
  const chessboardRef = useRef<HTMLDivElement>(null)

  // set up movement
  let activePiece: HTMLElement | null = null

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement
    if (element.classList.contains('chess-piece')) {
      const x = e.clientX - 40
      const y = e.clientY - 40
      element.style.position = 'absolute'
      element.style.left = `${x}px`
      element.style.top = `${y}px`

      activePiece = element
    }
  }

  function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current

    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 20
      const minY = chessboard.offsetTop - 20
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 60
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 60
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

  function dropPiece() {
    if (activePiece) {
      activePiece = null
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
      onMouseUp={() => dropPiece()}
      id='chess-board'
      ref={chessboardRef}
    >
      {board}
    </div>
  )
}
