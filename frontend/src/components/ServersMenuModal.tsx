import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { FormEvent, ReactElement } from "react";
import NewServerModal from "./NewServerModal";
import JoinServerModal from "./JoinServerModal";

/**
 * @description The interface that defines the props passed down to the Modal from the
 * ServerPage
 *
 * @property {string} newServerName The new Server's name
 * @property {function} setServerName The setter for the new Server's name
 * @property {function} handleAddServer The handler for creating a new Server
 * @property {string} joinServerID The join Server's name
 * @property {function} setJoinServerID The setter for the join server's name
 * @property {function} handleJoinServer The handler for joining an existing server
 */
interface ServersMenuModalProps {
    newServerName: string;
    setNewServerName: (newServerName: string) => void;
    handleAddServer: (event: FormEvent) => void;
    joinServerID: string;
    setJoinServerID: (joinServerID: string) => void;
    handleJoinServer: (event: FormEvent) => void;
}

/**
 * @description The Modal that allows a User to create a new Server
 *
 * @param {ServersMenuModalProps} props The props passed down from ServerPage to ServersMenuModal
 *
 * @returns {ReactElement} The Modal component
 */
const ServersMenuModal: React.FC<ServersMenuModalProps> = ({
    newServerName,
    setNewServerName,
    handleAddServer,
    joinServerID,
    setJoinServerID,
    handleJoinServer
}: ServersMenuModalProps): ReactElement => {
    return (
        <Dialog>
            <DialogTrigger>Add/Join Server (+)</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Select Option</DialogTitle>
                    <DialogDescription>

                        <ul>
                            <li> <NewServerModal
                                handleAddServer={handleAddServer}
                                newServerName={newServerName}
                                setNewServerName={setNewServerName}
                            /></li>
                            <li><JoinServerModal
                                handleJoinServer={handleJoinServer}
                                joinServerID={joinServerID}
                                setJoinServerID={setJoinServerID}
                            /></li>
                        </ul>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default ServersMenuModal;
