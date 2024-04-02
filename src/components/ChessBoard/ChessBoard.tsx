import React, { useRef, useState } from 'react'
import Tile from '../Tile/Tile'
import './ChessBoard.css'
import { setgid } from 'process'

const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8']
const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

interface Piece {
  image: string
  x: number
  y: number
}

const initialPieces: Piece[] = []
// set up pieces
for (let p = 0; p < 2; p++) {
  const type = p === 0 ? 'b' : 'w'
  const y = p === 0 ? 7 : 0

  initialPieces.push({ image: `assets/images/rook_${type}.png`, x: 0, y: y })
  initialPieces.push({ image: `assets/images/rook_${type}.png`, x: 7, y: y })
  initialPieces.push({ image: `assets/images/knight_${type}.png`, x: 1, y: y })
  initialPieces.push({ image: `assets/images/knight_${type}.png`, x: 6, y: y })
  initialPieces.push({ image: `assets/images/bishop_${type}.png`, x: 2, y: y })
  initialPieces.push({ image: `assets/images/bishop_${type}.png`, x: 5, y: y })
  initialPieces.push({ image: `assets/images/queen_${type}.png`, x: 3, y: y })
  initialPieces.push({ image: `assets/images/king_${type}.png`, x: 4, y: y })
}

for (let i = 0; i < 8; i++) {
  initialPieces.push({ image: 'assets/images/pawn_b.png', x: i, y: 6 })
}

for (let i = 0; i < 8; i++) {
  initialPieces.push({ image: 'assets/images/pawn_w.png', x: i, y: 1 })
}


export default function ChessBoard() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null)
  const [gridX, setGridX] = useState(0)
  const [gridY, setGridY] = useState(0)
  const [pieces, setPieces] = useState<Piece[]>(initialPieces)
  const chessboardRef = useRef<HTMLDivElement>(null)

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement
    const chessboard = chessboardRef.current
    if (element.classList.contains('chess-piece') && chessboard) {
      setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 80))
      setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 640) / 80)))
      const x = e.clientX - 40
      const y = e.clientY - 40
      element.style.position = 'absolute'
      element.style.left = `${x}px`
      element.style.top = `${y}px`

      setActivePiece(element)
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

  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 80)
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 640) / 80))

      setPieces((value) => {
        return value.map((piece) => {
          if (piece.x === gridX && piece.y === gridY) {
            piece.x = x
            piece.y = y
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
