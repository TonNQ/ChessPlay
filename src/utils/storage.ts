export const setGameIdToLocalStorage = (gameId: string) => {
  localStorage.setItem('id', gameId)
}

export const getGameIdFromLocalStorage = () => {
  return localStorage.getItem('id') || ''
}

export const clearLocalStorage = () => localStorage.removeItem('id')
