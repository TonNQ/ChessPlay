import { PieceType, TeamType } from 'src/components/ChessBoard/ChessBoard'

export default class Referee {
  isValidMove(px: number, py: number, x: number, y: number, type: PieceType, team: TeamType) {
    console.log('Checking if move is valid');
    console.log('Previous x: ' + px + ' Previous y: ' + py + ' New x: ' + x + ' New y: ' + y + ' Type: ' + type);
    console.log('Team: ' + team)

    if (type === PieceType.PAWN) {
      if (team === TeamType.USERTEAM) {
        if (py === 1) {
          if (px === x && (y - py === 1 || y - py === 2)) {
            return true
          }
        } else {
          if (px === x && y - py === 1) {
            return true
          }
        }
      }
    }
    return false
  }
}
