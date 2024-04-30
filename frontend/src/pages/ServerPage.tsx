import { ReactElement, useEffect, useState, FormEvent } from "react";
import { Channel } from "../types/channelElementTypes";
import { api } from "../utilities/axiosInstance";
import { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import ChannelPage from "./ChannelPage";
import ChatRoom from "./ChatRoom";
import Modal from "../components/Modal";


const ServerPage: React.FC = (): ReactElement => {
    const [myChannels, setMyChannels] = useState<Channel[]>([])
    const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)
    const [newChannelName, setNewChannelName] = useState<string>('')

    const { server_id } = useParams<string>()


    const handleSelectChannel = (channel: Channel): void => {
        setCurrentChannel(channel);
    }


    const handleAddChannel = async (e: FormEvent): Promise<void> => {
        e.preventDefault()
        const resp: AxiosResponse = await api.post(`/servers/${server_id}/channels/`, { name: newChannelName })
        try {
            const resp2: AxiosResponse = await api.get(`servers/${server_id}/channels/`)
            console.log("getting channels")
            setMyChannels(resp2.data)
        } catch (error) {
            console.log(error)
        }

        setNewChannelName('')
    }


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
                {myChannels ? myChannels.map((channel) => <li onClick={() => handleSelectChannel(channel)} key={channel.id}><ChannelPage channel={channel} myChannels={myChannels} setMyChannels={setMyChannels} /></li>) : null}
                <li>
                    <Modal
                        handleAddChannel={handleAddChannel}
                        newChannelName={newChannelName}
                        setNewChannelName={setNewChannelName}
                    />
                </li>
            </ul>



            {currentChannel ? <ChatRoom key={currentChannel.id} channel={currentChannel} /> : <div>Please select a channel</div>}
        </>
    )
};

export default ServerPage;
