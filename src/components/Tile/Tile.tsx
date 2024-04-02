import './Tile.css'

interface Props {
  image?: string
  number_row: number
  number_column: number
}

export default function Tile({ image, number_row, number_column }: Props) {
  if (number_row % 2 === number_column % 2) {
    return (
      <div className='tile black-tile'>
        {image && <div style={{ backgroundImage: `url(${image})` }} className='chess-piece'></div>}
        {/* = {image != null && <div style={{ backgroundImage: `url(${image})` }} className='chess-piece'></div>} */}
      </div>
    )
  } else {
    return (
      <div className='tile white-tile'>
        {image && <div style={{ backgroundImage: `url(${image})` }} className='chess-piece'></div>}
      </div>
    )
  }
}
