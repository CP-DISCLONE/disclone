import { ReactElement, useEffect, useState, FormEvent } from "react";
import { Channel } from "../types/channelElementTypes";
import { api } from "../utilities/axiosInstance";
import { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import ChannelPage from "./ChannelPage";
import ChatRoom from "./ChatRoom";
import NewChannelModal from "../components/NewChannelModal";

/**
 * @description Page that displays a Server and all of its related channels
 *
 * @returns {ReactElement} The ServerPage
 */
const ServerPage: React.FC = (): ReactElement => {
  const [myChannels, setMyChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [newChannelName, setNewChannelName] = useState<string>("");
  const { server_id } = useParams<string>();
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  

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
    const resp: AxiosResponse = await api.post(
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
  };

  useEffect(() => {
    const getChannels = async () => {
      try {
        const resp: AxiosResponse = await api.get(
          `servers/${server_id}/channels/`
        );
        console.log("getting channels");
        setMyChannels(resp.data);
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
                myChannels={myChannels}
                setMyChannels={setMyChannels}
                isSelected={channel === selectedChannel}
              />
            </li>
          ))
          : null}
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
