import React, { useState } from 'react'

const App = () => {
  const[word,setWord]=useState("")
  const[error,setError]=useState("")
  const[data,setData]=useState(null)

  const fetchMeaning= async()=>{
    if(!word.trim()) return

    setError("")
    setData(null)
    try{
      const res= await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      if(!res.ok) throw new Error("Word not found")
        const result= await res.json()
      setData(result[0])
    }catch(err){
      setError("No definition found")
    }
  }

  const playAudio=(url)=>{
    const audio= new Audio(url)
    audio.play()
  }
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center p-6'>
      <div className='bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-xl'>
        <h1 className='text-3xl font-bold text-center'>Smart Dictionary</h1>
     
      <div className='flex gap-2 mb-6'>
        <input type="text"
        placeholder='Enter a word(e.g. hello)'
        value={word}
        onChange={(e) => setWord(e.target.value)}
        className='flex-1 border border-gray-500 rounded-xl p-3 '
        ></input>

        <button 
        className='bg-indigo-600 text-white px-5 rounded-xl'
        onClick={fetchMeaning}>Search</button>
      </div>


{error &&(
 <p>{error} </p>
)}
{data &&(
     
     <div className='text-gray-800'>
      <div className='flex justify-between items-center mb-2'>
        <h2 className='text-2xl font-bold capitalize'>{data.word}</h2>
        {data.phonetics?.some(p => p.audio) ?(
          <button
          onClick={() =>{
            const audioUrl=data.phonetics.find(p => p.audio)?.audio;
            if(audioUrl){
              const audio=new Audio(audioUrl)
              audio.play()
            }else{
              alert("No pronounciation av.")
            }
          }}
          className='bg-blue-100  p-2 rounded-full'
          >🔊</button>
        ):(
          <button >🔇</button>
        )}
      </div>

      <p className='text-indigo-500 text-lg italic'>{data.phonetic || "_"}</p>

      <div className='mt-4 space-y-4'>
        {data.meanings.map((meaning,idx) =>(
          <div className='bg-gray-50 border-l-4 border-indigo-400 p-3 rounded-xl'>
            <p className='font-bold text-indigo-600'>{meaning.partOfSpeech}</p>
            {meaning.definitions.map((def,i) =>(
              <div className='mt-2'>
                <p className='text-gray-700'><span className='font-semibold'>Definition:</span>{" "}
                {def.definition}
                </p>
                {def.example &&(
                  <p className='text-sm text-gray-500 italic mt-1'>"{def.example}"</p>
                )}
              </div>
            ))}
          
          </div>
        ))}
      </div>
     </div>
     )}
      </div>
    </div>
  )
}

export default App
