export interface Game {
  _id: string
  chess_pieces: Array<Array<string>>
  white_king_moved: boolean
  black_king_moved: boolean
}
