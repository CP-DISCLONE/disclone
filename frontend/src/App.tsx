import { useState, useEffect } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import NavBar from './components/NavBar'
import { User } from './types/usertypes'

interface Context {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>
}



function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    console.log(`Current User Display Name: ${currentUser?.displayName}`)
    console.log(`Current User First Name: ${currentUser?.firstName}`)
    console.log(`Current User Last Name: ${currentUser?.lastName}`)
  }, [currentUser])

  return (
    <>
      {/* I would like to make it so nav bar is always there, but the buttons on it render based on if current user exists, but it was giving me a type error for now. */}
      {currentUser ? <NavBar currentUser={currentUser} /> : null}
      <Outlet context={{ currentUser, setCurrentUser } satisfies Context} />

    </>
  )
}

export default App
