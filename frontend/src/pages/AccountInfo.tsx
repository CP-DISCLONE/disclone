import { useOutletContext } from "react-router-dom";
import { useState, FormEvent, ReactElement, ChangeEvent, useEffect } from "react";
import { AxiosResponse } from "axios";
import { api } from "../utilities/axiosInstance";
import { ContextType } from "../types/contextTypes";

/**
 * @description The page that displays a User's account information and affords them
 * the opportunity to change their display name
 * 
 * @returns {ReactElement} The AccountInfo page
 */
const AccountInfo: React.FC = (): ReactElement => {
  const { currentUser, setCurrentUser } = useOutletContext<ContextType>();
  const [inputDisplayName, setInputDisplayName] = useState<string>("");
  const [inputImage, setInputImage] = useState<string>('');

  /**
   * @description The handler for a User's display name update submission. Upon
   * successful resolution of the request, the User's state is updated with their
   * new display name.
   * 
   * @param {FormEvent} e The submission FormEvent
   */
  const handleSubmitInfo = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const resp: AxiosResponse = await api.put("users/info/", {
        display_name: inputDisplayName,
        profile_picture: inputImage
      });
      console.log("Successfully updated display name.");
      setCurrentUser({
        email: resp.data.email,
        displayName: inputDisplayName,
        firstName: resp.data.first_name,
        lastName: resp.data.last_name,
        profilePicture: resp.data.profile_picture
      });
    } catch (error) {
      console.log("Failed to update display name: ", error);
    }
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        // Convert the file to a base64 string
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          // Set the inputImage state to the base64 string
          setInputImage(base64String);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    console.log(inputImage)
  }, [inputImage])

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
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </form>
        </div>
      </div>
    </header>
  );
};

export default AccountInfo;
