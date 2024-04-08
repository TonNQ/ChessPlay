import http from 'src/utils/http'

const boardApi = {
  createGame() {
    return http.post<{ id: string }>('/create/')
  },
  findGame(id: string) {
    return http.get(`/find/${id}/`)
  },
  updatePieces(id: string, params: { x_from: number; y_from: number; x_to: number; y_to: number }) {
    return http.put<{
      is_finished: boolean
      result: string | null
      x_from: number
      y_from: number
      x_to: number
      y_to: number
    }>(`/update/${id}/`, params)
  }
}

export default boardApi
