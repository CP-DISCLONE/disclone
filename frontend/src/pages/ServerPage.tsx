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
        <p>Server ID: {server_id}</p>
        <h1>Your Channels</h1>
        <p></p>
        <div className="flex m-4 gap-4 items-center ">
          <div className="">
            <NewChannelModal

              handleAddChannel={handleAddChannel}
              newChannelName={newChannelName}
              setNewChannelName={setNewChannelName}
            />
          </div>
          <ul className="flex gap-4">
            {myChannels
              ? myChannels.map((channel) => (
                <li onClick={() => handleSelectChannel(channel)} key={channel.id}>
                  <ChannelPage
                    channel={channel}
                    setMyChannels={setMyChannels}
                    isSelected={channel === selectedChannel}
                  />
                </li>
              ))
              : null}
            <li><LeaveServerModal myServers={myServers} setMyServers={setMyServers} server_id={server_id} /></li>
          </ul>
        </div>




        {currentChannel ? (
          <ChatRoom key={currentChannel.id} channel={currentChannel} />
        ) : (
          <div>Please select a channel</div>
        )}
      </div>
    </>
  );
};

export default ServerPage;
