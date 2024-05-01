import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState, useRef, FormEvent, ReactElement } from "react";
import { useParams } from "react-router-dom";

/**
 * @description The interface that defines the props passed down to the Modal from the
 * ServerPage
 *
 * @property {string} newChannelName The new Channel's name
 * @property {function} setNewChannelName The setter for the new Channel's name
 * @property {function} handleAddChannel The handler for creating a new Channel
 */
interface ModalProps {
  newChannelName: string;
  setNewChannelName: (newChannelName: string) => void;
  handleAddChannel: (event: FormEvent) => void;
}

/**
 * @description The Modal that allows a User to create a new Channel
 *
 * @param {ModalProps} props The props passed down from ServerPage to Modal
 *
 * @returns {ReactElement} The Modal component
 */
const Modal: React.FC<ModalProps> = ({
  newChannelName,
  setNewChannelName,
  handleAddChannel,
}: ModalProps): ReactElement => {
  return (
    <Dialog>
      <DialogTrigger>Add Channel (+)</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Channel</DialogTitle>
          <DialogDescription>
            <form
              onSubmit={(e) => {
                handleAddChannel(e);
              }}
            >
              <input
                type="text"
                value={newChannelName}
                onChange={(e) => {
                  setNewChannelName(e.target.value);
                }}
              />
              <input type="submit" value="Add Server" />
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;

// // import React, { ReactElement } from "react";

// // const Modal: React.FC = (): ReactElement => {
// //     return (
// //         <div className="login-form">

// //         </div>
// //     );
// // };

// // export default Modal;

// import { Fragment, useRef, useState } from 'react'
// import { Dialog, Transition } from '@headlessui/react'

// const Modal: React.FC = (): ReactElement => {
//     const [open, setOpen] = useState(true)
//     const [newChannelName, setNewChannelName] = useState<string>('')

//     const cancelButtonRef = useRef(null)

//     const handleAddChannel = async (e): void => {
//         e.preventDefault()
//         const resp: AxiosResponse = api.post(`/0.0.0.0:8000/api/v1/servers/${server_id}/channels/`, { name: newChannelName })

//     }

//     return (

//   )
// };
// export default Modal;
