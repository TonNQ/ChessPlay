import http from 'src/utils/http'

// Kiểm tra các quân cờ vua, xe đã di chuyển chưa (nhập thành)
export interface CheckMoved {
  king: boolean
  kingside_rook: boolean
  queenside_rook: boolean
}

export interface BoardState {
  _id: string
  chess_pieces: Array<Array<string>>
  white_moved: CheckMoved
  black_moved: CheckMoved
  captured_pieces: {
    white: Array<string>
    black: Array<string>
  }
}

export interface NextStepPiece {
  is_finished: boolean
  result: string | null
  x_from: number
  y_from: number
  x_to: number
  y_to: number
  captured_pieces: {
    white: Array<string>
    black: Array<string>
  }
}

const boardApi = {
  createGame() {
    return http.post<{ id: string }>('/create/')
  },
  findGame(id: string) {
    return http.get<BoardState>(`/find/${id}/`)
  },
  updatePieces(id: string, params: { x_from: number; y_from: number; x_to: number; y_to: number }) {
    return http.put<NextStepPiece>(`/update/${id}/`, params)
  },
  deleteBoard(id: string) {
    return http.delete(`/delete/${id}/`)
  }
}

export default boardApi
