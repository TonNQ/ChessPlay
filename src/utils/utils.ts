import { CheckMoved } from 'src/apis/board.api'
import { Piece, PieceType, TeamType } from 'src/components/ChessBoard/ChessBoard'
import { Position } from 'src/models/Position'

export function getPieceName(pieceChar: string): string {
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

export const getPieceImageUrl = (signName: string) => {
  if (signName[0] === 'W') {
    return getPieceName(signName[-1]) + '_w.png'
  } else {
    return getPieceName(signName[-1]) + '_b.png'
  }
}

export const getPieceType = (sign: string) => {
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

export const exportPieces = (chess_pieces: Array<Array<string | number>>, white_moved: CheckMoved) => {
  const pieces: Piece[] = []
  for (let y = 0; y < chess_pieces.length; y++) {
    for (let x = 0; x < chess_pieces[y].length; x++) {
      if (typeof chess_pieces[x][y] === 'string') {
        const piece: Piece = {
          image: `assets/images/${getPieceName((chess_pieces[x][y] as string).charAt((chess_pieces[x][y] as string).length - 1))}-${(chess_pieces[x][y] as string).startsWith('W') ? 'w' : 'b'}.svg`,
          position: new Position(x, y),
          type: getPieceType(
            (chess_pieces[x][y] as string).charAt((chess_pieces[x][y] as string).length - 1)
          ) as PieceType,
          teamType: (chess_pieces[x][y] as string).startsWith('W') ? TeamType.USERTEAM : TeamType.COMPUTERTEAM,
          enPassant: false,
          hasMoved:
            ((getPieceType(
              (chess_pieces[x][y] as string).charAt((chess_pieces[x][y] as string).length - 1)
            ) as PieceType) === PieceType.KING &&
              (chess_pieces[x][y] as string).startsWith('W') &&
              !white_moved.king) ||
            ((getPieceType(
              (chess_pieces[x][y] as string).charAt((chess_pieces[x][y] as string).length - 1)
            ) as PieceType) === PieceType.ROOK &&
              (chess_pieces[x][y] as string).startsWith('W') &&
              ((x === 0 && y === 0 && !white_moved.queenside_rook) ||
                (x === 7 && y === 0 && !white_moved.kingside_rook)))
              ? false
              : true
        }
        pieces.push(piece)
      }
    }
  }
  return pieces
}
