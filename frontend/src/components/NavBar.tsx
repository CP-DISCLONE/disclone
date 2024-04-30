import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import React, { FormEvent, ReactElement, useEffect, useState } from "react";
import { api } from "../utilities/axiosInstance";
import { ContextType } from "../types/contextTypes";
import { AxiosResponse } from "axios";
import ServerButton from "./ServerButton";
import { Server } from "../types/serverElementTypes";

const NavBar: React.FC<ContextType> = ({
  currentUser,
  setCurrentUser,
}: ContextType): ReactElement => {
  const [myServers, setMyServers] = useState<Server[]>([])
  const navigate: NavigateFunction = useNavigate();

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

  useEffect(() => {
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
      <nav className="flex h-auto min-h-16 w-full items-center border-b border-black bg-white px-[5%] lg:min-h-18">
        <div className="mx-auto flex size-full auto-cols-fr items-center justify-between gap-4 lg:grid lg:grid-cols-[0.375fr_1fr_0.375fr]">
          <div className="flex min-h-16 flex-shrink-0 items-center">
            <img
              src="https://relume-assets.s3.amazonaws.com/logo-image.svg"
              alt="Logo image"
            />
          </div>
          <ul className="absolute left-0 top-16 flex h-dvh w-full flex-col items-center justify-start border-b border-border-primary bg-white px-[5%] pt-4 lg:static lg:flex lg:h-auto lg:w-auto lg:flex-row lg:justify-center lg:border-none lg:px-0 lg:pt-0">
            {myServers ? myServers.map((server, idx) => <li key={idx}><ServerButton server={server} /></li>) : null}

            <li className="w-full lg:w-auto">
              <div>
                <button className="flex w-full items-center justify-center gap-2 py-3 text-center text-md ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2 lg:w-auto lg:flex-none lg:justify-start lg:gap-2 lg:px-4 lg:py-2 lg:text-base">
                  <span>Link Four</span>
                  <div>
                    <svg
                      width=" 100%"
                      height=" 100%"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2.55806 6.29544C2.46043 6.19781 2.46043 6.03952 2.55806 5.94189L3.44195 5.058C3.53958 4.96037 3.69787 4.96037 3.7955 5.058L8.00001 9.26251L12.2045 5.058C12.3021 4.96037 12.4604 4.96037 12.5581 5.058L13.4419 5.94189C13.5396 6.03952 13.5396 6.19781 13.4419 6.29544L8.17678 11.5606C8.07915 11.6582 7.92086 11.6582 7.82323 11.5606L2.55806 6.29544Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </button>
              </div>
            </li>
          </ul>
          <div className="flex min-h-16 items-center justify-end gap-x-4">
            <div>
              <Link to="account/">
                <button className="inline-flex items-center justify-center gap-3 whitespace-nowrap border border-border-primary bg-background-alternative px-4 py-1 text-text-alternative ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:px-6 md:py-2">
                  {currentUser ? currentUser.displayName : null}
                </button>
              </Link>
              {currentUser ? (
                <button
                  className="inline-flex items-center justify-center gap-3 whitespace-nowrap border border-border-primary bg-background-alternative px-4 py-1 text-text-alternative ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 md:px-6 md:py-2"
                  onClick={(e) => {
                    handleLogOut(e);
                  }}
                >
                  Log Out
                </button>
              ) : null}
            </div>
            <button className="-mr-2 flex size-12 flex-col items-center justify-center lg:hidden">
              <div className="my-[3px] h-0.5 w-6 transform bg-black transition duration-300 ease-in-out lg:hidden"></div>
              <div className="my-[3px] h-0.5 w-6 transform bg-black transition duration-300 ease-in-out lg:hidden"></div>
              <div className="my-[3px] h-0.5 w-6 transform bg-black transition duration-300 ease-in-out lg:hidden"></div>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
