import { ReactElement } from "react";
import { Channel } from "../types/channelElementTypes";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { api } from "@/utilities/axiosInstance";
import { AxiosResponse } from "axios";

/**
 * @description The interface that defines the Props passed from the ServerPage to the component
 *
 * @property {Channel} channel The current Channel being rendered
 * @property {function} setMyChannels The setter for the User's Channels state
 */
interface ChannelPageProps {
  channel: Channel;
  setMyChannels: (myChannels: Channel[]) => void;
}

/**
 * @description The page that displays a Channel's name and its respective deletion button
 *
 * @param {ChannelPageProps} props The channel page props passed down from the parent
 * ServerPage
 *
 * @returns {ReactElement} The ChannelPage
 */
const ChannelPage: React.FC<ChannelPageProps> = ({
  channel,
  setMyChannels,
}: ChannelPageProps): ReactElement => {
  const { server_id } = useParams<string>();

  /**
   * @description The handler for deleting a channel. After successful resolution of the
   * delete request for a channel, a get request is made to the backend to update the channels
   * state
   */
  const handleDeleteChannel = async (): Promise<void> => {
    await api.delete(`/servers/${server_id}/channels/${channel.id}`);
    try {
      const resp2: AxiosResponse = await api.get(
        `servers/${server_id}/channels/`
      );
      console.log("getting channels");
      setMyChannels(resp2.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-row w-full bg-red-100 text-black p-4">
      <p>{channel.name}</p>
      <Button
        className="transform hover:scale-110"
        onClick={handleDeleteChannel}
      >
        X
      </Button>
    </div>
  );
};

export default ChannelPage;
