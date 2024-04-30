// import React, { ReactElement } from "react";

// const Modal: React.FC = (): ReactElement => {
//     return (
//         <div className="login-form">

//         </div>
//     );
// };

// export default Modal;



import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'


const Modal: React.FC = (): ReactElement => {
    const [open, setOpen] = useState(true)
    const [newChannelName, setNewChannelName] = useState<string>('')

    const cancelButtonRef = useRef(null)

    const handleAddChannel = async (e): void => {
        e.preventDefault()
        const resp: AxiosResponse = api.post(`/0.0.0.0:8000/api/v1/servers/${server_id}/channels/`, { name: newChannelName })

    }


    return (
    
  )
};
export default Modal;