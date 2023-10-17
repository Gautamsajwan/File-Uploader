import React from 'react'

function Loader() {
  return (
    <div className="text-white absolute top-0 left-0 w-full h-screen bg-black/50 flex flex-col justify-center items-center gap-5 backdrop-blur-md z-20">
        <div className="w-[80px] h-[80px] outline outline-[7px] rounded-[28px] outline-green-500 animate-spin"></div>
        <h1 className="text-lg font-bold animate-pulse tracking-wide">Uploading</h1>
    </div>
  )
}

export default Loader