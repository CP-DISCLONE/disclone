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
 * @description The interface that defines the props passed down to the NewServerModal from the
 * ServerMenuModal
 *
 * @property {string} newServerName The new Server's name
 * @property {function} setNewServerName The setter for the new Server's name
 * @property {function} handleAddServer The handler for creating a new Server
 */
interface NewServerModalProps {
    newServerName: string;
    setNewServerName: (newServerName: string) => void;
    handleAddServer: (event: FormEvent) => void;
}

/**
 * @description The Modal that allows a User to create a new Server
 *
 * @param {NewServerModalProps} props The props passed down from ServerMenuModal to NewServerModal
 *
 * @returns {ReactElement} The Modal component
 */
const NewServerModal: React.FC<NewServerModalProps> = ({
    newServerName,
    setNewServerName,
    handleAddServer,
}: NewServerModalProps): ReactElement => {
    return (
        <Dialog>
            <DialogTrigger>Add Server (+)</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Server</DialogTitle>
                    <DialogDescription>
                        <form
                            onSubmit={(e) => {
                                handleAddServer(e);
                            }}
                        >
                            <p>Input new server name.</p>
                            <input
                                type="text"
                                value={newServerName}
                                minLength={5}
                                onChange={(e) => {
                                    setNewServerName(e.target.value);
                                }}
                                required
                            />
                            <input type="submit" value="Add Server" />
                        </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default NewServerModal;
