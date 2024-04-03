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
  enPassant?: boolean
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

      const currentPiece = pieces.find((piece) => piece.x === gridX && piece.y === gridY)
      // const attackPiece = pieces.find((piece) => piece.x === x && piece.y === y)

      if (currentPiece) {
        const validMove = referee.isValidMove(gridX, gridY, x, y, currentPiece?.type, currentPiece?.teamType, pieces)

        const isEnPassantMove = referee.isEnPassantMove(
          gridX,
          gridY,
          x,
          y,
          currentPiece.type,
          currentPiece.teamType,
          pieces
        )

        if (isEnPassantMove) {
          // if the move is en passant, remove the piece that is in the bottom of moved piece

          // result ==> arrays of updated pieces; piece ==> handling piece
          const updatedPieces = pieces.reduce((results, piece) => {
            if (piece.x === gridX && piece.y === gridY) {
              piece.enPassant = false
              piece.x = x
              piece.y = y
              results.push(piece)
            } else if (!(piece.x === x && piece.y === y - 1)) {
              if (piece.type == PieceType.PAWN) {
                piece.enPassant = false
              }
              results.push(piece)
            }

            return results
          }, [] as Piece[])

          setPieces(updatedPieces)
        } else if (validMove) {
          // update the piece position
          // if piece is attacked, remove the piece
          const updatedPieces = pieces.reduce((results, piece) => {
            if (piece.x === gridX && piece.y === gridY) {
              if (Math.abs(gridY - y) === 2 && piece.type === PieceType.PAWN) {
                // SPECIAL MOVE: EN PASSANT
                piece.enPassant = true
              } else {
                piece.enPassant = false
              }
              // if the piece is current piece, set the new position and push to the result
              piece.x = x
              piece.y = y
              results.push(piece)
            } else if (!(piece.x === x && piece.y === y)) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassant = false
              }
              // if the piece is not attacked, push to the result
              results.push(piece)
            }

            return results
          }, [] as Piece[])

          setPieces(updatedPieces)
        } else {
          // reset the piece position
          activePiece.style.position = 'relative'
          activePiece.style.removeProperty('top')
          activePiece.style.removeProperty('left')
        }
      }

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
