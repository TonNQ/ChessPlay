/* eslint-disable import/no-unresolved */
import ChessStock from '/assets/images/chess-stock.jpg'

interface Props {
  setIsGameExist: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Home({ setIsGameExist }: Props) {
  return (
    <div className='relative h-[100vh] w-[100vw]'>
      <div className='pixel-font absolute left-1/2 top-1/4 z-50 -translate-x-1/2 -translate-y-1/2 transform text-9xl uppercase text-white/85'>
        Chess
      </div>
      <img alt='ảnh' src={ChessStock} className='absolute h-full w-full object-cover opacity-90' />
      <button
        className='pixel-font absolute bottom-[120px] left-1/2 z-50 -translate-x-1/2 transform border-none bg-lightBrown text-2xl uppercase hover:bg-darkLayout'
        onClick={() => setIsGameExist(true)}
      >
        Play new game
      </button>
    </div>
  )
}
