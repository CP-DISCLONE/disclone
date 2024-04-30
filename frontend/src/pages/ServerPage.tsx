import { ReactElement, useEffect, useState } from "react";
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
    const [showModal, setShowModal] = useState<boolean>(false)

    const { server_id } = useParams<string>()


    const handleSelectChannel = (channel: Channel): void => {
        setCurrentChannel(channel);
    }

    const handleShowModal = (showModal: boolean): void => {
        setShowModal(!showModal)
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
    }, [handleAddChannel])

    return (
        <>
            <h1>Server Page</h1>
            <ul className="w-1/6">
                {myChannels ? myChannels.map((channel) => <li onClick={() => handleSelectChannel(channel)} key={channel.id}><ChannelPage channel={channel} /></li>) : null}
                <li onClick={() => handleShowModal(showModal)}> <p> + </p></li>
            </ul>
            <Modal
                showModal={showModal}
                handleShowModal={handleShowModal}
            />

            {currentChannel ? <ChatRoom key={currentChannel.id} channel={currentChannel} /> : <div>Please select a channel</div>}
        </>
    )
};

export default ServerPage;
