import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import React, { FormEvent, ReactElement, useEffect, useState } from "react";
import { api } from "../utilities/axiosInstance";
import { ContextType } from "../types/contextTypes";
import { AxiosResponse } from "axios";
import ServerButton from "./ServerButton";
import { Server } from "../types/serverElementTypes";
import NewServerModal from "./NewServerModal";

import { badgeVariants } from "@/components/ui/badge"



/**
 * @description The NavBar that displays on the application over each page and displays
 * the current User's display name and all relevant links to the User's available
 * servers
 * 
 * @param {ContextType} props The props passed in from App to the component
 * 
 * @returns {ReactElement} The NavBar component
 */
const NavBar: React.FC<ContextType> = ({
  currentUser,
  setCurrentUser,
}: ContextType): ReactElement => {
  const [myServers, setMyServers] = useState<Server[]>([])
  const [newServerName, setNewServerName] = useState<string>("")
  const navigate: NavigateFunction = useNavigate();

  /**
   * @description The handler for a User's logout request. After successful resolution of the
   * request, the User's token is cleared from local storage and the backend AxiosInstance
   * headers and they are navigated to the LandingPage
   * 
   * @param {FormEvent} e The submission FormEvent
   */
  const handleLogOut = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await api.post("users/logout/");
      console.log("Successfully logged out!");
      localStorage.removeItem("token");
      delete api.defaults.headers.common['Authorization']
      setCurrentUser(null);
      navigate("/");
    } catch (error) {
      console.log("Failed to log out: ", error);
    }
  };
  /**
   * @description The handler for creating a new server. After successful resolution of the request the new Server is added to the MyServers state and therefore is rendered on the NavBar
   * 
   * @param {FormEvent} e The submission FormEvent
   */
  const handleAddServer = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const resp: AxiosResponse = await api.post("servers/", { name: newServerName })
      console.log("Successfully created server.")
      setMyServers([...myServers, resp.data])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    /**
     * @description Makes a request to get any servers associated to the user. After resolution of the request, the servers are added tot he MyServers state and therefore are rendered on the NavBar
     */
    const getServers = async (): Promise<void> => {
      try {
        const resp: AxiosResponse = await api.get("servers/");
        console.log('loading servers')
        setMyServers(resp.data)
      } catch (error) {
        console.log(error)
      }
    }
    getServers()
  }, [])

  return (
    <>
      <nav className="flex w-full items-center border-b border-black bg-white px-[5%] ">
        <div className="mx-2 flex size-full items-center justify-between gap-4 ">
          <div className="flex min-h-16 flex-shrink-0 items-center">
            <h1>DISCLONE</h1>
          </div>
          <ul className="   flex  w-full flex-col items-center justify-start border-b   pt-4 lg:flex-row lg:justify-center lg:border-none ">
            <li> <NewServerModal
              handleAddServer={handleAddServer}
              newServerName={newServerName}
              setNewServerName={setNewServerName}
            /></li>
            {myServers ? myServers.map((server, idx) => <li key={idx}><ServerButton server={server} /></li>) : null}

            <li className=" ">
              <div>
               
              </div>
            </li>
          </ul>
          <div className="justify-center  ">
            <div className="flex flex-row w-[300] items-center gap-4">
              <Link to="account/">
                <button className="border border-slate-800 p-2 rounded-md ">
                  {currentUser ? currentUser.displayName : null}
                </button>
              </Link>
              {currentUser ? (
                <button
                  className="border border-slate-800 p-2 rounded-md w-[80px] "
                  onClick={(e) => {
                    handleLogOut(e);
                  }}
                >
                  Log Out
                </button>
              ) : null}
            </div>
           
          </div>
        </div>
      </nav >
    </>
  );
};

export default NavBar;
