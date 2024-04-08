import http from 'src/utils/http'

const boardApi = {
  createGame() {
    return http.post<{ id: string }>('/create/')
  }
}

export default boardApi
