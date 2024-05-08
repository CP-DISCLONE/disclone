import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { FormEvent, ReactElement } from "react";


/**
 * @description The interface that defines the props passed down to the Modal from the
 * ServerMenuModal
 *
 * @property {string} JoinServerID The Join Server's ID
 * @property {function} setJoinServerID The setter for the Join Server's name
 * @property {function} handleAddServer The handler for creating a Join Server
 */
interface JoinServerModalProps {
    joinServerID: string;
    setJoinServerID: (joinServerID: string) => void;
    handleJoinServer: (event: FormEvent) => void;
}

/**
 * @description The Modal that allows a User to Join a Server
 *
 * @param {JoinServerModalProps} props The props passed down from ServerMenuModal to JoinServerModal
 *
 * @returns {ReactElement} The Modal component
 */
const JoinServerModal: React.FC<JoinServerModalProps> = ({
    joinServerID,
    setJoinServerID,
    handleJoinServer,
}: JoinServerModalProps): ReactElement => {
    return (
        <Dialog>
            <DialogTrigger className='hover:bg-accent-dark m-1 hover:text-primary-dark rounded p-1'>Join Server (+)</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Join Server</DialogTitle>
                    <DialogDescription>
                        <form
                            onSubmit={(e) => {
                                handleJoinServer(e);
                            }}
                        >
                            <p className='m-1'>Input Join server ID.</p>
                            <input
                                type="text"
                                value={joinServerID}
                                onChange={(e) => {
                                    setJoinServerID(e.target.value);
                                }}
                            />
                            <input className='hover:bg-accent-dark m-1 hover:text-primary-dark rounded p-1' type="submit" value="Add Server" />
                        </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default JoinServerModal;
