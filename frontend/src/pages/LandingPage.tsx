import { Link, useOutletContext } from "react-router-dom";
import { FormEvent, useState, ReactElement } from "react";
import { AxiosResponse } from "axios";
import { api } from "../utilities/axiosInstance";
import { ContextType } from "../types/contextTypes";
import { Button } from "@/components/ui/button";

/**
 * @description The Landing Page that allows a User to login to the application
 * and utilize its features
 *
 * @returns {ReactElement} The LandingPage
 */
const LandingPage: React.FC = (): ReactElement => {
  const { currentUser, setCurrentUser } = useOutletContext<ContextType>();
  const [inputEmail, setInputEmail] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");

  /**
   * @description Handler for User login, a post request is made to the backend
   * and, if successful, the User's token is grabbed and set in local storage and
   * the User is set in the currentUser state
   *
   * @param {FormEvent} e The submission FormEvent
   */
  const handleLogin = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const resp: AxiosResponse = await api.post("users/login/", {
        email: inputEmail,
        password: inputPassword,
      });
      const token: string = resp.data.token;
      console.log("Successully logged in.");
      api.defaults.headers.common["Authorization"] = `Token ${token}`;
      localStorage.setItem("token", token);
      setCurrentUser({
        email: resp.data.email,
        displayName: resp.data.display_name,
        firstName: resp.data.first_name,
        lastName: resp.data.last_name,
      });
    } catch (error) {
      console.log("Login failed: ", error);
    }
    setInputEmail("");
    setInputPassword("");
  };

  return (
    <>
      {currentUser ?
        <p>Please select a server.</p>
        :
        <section className="px-[5%]">
          <div className="relative flex min-h-svh flex-col justify-center items-stretch overflow-auto py-24 lg:py-20">
            <div className="absolute bottom-auto left-0 right-0 top-0 flex h-16 w-full items-center justify-between md:h-18">
              <div>
                <h1 className="text-xl font-bold">DISCLONE</h1>
              </div>
              <div className="inline-flex gap-x-1">
                <p className="hidden md:block">Don't have an account?</p>
                <Link
                  to="signup/"
                  className="underline ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2"
                >
                  <Button>Sign Up</Button>
                </Link>
              </div>
            </div>
            <div className="container max-w-sm">
              <div className="mb-6 text-center md:mb-8">
                <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
                  Log In
                </h1>
                <p className="md:text-md">
                  Lorem ipsum dolor sit amet adipiscing elit.
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  handleLogin(e);
                }}
                className="grid grid-cols-1 gap-6"
              >
                <div className="grid w-full items-center">
                  <label
                    className="mb-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                  >
                    Email*
                  </label>
                  <input
                    type="text"
                    className="flex size-full min-h-11 border border-border-primary bg-background-primary px-3 py-2 align-middle file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    id="email"
                    value={inputEmail}
                    onChange={(e) => {
                      setInputEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="grid w-full items-center">
                  <label
                    className="mb-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="password"
                  >
                    Password*
                  </label>
                  <input
                    type="password"
                    className="flex size-full min-h-11 border border-border-primary bg-background-primary px-3 py-2 align-middle file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    id="password"
                    value={inputPassword}
                    onChange={(e) => {
                      setInputPassword(e.target.value);
                    }}
                  />
                </div>
                <div className="grid-col-1 grid gap-4">
                  <button className="inline-flex items-center justify-center gap-3 whitespace-nowrap border border-border-primary bg-background-alternative hover:bg-black hover:text-white px-6 py-3 text-text-alternative ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                    Log in
                  </button>
                </div>
              </form>
              <div className="mt-5 w-full text-center md:mt-6">
                <a
                  href="#"
                  className="underline ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
            <footer className="absolute bottom-0 left-0 right-0 top-auto flex h-16 w-full items-center justify-center md:h-18">
              <p className="text-sm">© DISCLONE</p>
            </footer>
          </div>
        </section>
      }
    </>
  );
};

export default LandingPage;
