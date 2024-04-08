/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'

export default function Clock() {
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log(seconds)
      setSeconds((seconds) => {
        if (seconds + 1 >= 60) {
          setMinutes((minutes) => minutes + 1)
          return (seconds + 1) % 60
        } else {
          return seconds + 1
        }
      })
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <div className='pixel-font flex w-full flex-row items-center justify-center py-2 text-7xl text-white/50'>
      <span className='mr-2 text-right'>{minutes <= 9 ? '0' + minutes : minutes}</span> :{' '}
      <span className='ml-2 text-left'>{seconds <= 9 ? '0' + seconds : seconds}</span>
    </div>
  )
}
