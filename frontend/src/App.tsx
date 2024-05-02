import { useState, useEffect } from "react";
import "./App.css";
import { Outlet, useLoaderData } from "react-router-dom";
import NavBar from "./components/NavBar";
import { User } from "./types/userTypes";
import { ContextType } from "./types/contextTypes";
import { Server } from "./types/serverElementTypes";

/**
 * @description The main App component that renders all pages and components within the
 * Outlet, as well as the NavBar.
 * 
 * @returns {ReactElement} The application pages with all related components
 */
function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(
    useLoaderData() as User | null
  );
  const [myServers, setMyServers] = useState<Server[]>([]);


  useEffect(() => {
    console.log(`Current User Display Name: ${currentUser?.displayName}`);
    console.log(`Current User First Name: ${currentUser?.firstName}`);
    console.log(`Current User Last Name: ${currentUser?.lastName}`);
  }, [currentUser]);

  return (
    <>
      {/* I would like to make it so nav bar is always there, but the buttons on it render based 
      on if current user exists, but it was giving me a type error for now. */}
      {currentUser ? (
        <NavBar currentUser={currentUser} setCurrentUser={setCurrentUser} myServers={myServers} setMyServers={setMyServers} />
      ) : null}
      <Outlet context={{ currentUser, setCurrentUser, myServers, setMyServers } satisfies ContextType} />
    </>
  );
}

export default App;
