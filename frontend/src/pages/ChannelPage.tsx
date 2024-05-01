import { ReactElement, useEffect, useState } from "react";
import { Channel } from "../types/channelElementTypes";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { api } from "@/utilities/axiosInstance";
import { AxiosResponse } from 'axios';
interface ChannelPageProps {
    channel: Channel;
    myChannels: Channel[];
    setMyChannels: ((myChannels: Channel[]) => void);
}

const ChannelPage: React.FC<ChannelPageProps> = ({
    channel,
    myChannels,
    setMyChannels
}: ChannelPageProps): ReactElement => {
    const { server_id } = useParams<string>()

    const handleDeleteChannel = async (): Promise<void> => {
        await api.delete(`/servers/${server_id}/channels/${channel.id}`)
        try {
            const resp2: AxiosResponse = await api.get(`servers/${server_id}/channels/`)
            console.log("getting channels")
            setMyChannels(resp2.data)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='flex flex-row w-full transform hover:scale-110 bg-red-100 text-black p-4'>
            <p>{channel.name}</p>
            <Button onClick={handleDeleteChannel}>X</Button>
        </div>

    )
};

export default ChannelPage;
