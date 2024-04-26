
import React, { useState, useEffect, useMemo, FormEvent, ChangeEvent } from 'react';

import ChatMessage from '../components/ChatMessage';

import { w3cwebsocket as W3CWebSocket, IMessageEvent } from 'websocket';



const ChatRoom: React.FC = () => {

    interface Message {
        text: string;
        image: string;
        sender: string;
    }

    const [inputMsg, setInputMsg] = useState('');
    const [chatLog, setChatLog] = useState<Message[]>([]);
    const [filledForm, setFilledForm] = useState<boolean>(false)
    const [name, setName] = useState<string>('')
    const [room, setRoom] = useState<string>('testroom')
    const [inputImage, setInputImage] = useState<string>('testroom');

    const client: W3CWebSocket = useMemo(() => new W3CWebSocket(`ws://0.0.0.0:8000/ws/chat/${room}/`), [room]);

 
    useEffect(() => {
        client.onopen = () => {
            console.log("WebSocket Client Connected");
        };
        client.onmessage = (message: IMessageEvent) => {
            const dataFromServer: string = message.data.toString(); // Assuming the server sends stringified JSON
            try {
                const parsedData: Message = JSON.parse(dataFromServer);
                setChatLog(prevChatLog => [...prevChatLog, parsedData]);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };
    }, [client]);

    const handleSend = (e: FormEvent): void => {
        e.preventDefault()
        if (inputImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageBase64 = reader.result as string;
                client.send(JSON.stringify({
                    type: 'image', 
                    image: imageBase64,
                    sender: name
                }))
            }
            reader.readAsDataURL(inputImage);
        } else {
            client.send(
                JSON.stringify({
                    type: "message",
                    text: inputMsg,
                    sender: name
                }))
        }
        setInputMsg('');
        setInputImage(null);
        }
    };

    const handleUpload = (e: ChangeEvent<HTMLInputElement>): void => {
        if (e.target.files && e.target.files.length > 0) {
            setInputImage(e.target.files[0])
        }
    }

    return (

        <>
            <div className="">
                <div className="justify-center">
                    <h1 className="text-center text-4xl">Room Name</h1>
                    <div className="grid grid-cols-8 gap-1  h-[800px]">
                        <div className="col-span-1 bg-gray-200 p-2 m-1 flex flex-col">Channels</div>
                        <div className="col-span-2 bg-gray-300 p-2 m-1 flex flex-col">Logged In Users:
                            <div className="overflow-y-auto bg-slate-100 p-2 m-1 flex-wrap flex items-center ">
                                <div className="bg-slate-200 p-2 m-1  h-[40px] w-[40px]"></div>
                                <p className="text-slate-700">BananaSplitz</p>
                            </div>
                            <div className=" overflow-y-auto bg-slate-100 p-2 m-1 flex-wrap flex items-center ">
                                <div className="bg-slate-200 p-2 m-1  h-[40px] w-[40px]"></div>
                                <p className="text-slate-700">FluffyCactus</p>
                            </div>
                            <div className=" overflow-y-auto bg-slate-100 p-2 m-1 flex-wrap flex items-center ">
                                <div className="bg-slate-200 p-2 m-1  h-[40px] w-[40px]"></div>
                                <p className="text-slate-700">JellyBeanJamboree</p>
                            </div>
                            <div className=" overflow-y-auto bg-slate-100 p-2 m-1 flex-wrap flex items-center ">
                                <div className="bg-slate-200 p-2 m-1  h-[40px] w-[40px]"></div>
                                <p className="text-slate-700">GalacticPancake</p>
                            </div>



                        </div>
                        <div className="col-span-5 bg-gray-400 p-2 m-1 flex flex-col justify-between">
                            {/* Chat messages */}
                            <div className="h-[720px] overflow-y-auto bg-slate-100 p-2  flex-col justify-end">
                                
                                
                              
                                <ul>

                                 {chatLog.map((msg, index) => (

                                   <li key = {index}><ChatMessage msg={msg} index={index} /></li>
                                ))}
                                </ul>

                           

                            </div>




                           



                            
                            
                            <form onSubmit={(e) => { handleSend(e) }} className="mt-4 container flex gap-2">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2">Send</button>
                                <input
                                    type="text"
                                    value={inputMsg}
                                    onChange={(e) => setInputMsg(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleUpload(e)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                                />

                            </form>




                        </div>
                    </div>

                </div>

            </div>

        </>
    )
}

export default ChatRoom;