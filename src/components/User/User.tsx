interface Props {
  name: string
  avatar: string
}

export default function User({ name, avatar }: Props) {
  return (
    <div className='flex h-[250px] w-[200px] flex-col items-center justify-center rounded-xl bg-gray-900/15'>
      <div className='relative h-[140px] w-[140px] min-w-[140px] rounded-md'>
        <img
          src={avatar}
          alt='AI avt'
          className='absolute left-0 top-0 mx-auto h-full w-full rounded-md object-cover'
        />
      </div>
      <div className='pixel-font py-1 text-2xl text-white/90'>{name}</div>
      {/* <div className='pixel-font text-xl text-white/70'>
        Win : <span>0</span> / <span>1</span>
      </div> */}
    </div>
  )
}
