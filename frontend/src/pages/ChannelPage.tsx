import { ReactElement } from "react";
import { Channel } from "../types/channelElementTypes";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { api } from "@/utilities/axiosInstance";
import { AxiosResponse } from "axios";
import React from 'react';

/**
 * @description The interface that defines the Props passed from the ServerPage to the component
 *
 * @property {Channel} channel The current Channel being rendered
 * @property {function} setMyChannels The setter for the User's Channels state
 */
interface ChannelPageProps {
  channel: Channel;
  setMyChannels: (myChannels: Channel[]) => void;
  isSelected: boolean;
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
  isSelected,
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
    <div className={`flex flex-row w-full p-4 items-center gap-4 transform hover:scale-110 rounded-md  ${isSelected ? 'bg-yellow-300' : ' bg-slate-300'}`}>
      <p>{channel.name}</p>
      <Button
        className="w-[5px] h-[5px] "
        onClick={() => {

          handleDeleteChannel();
        }}

      >
        -

      </Button>
    </div>
  );
};

export default ChannelPage;
