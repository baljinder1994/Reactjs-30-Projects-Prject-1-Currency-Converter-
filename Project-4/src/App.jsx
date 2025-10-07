import React, { useState } from 'react'

const App = () => {

  const[password,setPassword]=useState("")
  const[strength,setStrength]=useState("")
  const[suggestions,setSuggestions]=useState([])

  const calStrength=(pwd)=>{
    let score=0;
    const newSuggestions=[]

    if(pwd.length >= 8) score++
    else newSuggestions.push("Use at least 8 characters")

    if(/[A-Z]/.test(pwd)) score++
    else newSuggestions.push("Use at least one uppercase letter")

    if(/[a-z]/.test(pwd)) score++
    else newSuggestions.push("Use at least one lowercase letter")

    if(/[0-9]/.test(pwd)) score++
    else newSuggestions.push("Use at least one number")

    if(/[^A-Za-z0-9]/.test(pwd)) score++
    else newSuggestions.push("Use at least one special character")


    setSuggestions(newSuggestions)

    if(score <=2) setStrength("Weak")
      else if (score === 3) setStrength("Medium")
    else setStrength("Strong")

    
    }

    const getColor=() =>{
      switch(strength){
        case "Weak":
          return "bg-red-500 w-1/3"
          case "Medium":
          return "bg-yellow-500 w-1/3"
          case "Strong":
          return "bg-green-500 w-1/3"
          default:
            return "bg-gray-300 w-0"
      }

   
  }
  return (
    <div className='min-h-screen  flex items-center justify-center bg-gray-200 '>
      <div className='bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md '>
        <h1 className='text-3xl font-bold text-center mb-6'>Password Strength Checker</h1>
      <input 
      value={password}
      onChange={(e) =>{
        setPassword(e.target.value)
        calStrength(e.target.value)
      }}
      placeholder="Enter your password"
      type="password"className='w-full p-3 border rounded-xl mb-4 focus:ring-2 focus:ring-blue-400 outline-none'></input>
      

      <div className='h-3 w-full bg-gray-200 rounded-full overflow-hidden mb-2'>
        <div className={`h-full transition-all duration-300 rounded-full ${getColor()}`}></div>
      </div>
    
      <p className={`text-center font-bold ${strength === "Weak" ? "text-red-500" : strength === "Medium" ? "text-yellow-500" :"text-green-600"}`}>
        {strength && `Strength : ${strength}`}

      </p>


     {suggestions.length > 0 &&(
      <div className='mt-4 bg-gray-50 p-3 rounded-xl border'>
        <h2>Suggestions to improve:</h2>
        <ul>
          {suggestions.map((tip,index) =>(
            <li key={index}>
             {tip}
          </li>
          ))}
         

        </ul>
      </div>
      )}
      </div>
      
    </div>
  )
}

export default App
