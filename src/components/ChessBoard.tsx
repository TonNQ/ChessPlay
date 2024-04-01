import React from 'react'

import './ChesBoard.css'

const verticalAxis = ['1', '2', '3', '4', '5', '6', '7', '8']
const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

export default function ChessBoard() {
  const board = []
  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {
      if (j % 2 ==  i % 2) {
        board.push(<div className='tile black-tile'></div>)
      } else {
        board.push(<div className='tile white-tile'></div>)
      }
    }
  }

  return <div id='checkboard'>
    {board}
  </div>
}
