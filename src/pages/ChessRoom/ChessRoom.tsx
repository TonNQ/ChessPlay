import ChessBoard, { Piece } from 'src/components/ChessBoard/ChessBoard'
import Clock from 'src/components/Clock/Clock'
import User from 'src/components/User/User'

interface Props {
  pieces: Piece[]
}

export default function ChessRoom({ pieces }: Props) {
  return (
    <div className='flex w-full flex-row'>
      <div className='flex-0 min-w-[300px]'>
        <div className='flex h-full flex-col items-center justify-between'>
          <User />
          <div className='pixel-font text-3xl text-white'>Your turn</div>
          <User />
        </div>
      </div>
      <div className='min-w-[666px] flex-1 flex-grow'>
        <div className='relative h-[666px] w-[666px] border-[2px] border-black/20 bg-darkGray'>
          <div className='absolute left-0 top-0 flex h-[640px] w-[26px] flex-col items-center justify-between bg-none'>
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className='flex h-[80px] w-[26px] items-center justify-start pl-1 font-semibold text-gray-400/45'
              >
                {8 - index}
              </div>
            ))}
          </div>
          <div className='absolute bottom-0 right-0 flex h-[26px] w-[640px] flex-row items-center justify-between bg-none'>
            {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((letter, index) => (
              <div key={index} className='h-[26px] w-[80px] pt-[2px] text-center font-semibold text-gray-400/45'>
                {letter}
              </div>
            ))}
          </div>
          <ChessBoard pieces_board={pieces} />
        </div>
      </div>
      <div className='flex-0 min-w-[300px] px-[25px]'>
        <div className='flex h-full flex-col-reverse items-center'>
          <div className='flex w-full flex-row justify-between'>
            <button className='pixel-font w-[120px] border-none bg-lightBrown/50 px-3 py-2 text-xl uppercase text-white hover:bg-lightBrown/90'>
              reset
            </button>
            <button className='pixel-font w-[120px] border-none bg-lightBrown/50 px-3 py-2 text-xl uppercase text-white hover:bg-lightBrown/90'>
              stop
            </button>
          </div>
          <div className='flex w-full flex-row'>
            <button className='pixel-font mb-2 w-full border-none bg-lightBrown/50 px-3 py-2 text-xl uppercase text-white hover:bg-lightBrown/90'>
              surrender
            </button>
          </div>
          <div className='my-2 flex w-full flex-1 flex-row items-end'>
            <div className='flex max-h-[400px] w-[50%] flex-col-reverse flex-wrap items-center'>
              <img alt='piece' src='assets/images/pawn_w.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_w.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_w.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_w.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_w.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_w.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_w.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_w.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_w.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_w.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_w.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_w.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_w.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_w.png' className='h-[50px] w-[50px]' />
            </div>
            <div className='flex max-h-[400px] w-[50%] flex-col-reverse flex-wrap items-center'>
              <img alt='piece' src='assets/images/pawn_b.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_b.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_b.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_b.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_b.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_b.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_b.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_b.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_b.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_b.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_b.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_b.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_b.png' className='h-[50px] w-[50px]' />
              <img alt='piece' src='assets/images/pawn_b.png' className='h-[50px] w-[50px]' />
            </div>
          </div>
          <Clock />
        </div>
      </div>
    </div>
  )
}
