import http from 'src/utils/http'

const boardApi = {
  createGame() {
    return http.post<{ id: string }>('/create/')
  },
  findGame(id: string) {
    return http.get(`/find/${id}/`)
  }
}

export default boardApi
