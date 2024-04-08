import { Piece, PieceType, TeamType } from 'src/components/ChessBoard/ChessBoard'
import { Position } from 'src/models/Position'

function getPieceName(pieceChar: string): string {
  switch (pieceChar) {
    case 'P':
      return 'pawn'
    case 'N':
      return 'knight'
    case 'B':
      return 'bishop'
    case 'R':
      return 'rook'
    case 'Q':
      return 'queen'
    case 'K':
      return 'king'
    default:
      return ''
  }
}

const getPieceType = (sign: string) => {
  switch (sign) {
    case 'P':
      return PieceType.PAWN
    case 'N':
      return PieceType.KNIGHT
    case 'B':
      return PieceType.BISHOP
    case 'R':
      return PieceType.ROOK
    case 'Q':
      return PieceType.QUEEN
    case 'K':
      return PieceType.KING
  }
}

export const exportPieces = (chess_pieces: Array<Array<string | number>>) => {
  const pieces: Piece[] = []
  for (let col = 0; col < chess_pieces.length; col++) {
    for (let row = 0; row < chess_pieces[col].length; row++) {
      if (typeof chess_pieces[row][col] === 'string') {
        const piece: Piece = {
          image: `assets/images/${getPieceName((chess_pieces[row][col] as string).charAt((chess_pieces[row][col] as string).length - 1))}-${(chess_pieces[row][col] as string).startsWith('W') ? 'w' : 'b'}.svg`,
          position: new Position(row, col),
          type: getPieceType(
            (chess_pieces[row][col] as string).charAt((chess_pieces[row][col] as string).length - 1)
          ) as PieceType,
          teamType: (chess_pieces[row][col] as string).startsWith('W') ? TeamType.USERTEAM : TeamType.COMPUTERTEAM,
          enPassant: false
        }
        pieces.push(piece)
      }
    }
  }
  return pieces
}
