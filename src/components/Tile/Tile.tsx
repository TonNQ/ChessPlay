/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import './Tile.css'

interface Props {
  image?: string
  number_row: number
  number_column: number
  onClick: () => void
  isActive: boolean
  isHighlight: boolean
}

export default function Tile({ image, number_row, number_column, onClick, isActive, isHighlight }: Props) {
  console.log(isActive)
  if (number_row % 2 === number_column % 2) {
    return (
      <div
        className={`tile relative hover:cursor-default ${isActive ? 'bg-lightLayout' : 'black-tile'}`}
        onClick={onClick}
      >
        {image && (
          <div
            style={{ backgroundImage: `url(${image})` }}
            className={`chess-piece ${isHighlight ? 'bg-lightBrown' : ''}`}
          ></div>
        )}
        {isHighlight && !image && (
          <div className='absolute left-1/2 top-1/2 h-[20px] w-[20px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-lightLayout shadow-lg'></div>
        )}
      </div>
    )
  } else {
    return (
      <div
        className={`tile relative hover:cursor-default ${isActive ? 'bg-lightLayout' : 'white-tile'}`}
        onClick={onClick}
      >
        {image && (
          <div
            style={{ backgroundImage: `url(${image})` }}
            className={`chess-piece ${isHighlight ? 'bg-lightBrown' : ''}`}
          ></div>
        )}
        {isHighlight && !image && (
          <div className='absolute left-1/2 top-1/2 h-[20px] w-[20px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-lightLayout shadow-lg'></div>
        )}
      </div>
    )
  }
}
