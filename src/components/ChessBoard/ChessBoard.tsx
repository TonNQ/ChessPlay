import { useRef, useState } from 'react'
import Tile from '../Tile/Tile'
import './ChessBoard.css'
import Referee from 'src/referee/referee.ts'
import { Position } from 'src/models/Position'

const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8']
const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

export interface Piece {
  image: string
  position: Position
  type: PieceType
  teamType: TeamType
  enPassant?: boolean
}

export enum PieceType {
  PAWN,
  BISHOP,
  KNIGHT,
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

export default function ChessBoard() {
  const [activePosition, setActivePosition] = useState<Position | null>(null)
  const [possiblePosition, setPossiblePosition] = useState<Position[]>([])
  const [pieces, setPieces] = useState<Piece[]>(initialPieces)
  const [promotionPawn, setPromotionPawn] = useState<Piece | null>(null)
  const promotionRef = useRef<HTMLDivElement>(null)
  const referee = new Referee()

  const handleClick = (i: number, j: number) => {
    if (activePosition) {
      const new_position = new Position(i, j)
      const currentPiece = pieces.find((piece) => piece.position.samePosition(activePosition))
      // const destinationPiece = pieces.find((piece) => piece.position.samePosition(new Position(i, j)))
      if (currentPiece) {
        const validMove = referee.isValidMove(
          activePosition,
          new_position,
          currentPiece?.type,
          currentPiece?.teamType,
          pieces
        )
        const isEnPassantMove = referee.isEnPassantMove(activePosition, new_position, currentPiece.type, pieces)
        if (isEnPassantMove) {
          // if the move is en passant, remove the piece that is in the bottom of moved piece

          // result ==> arrays of updated pieces; piece ==> handling piece
          const updatedPieces = pieces.reduce((results, piece) => {
            if (piece.position.samePosition(activePosition)) {
              piece.enPassant = false
              piece.position = new_position.copy()
              results.push(piece)
            } else if (!(piece.position.x === new_position.x && piece.position.y === new_position.y - 1)) {
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
            if (piece.position.samePosition(activePosition)) {
              if (Math.abs(activePosition.y - new_position.y) === 2 && piece.type === PieceType.PAWN) {
                // SPECIAL MOVE: EN PASSANT
                piece.enPassant = true
              } else {
                piece.enPassant = false
              }
              // if the piece is current piece, set the new position and push to the result
              piece.position = new_position.copy()

              const promotionRow = piece.teamType === TeamType.USERTEAM ? 7 : 0
              if (piece.position.y === promotionRow && piece.type === PieceType.PAWN) {
                promotionRef.current?.classList.remove('hidden')
                setPromotionPawn(piece)
              }

              results.push(piece)
            } else if (!piece.position.samePosition(new_position)) {
              if (piece.type === PieceType.PAWN) {
                piece.enPassant = false
              }
              // if the piece is not attacked, push to the result
              results.push(piece)
            }

            return results
          }, [] as Piece[])

          setPieces(updatedPieces)
        }
      }
      setActivePosition(null)
      setPossiblePosition([])
    } else {
      const currentPiece = pieces.find((piece) => piece.position.samePosition(new Position(i, j)))
      if (currentPiece?.teamType === TeamType.USERTEAM) {
        setActivePosition(new Position(i, j))
        setPossiblePosition(referee.getPossibleMoves(currentPiece, pieces))
      }
    }
  }

  const board = []

  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {
      let image = undefined

      pieces.forEach((piece) => {
        if (piece.position.x === i && piece.position.y === j) {
          image = piece.image
        }
      })
      const p = new Position(i, j)
      const isActive = (activePosition && activePosition.samePosition(p)) as boolean
      const isHighlight = possiblePosition.some((position) => position.samePosition(p))
      board.push(
        <Tile
          key={`${j},${i}`}
          number_row={i}
          number_column={j}
          image={image}
          onClick={() => handleClick(i, j)}
          isActive={isActive}
          isHighlight={isHighlight}
        />
      )
    }
  }

  function promotePawn(pieceType: PieceType) {
    if (promotionPawn === null) {
      return
    }

    const updatedPieces = pieces.reduce((results, piece) => {
      if (piece.position.samePosition(promotionPawn.position)) {
        piece.type = pieceType
        const color = piece.teamType === TeamType.USERTEAM ? 'w' : 'b'
        piece.image = `assets/images/${PieceType[pieceType].toLowerCase()}-${color}.svg`
      }

      results.push(piece)
      return results
    }, [] as Piece[])

    setPieces(updatedPieces)

    promotionRef.current?.classList.add('hidden')
  }

  return (
    <>
      <div id='pawn-promotion-modal' className='hidden' ref={promotionRef}>
        <div className='modal-body'>
          <header className='modal-header'>Choose your promotion piece:</header>
          <div className='modal-container'>
            <img
              onClick={() => promotePawn(PieceType.QUEEN)}
              aria-hidden='true'
              src='assets/images/queen-w.svg'
              alt='queen'
            />
            <img
              onClick={() => promotePawn(PieceType.ROOK)}
              aria-hidden='true'
              src='assets/images/rook-w.svg'
              alt='rook'
            />
            <img
              onClick={() => promotePawn(PieceType.BISHOP)}
              aria-hidden='true'
              src='assets/images/bishop-w.svg'
              alt='bishop'
            />
            <img
              onClick={() => promotePawn(PieceType.KNIGHT)}
              aria-hidden='true'
              src='assets/images/knight-w.svg'
              alt='knight'
            />
          </div>
        </div>
      </div>
      <div role='button' tabIndex={0} id='chess-board'>
        {board}
      </div>
    </>
  )
}
