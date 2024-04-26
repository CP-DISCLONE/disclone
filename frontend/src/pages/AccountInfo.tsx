import { useOutletContext } from "react-router-dom";
import { useState, FormEvent, ReactElement } from "react";
import { AxiosResponse } from "axios";
import { api } from "../utilities/axiosInstance";
import { ContextType } from "../types/contextTypes";

const AccountInfo: React.FC = (): ReactElement => {
  const { currentUser, setCurrentUser } = useOutletContext<ContextType>();
  const [inputDisplayName, setInputDisplayName] = useState<string>("");

  const handleSubmitInfo = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const resp: AxiosResponse = await api.put("users/info/", {
        display_name: inputDisplayName,
      });
      console.log("Successfully updated display name.");
      setCurrentUser({
        email: resp.data.email,
        displayName: inputDisplayName,
        firstName: resp.data.first_name,
        lastName: resp.data.last_name,
      });
    } catch (error) {
      console.log("Failed to update display name: ", error);
    }
  };

  return (
    <header className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container">
        <div className="mx-auto mb-12 w-full text-center md:mb-18 lg:mb-20">
          <h2 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">
            Account Info
          </h2>
          <p className="md:text-md">
            First Name: {currentUser ? currentUser.firstName : "N/A"}{" "}
          </p>
          <p className="md:text-md">
            Last Name: {currentUser ? currentUser.lastName : "N/A"}
          </p>
          <p className="md:text-md">
            Email: {currentUser ? currentUser.email : "N/A"}
          </p>
          <p className="md:text-md">
            Display Name: {currentUser ? currentUser.displayName : "N/A"}
          </p>
          <form
            onSubmit={(e) => {
              handleSubmitInfo(e);
            }}
            className="grid grid-cols-1 gap-6"
          >
            <div className="flex w-full items-center justify-center">
              <label
                className="mb-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="display_name"
              >
                New Display Name
              </label>
              <input
                type="text"
                className="flex size-1/4 min-h-7 ml-2 border-2 border-black bg-background-primary px-3 py-2 align-middle file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                id="email"
                value={inputDisplayName}
                onChange={(e) => {
                  setInputDisplayName(e.target.value);
                }}
              />
              <input
                type="submit"
                value="Update"
                className="ml-2 p-1 rounded border-2 bg-black text-white border-black hover:bg-white hover:text-black"
              />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};

export default AccountInfo;
