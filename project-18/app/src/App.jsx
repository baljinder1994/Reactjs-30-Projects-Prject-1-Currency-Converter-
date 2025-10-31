import React, { useRef, useState } from 'react'

const App = () => {
  const[time,setTime]=useState(0)
  const[running,setRunning]=useState(false)
  const intervalRef= useRef(null)

  const formatTime=(time)=>{
    const ms=Math.floor((time % 1000)/10)
    const s=Math.floor((time/1000) % 60)
    const m=Math.floor((time/60000) % 60)
    const h=Math.floor((time/3600000) % 60)

    return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}.${ms.toString().padStart(2,"0")}`
  }

  const startbtn=()=>{
    if(!running){
      setRunning(true)
      intervalRef.current=setInterval(() =>{
        setTime((prev) => prev + 10)
      },10)
    }
  }

  const pauseBtn=()=>{
    clearInterval(intervalRef.current)
    setRunning(false)
  }

  const resetBtn=()=>{
    clearInterval(intervalRef.current)
    setRunning(false)
    setTime(0)
  }
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white'>
      <h1 className='text-4xl font-bold mb-8 text-blue-400'>StopWatch</h1>
    
    <div className='text-5xl sm:text-6xl font-mono bg-gray-700 py-4 px-8 rounded-2xl shadow-2xl mb-10 text-center tracking-wider'>{formatTime(time)}</div>
    
    <div className='flex gap-4'>
      <button 
      onClick={startbtn}
      className="bg-green-500 px-6 py-3 rounded-xl text-lg font-bold ">Start</button>
      <button onClick={pauseBtn}className="bg-yellow-500 px-6 py-3 rounded-xl text-lg font-bold ">Pause</button>
      <button onClick={resetBtn}className="bg-red-500 px-6 py-3 rounded-xl text-lg font-bold ">Reset</button>
    </div>
    </div>
  )
}

export default App
