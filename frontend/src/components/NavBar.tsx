import { Link, NavigateFunction, useNavigate, useParams } from "react-router-dom";
import React, { FormEvent, ReactElement, useEffect, useState } from "react";
import { api } from "../utilities/axiosInstance";
import { ContextType } from "../types/contextTypes";
import { AxiosResponse } from "axios";
import ServerButton from "./ServerButton";
import { Server } from "../types/serverElementTypes";
import ServersMenuModal from "./ServersMenuModal";
import { Params } from "@/types/ParamsTypes";
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
  myServers,
  setMyServers
}: ContextType): ReactElement => {
  const { server_id } = useParams<Params>()
  const [newServerName, setNewServerName] = useState<string>("");
  const [joinServerID, setJoinServerID] = useState<string>("");
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
      const resp: AxiosResponse = await api.post("servers/", { name: newServerName });
      if (resp.status === 201) {
        const newServer: Server = { id: resp.data["id"], name: resp.data["name"], admin: resp.data["admin"], users: resp.data["users"] }
        console.log(resp.data)
        console.log("Successfully created server.");
        setMyServers([...myServers, newServer]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description The handler for joining an existing server. After successful resolution of the request the newly joined Server is added to the MyServers state and therefore is rendered on the NavBar
   * 
   * @param {FormEvent} e The submission FormEvent
   */
  const handleJoinServer = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await api.put(`servers/${joinServerID}/method/add/`);
      console.log("Successfully joined server.");
      const resp: AxiosResponse = await api.get("servers/");
      console.log(resp.data);
      setMyServers(resp.data);
      console.log('updated servers!');
    } catch (error) {
      console.log(error);
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
        console.log(resp.data)
        setMyServers(resp.data)
      } catch (error) {
        setMyServers([])
        console.log(error)
      }
    }
    getServers()
  }, [currentUser])

  return (
    <>
      <nav className="flex  items-center border-b border-primary-dark mx-4 ">
        <div className=" flex size-full items-center justify-between gap-4 ">
          <div className="flex min-h-16 flex-shrink-0 items-center text-xl">
            <h1>|| DISCLONE || </h1>
          </div>
          <ul className="flex flex-row  w-auto items-center justify-start gap-4  ">
            <li className=""> <ServersMenuModal
              handleAddServer={handleAddServer}
              newServerName={newServerName}
              setNewServerName={setNewServerName}
              handleJoinServer={handleJoinServer}
              joinServerID={joinServerID}
              setJoinServerID={setJoinServerID}
            /></li>
            {/* {myServers ? myServers.map((server, idx) => <li key={idx}><ServerButton server={server} /></li>) : null} */}
            {myServers ? myServers.map((server, idx) => (
              <li key={idx} className={server.id === Number(server_id) ? 'bg-accent-dark' : ''}>
                <ServerButton server={server} />
              </li>
            )) : null}
            <li className=" ">
              <div>

              </div>
            </li>
          </ul>
          <div className="justify-center  ">
            <div className="flex flex-row w-[500] items-center gap-4">
              <Link to="account/">
                <button className="w-auto rounded-md bg-foreground text-primary-dark p-2 transform hover:scale-110 ">
                  Welcome: {currentUser ? currentUser.displayName : null}
                </button>
              </Link>
              {currentUser ? (
                <button
                  className="bg-foreground p-2 rounded-md w-[80px] text-primary-dark transform hover:scale-110"
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
