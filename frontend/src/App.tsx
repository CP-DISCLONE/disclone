import { useState } from 'react'
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


  return (
    <>
      <NavBar />
      <Outlet context={{ currentUser, setCurrentUser } satisfies Context} />

    </>
  )
}

export default App
