export default function User() {
  return (
    <div className='flex h-[250px] w-[200px] flex-col items-center justify-center rounded-xl bg-gray-900/15'>
      <div className='relative h-[140px] w-[140px] min-w-[140px] rounded-md'>
        <img
          src='https://plus.unsplash.com/premium_photo-1671397272333-5807b32630f3?q=80&w=1854&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt='AI avt'
          className='absolute left-0 top-0 mx-auto h-full w-full rounded-md object-cover'
        />
      </div>
      <div className='pixel-font py-1 text-2xl text-white/90'>Computer</div>
      <div className='pixel-font text-xl text-white/70'>
        Win : <span>0</span> / <span>1</span>
      </div>
    </div>
  )
}
