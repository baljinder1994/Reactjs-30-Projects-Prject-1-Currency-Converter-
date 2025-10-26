import React, { useState } from 'react'

const App = () => {
  const[cgpa,setCgpa]=useState("")
  const[p,setP]=useState(null)
  const[msg,setMsg]=useState("")

  const handleConvert = () => {
     if(cgpa === "" || cgpa < 0 || cgpa > 10){
      setMsg("Please enter a valid CGPA")
      setP(null)
      return
     }

     const percent=(cgpa * 9.5).toFixed(2)
     setP(percent)
     setMsg("")
  }
  const handleReset = () => {
    setCgpa("")
    setP(null)
    setMsg("")
  }
  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-6'>
      <div className='bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center'>
        <h1>CGPA to Percentage</h1>
        <p className='text-gray-300 mb-6'>Enter your CGPA to get your percentage.</p>
      
      <input
      value={cgpa}
      onChange={(e) => setCgpa(e.target.value)}
      type="number"
      className='border border-gray-300 w-full mb-4 p-3 '
      ></input>

      <div className='flex gap-3'>
        <button 
        onClick={handleConvert}
        className='w-1/2 bg-indigo-500 text-white py-2 rounded-lg'>Convert</button>
        <button 
         onClick={handleReset}
        className='w-1/2 bg-gray-600 text-white py-2 rounded-lg'>Reset</button>
      </div>

{msg && <p className='text-red-400 mt-4'>{msg}</p>}

{p !== null && (
      <div className='mt-6 bg-gray-700 rounded-lg py-4'>
        <p className='text-xl font-bold text-green-400'>Your Percentage:{p}</p>
      </div>
      )}
      </div>
    </div>
  )
}

export default App
