import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { ReactElement } from "react";
import { Button } from "./ui/button";
import { api } from "@/utilities/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";
import { Server } from "@/types/serverElementTypes";

/**
 * @description The interface that defines the props passed down to the Modal from the
 * ServerPage
 *
 * @property {string} server_id The current Server's id
 * 
 */
interface LeaveServerModalProps {
    server_id: string;
    myServers: Server[];
    setMyServers: (myServer: Server[]) => void;
}


/**
 * @description The Modal that allows a User to create a new Channel
 *
 * @param {LeaveServerModalProps} props The props passed down from ServerPage to Modal
 *
 * @returns {ReactElement} The Modal component
 */
const LeaveServerModal: React.FC<LeaveServerModalProps> = ({
    server_id,
    myServers,
    setMyServers
}: LeaveServerModalProps): ReactElement => {
    const navigate = useNavigate()

    const handleLeaveServer = async (server_id: string): Promise<void> => {
        try {
            console.log('hello');
            console.log(server_id);
            const resp: AxiosResponse = await api.put(`servers/${server_id}/method/subtract/`)
            console.log(resp.data)
            const filteredServers = myServers.filter(server => server.id !== Number(server_id));
            setMyServers(filteredServers)
            navigate('/');
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="flex items-center justify-center">
        <Dialog >
            <DialogTrigger >Leave Server (-)</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Leave Server</DialogTitle>
                    <DialogDescription>
                        <p>Are you sure you wish to leave the server?</p>
                        <Button onClick={() => handleLeaveServer(server_id)}>Yes, Leave Server</Button>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
        </div>
    );
};

export default LeaveServerModal;
