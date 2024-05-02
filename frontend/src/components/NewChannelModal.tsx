import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { FormEvent, ReactElement } from "react";
import addcircleImage from "../images/AddCircleOutlineRounded.svg";

/**
 * @description The interface that defines the props passed down to the Modal from the
 * ServerPage
 *
 * @property {string} newChannelName The new Channel's name
 * @property {function} setNewChannelName The setter for the new Channel's name
 * @property {function} handleAddChannel The handler for creating a new Channel
 */
interface NewChannelModalProps {
  newChannelName: string;
  setNewChannelName: (newChannelName: string) => void;
  handleAddChannel: (event: FormEvent) => void;
}

/**
 * @description The Modal that allows a User to create a new Channel
 *
 * @param {NewChannelModalProps} props The props passed down from ServerPage to Modal
 *
 * @returns {ReactElement} The Modal component
 */
const NewChannelModal: React.FC<NewChannelModalProps> = ({
  newChannelName,
  setNewChannelName,
  handleAddChannel,
}: NewChannelModalProps): ReactElement => {
  return (
    <Dialog>
      <DialogTrigger className="justify-center p-4 rounded-md bg-popover-dark transform hover:scale-110">
      <img src={addcircleImage} alt="Add circle" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Channel</DialogTitle>
          <DialogDescription>
            <form
              onSubmit={(e) => {
                handleAddChannel(e);
              }}
            > <p>Input new channel name.</p>
              <input
                type="text"
                value={newChannelName}
                onChange={(e) => {
                  setNewChannelName(e.target.value);
                }}
              />
              <input type="submit" value="Add Channel" />
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NewChannelModal;
