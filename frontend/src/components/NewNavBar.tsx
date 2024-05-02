import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import React, { FormEvent, ReactElement } from "react";
import { api } from "../utilities/axiosInstance";
import { ContextType } from "../types/contextTypes";

const NewNavBar: React.FC<ContextType> = ({
  currentUser,
  setCurrentUser,
}: ContextType): ReactElement => {
  const navigate: NavigateFunction = useNavigate();

  const handleLogOut = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await api.post("users/logout/");
      console.log("Successfully logged out!");
      localStorage.removeItem("token");
      setCurrentUser(null);
      navigate("/");
    } catch (error) {
      console.log("Failed to log out: ", error);
    }
  };

  return (
    <>
   
    <div className="flex flex-row justify-between items-center border-b border-gray-200 h-10 p-4 ">
        <div>
            <h1>DISCLONE</h1>
        </div>
        <ul className="flex flex-row justify-center">
            <li className="flex items-center">
                <Link to="server/1/channel/1/" className="">
                    Enter Chat Room
                </Link>
            </li>
            

        
        
        </ul>
        <div className="flex flex-row justify-end items-center gap-4">
              <Link to="account/">
                <button className="flex ">
                  {currentUser ? currentUser.displayName : null}
                </button>
              </Link>
              {currentUser ? (
                <button
                  className="flex border border-gray-300 rounded-md px-2 py-1 bg-gray-100 hover:bg-gray-200"
                  onClick={(e) => {
                    handleLogOut(e);
                  }}
                >
                  Log Out
                </button>
              ) : null}
            </div>
    </div>
      
    
      
    </>
  );
}

export default NewNavBar;