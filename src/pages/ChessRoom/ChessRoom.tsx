import { useState } from 'react'
import { toast } from 'react-toastify'
import boardApi from 'src/apis/board.api'
import ChessBoard, { Piece } from 'src/components/ChessBoard/ChessBoard'
import Clock from 'src/components/Clock/Clock'
import User from 'src/components/User/User'
import { clearLocalStorage, setGameIdToLocalStorage } from 'src/utils/storage'
import { getPieceName } from 'src/utils/utils'

interface Props {
  pieces: Piece[]
  initWhitePieceCaptured: string[]
  initBlackPieceCaptured: string[]
  setGameId: React.Dispatch<React.SetStateAction<string | null>>
}

export default function ChessRoom({ pieces, initWhitePieceCaptured, initBlackPieceCaptured, setGameId }: Props) {
  const [blackPieceCaptured, setBlackPieceCaptured] = useState<string[]>(initBlackPieceCaptured || [])
  const [whitePieceCaptured, setWhitePieceCaptured] = useState<string[]>(initWhitePieceCaptured || [])
  const [isUserTurn, setIsUserTurn] = useState<boolean>(true)
  const [isFinished, setIsFinished] = useState<boolean>(false)
  const [winner, setWinner] = useState<string>('')
  const [isResetClock, setIsResetClock] = useState<boolean>(false)

  const resetStates = () => {
    setBlackPieceCaptured(initBlackPieceCaptured || [])
    setWhitePieceCaptured(initWhitePieceCaptured || [])
    setIsUserTurn(true)
    setIsFinished(false)
    setWinner('')
    setGameId(null)
    setIsResetClock(false)
  }

  const handleSurrender = () => {
    setIsFinished(true)
    setWinner('Computer')
    clearLocalStorage()
  }

  const handleResetGame = () => {
    setIsFinished(false)
    clearLocalStorage()
    resetStates()
    boardApi
      .createGame()
      .then((response) => {
        setGameIdToLocalStorage(response.data.id)
        setGameId(response.data.id)
        setWinner('')
        setIsFinished(false)
      })
      .catch((error) => {
        toast.error(error.message)
      })
  }

  const handleClick = () => {
    resetStates()
    setIsResetClock(true)
    boardApi
      .createGame()
      .then((response) => {
        setGameIdToLocalStorage(response.data.id)
        setGameId(response.data.id)
        setWinner('')
        setIsFinished(false)
      })
      .catch((error) => {
        toast.error(error.message)
      })
  }

  return (
    <div className='h-full w-full'>
      <div id='result_modal' className={isFinished ? '' : 'hidden'}>
        <div className='absolute left-1/2 top-1/2 z-10 flex h-full w-full -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center rounded-lg bg-darkLayout/75 shadow-md'>
          <div className='pixel-font text-6xl text-white'>{winner === 'Computer' ? 'Computer wins' : 'You win'}</div>
          <button
            className='pixel-font mt-5 min-w-[150px] border-none bg-white px-10 py-3 text-3xl text-black hover:cursor-pointer hover:bg-white/85'
            onClick={handleClick}
          >
            Play again
          </button>
        </div>
      </div>
      <div className='relative flex w-full flex-row'>
        <div className='flex-0 min-w-[300px]'>
          <div className='flex h-full flex-col items-center justify-between'>
            <User
              name='Computer'
              avatar='https://plus.unsplash.com/premium_photo-1671397272333-5807b32630f3?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            />
            <div className='pixel-font text-3xl text-white'>{isUserTurn ? 'Your turn' : 'Computer turn'}</div>
            <User name='You' avatar='https://dut.udn.vn/Files/admin/images/Tin_tuc/Khac/2020/LogoDUT/image002.jpg' />
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
            <ChessBoard
              pieces_board={pieces}
              setWhitePieceCaptured={setWhitePieceCaptured}
              setBlackPieceCaptured={setBlackPieceCaptured}
              setIsUserTurn={setIsUserTurn}
              isFinished={isFinished}
              setIsFinished={setIsFinished}
              winner={winner}
              setWinner={setWinner}
            />
          </div>
        </div>
        <div className='flex-0 min-w-[300px] px-[25px]'>
          <div className='flex h-full flex-col-reverse items-center'>
            <div className='flex w-full flex-row justify-between'>
              <button
                className='pixel-font w-[100px] border-none bg-lightBrown/50 px-3 py-2 text-xl uppercase text-white hover:bg-lightBrown/90'
                onClick={handleResetGame}
              >
                reset
              </button>
              {/* <button className='pixel-font w-[120px] border-none bg-lightBrown/50 px-3 py-2 text-xl uppercase text-white hover:bg-lightBrown/90'>
                stop
              </button> */}
              <button
                className='pixel-font border-none bg-lightBrown/50 px-3 py-2 text-xl uppercase text-white hover:bg-lightBrown/90'
                onClick={handleSurrender}
              >
                surrender
              </button>
            </div>
            {/* <div className='flex w-full flex-row'>
              <button
                className='pixel-font mb-2 w-full border-none bg-lightBrown/50 px-3 py-2 text-xl uppercase text-white hover:bg-lightBrown/90'
                onClick={handleSurrender}
              >
                surrender
              </button>
            </div> */}
            <div className='my-2 flex w-full flex-1 flex-row items-end'>
              <div className='flex max-h-[400px] w-[50%] flex-col-reverse flex-wrap items-center'>
                {whitePieceCaptured.map((piece) => (
                  <img
                    key={piece}
                    alt='piece'
                    src={`assets/images/${getPieceName(piece[piece.length - 1])}-w.svg`}
                    className='h-[50px] w-[50px]'
                  />
                ))}
              </div>
              <div className='flex max-h-[400px] w-[50%] flex-col-reverse flex-wrap items-center'>
                {blackPieceCaptured.map((piece) => (
                  <img
                    key={piece}
                    alt='piece'
                    src={`assets/images/${getPieceName(piece[piece.length - 1])}-b.svg`}
                    className='h-[50px] w-[50px]'
                  />
                ))}
              </div>
            </div>
            <Clock isResetClock={isResetClock} setIsResetClock={setIsResetClock} />
          </div>
        </div>
      </div>
    </div>
  )
}
