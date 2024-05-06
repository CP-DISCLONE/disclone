import { ReactElement, useEffect, useState, FormEvent } from "react";
import { Channel } from "../types/channelElementTypes";
import { api } from "../utilities/axiosInstance";
import { AxiosResponse } from "axios";
import { useParams, useOutletContext } from "react-router-dom";
import ChannelPage from "./ChannelPage";
import ChatRoom from "./ChatRoom";
import NewChannelModal from "../components/NewChannelModal";
import LeaveServerModal from "../components/LeaveServerModal";
import { ContextType } from "@/types/contextTypes";
import { User } from "@/types/userTypes";



/**
 * @description Page that displays a Server and all of its related channels
 *
 * @returns {ReactElement} The ServerPage
 */
const ServerPage: React.FC = (): ReactElement => {
  const [myChannels, setMyChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [newChannelName, setNewChannelName] = useState<string>("");
  const { server_id = "" } = useParams<string>();
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const { myServers, setMyServers }: ContextType = useOutletContext()
  const [serverUsers, setServerUsers] = useState<User[]>([])
  const [admin, setAdmin] = useState<User | null>(null)


  const handleSelectChannel = (channel: Channel): void => {
    setCurrentChannel(channel);
    setSelectedChannel(channel);
  };


  /**
   * @description Handler for adding a new channel. Makes a post request to the
   * backend with the new Channel's name, then makes a get request to retrieve all
   * channels and set the Channels state with the updated array of channels
   * 
   * @param {FormEvent} e The submission FormEvent
   */
  const handleAddChannel = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await api.post(
        `/servers/${server_id}/channels/`,
        { name: newChannelName }
      );
      try {
        const resp2: AxiosResponse = await api.get(
          `servers/${server_id}/channels/`
        );
        console.log("getting channels");
        setMyChannels(resp2.data);
      } catch (error) {
        console.log(error);
      }

      setNewChannelName("");
    } catch (error) {
      console.log(error);
      alert("Cannot add Channels. You are not the Owner of the Server.");
    }
  };


  useEffect(() => {
    const getChannels = async () => {
      try {
        const resp: AxiosResponse = await api.get(
          `servers/${server_id}/`
        );
        console.log("getting server/channels");
        console.log(resp.data)
        const newUsersArr: User[] = []
        for (const user of resp.data.users) {
          const userData = {
            email: user.email,
            displayName: user.display_name,
            firstName: user.first_name,
            lastName: user.last_name,
            profilePicture: user.profile_picture_url
          }
          console.log(user)
          newUsersArr.push(userData)
        }
        const newAdmin: User = {
          email: resp.data.admin.email,
          displayName: resp.data.admin.display_name,
          firstName: resp.data.admin.first_name,
          lastName: resp.data.admin.last_name,
          profilePicture: resp.data.profile_picture_url
        }
        setServerUsers(newUsersArr)
        console.log(newUsersArr)
        setAdmin(newAdmin)
        console.log(newAdmin)
        setMyChannels(resp.data.channels);
      } catch (error) {
        console.log(error);
      }
    };
    getChannels();
  }, []);

  return (
    <>
      <div className="m-4">


        <div className="flex p-4 my-4 gap-4 items-center rounded-md bg-primary-dark">
          <p>Server ID: {server_id}</p>
          {admin ? <p>Server Admin: {admin.displayName}</p> : null}
          <h1>Your Channels : </h1>

          <div className="flex">
            <NewChannelModal

              handleAddChannel={handleAddChannel}
              newChannelName={newChannelName}
              setNewChannelName={setNewChannelName}
            />
          </div>
          <ul className="flex gap-4">
            {myChannels
              ? myChannels.map((channel) => (
                <li onClick={() => handleSelectChannel(channel)} key={channel.id} className="text-primary-dark">
                  <ChannelPage
                    channel={channel}
                    setMyChannels={setMyChannels}
                    isSelected={channel === selectedChannel}

                  />
                </li>
              ))
              : null}
            <li className="flex p-4 bg-foreground text-primary-dark rounded-md justify-center items-center"><LeaveServerModal myServers={myServers} setMyServers={setMyServers} server_id={server_id} /></li>
          </ul>
        </div>












        {currentChannel ? (
          <ChatRoom key={currentChannel.id} channel={currentChannel} serverUsers={serverUsers} />
        ) : (
          <div>Please select a channel</div>
        )}
      </div>
    </>
  );
};

export default ServerPage;
