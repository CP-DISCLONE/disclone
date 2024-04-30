import { ReactElement, useEffect, useState } from "react";
import { Channel } from "../types/channelElementTypes";
import { api } from "../utilities/axiosInstance";
import { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import ChannelPage from "./ChannelPage";

const ServerPage: React.FC = (): ReactElement => {
    const [myChannels, setMyChannels] = useState<Channel[]>([])
    const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)
    const { server_id } = useParams<string>()



    useEffect(() => {
        const getChannels = async () => {
            try {
                const resp: AxiosResponse = await api.get(`servers/${server_id}/channels/`)
                console.log("getting channels")
                setMyChannels(resp.data)
            } catch (error) {
                console.log(error)
            }
        }
        getChannels()
    }, [])
    return (
        <>
            <h1>Server Page</h1>
            <ul className="w-1/6">
                {myChannels ? myChannels.map((channel, idx) => <li key={idx}><ChannelPage channel={channel} /></li>) : null}
            </ul>

            {currentChannel ? <Chatroom channel={currentChannel} /> : null}
        </>
    )
};

export default ServerPage;
