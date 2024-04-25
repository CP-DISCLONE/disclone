
import React, { useState, useEffect, useMemo, FormEvent } from 'react';

import ChatMessage from '../components/ChatMessage';

import { w3cwebsocket as W3CWebSocket, IMessageEvent } from 'websocket';



const ChatRoom: React.FC = () => {

    interface Message {
        text: string;
        sender: string;
    }

    const [inputMsg, setInputMsg] = useState('');
    const [chatLog, setChatLog] = useState<Message[]>([]);
    const [filledForm, setFilledForm] = useState<boolean>(false)
    const [name, setName] = useState<string>('')
    const [room, setRoom] = useState<string>('testroom')

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
        client.send(
            JSON.stringify({
                type: "message",
                text: inputMsg,
                sender: name
            })
        );
        setInputMsg('');
    };

    return (

        <>
            <div className="">
                <div className="justify-center">
                    <h1 className="text-center text-4xl">Room Name</h1>
                    <div className="grid grid-cols-8 gap-1  h-[800px]">
                        <div className="col-span-1 bg-royalblue-800 p-2 m-1 flex flex-col rounded-md text-lg text-gray-100">Channels:</div>
                        <div className="col-span-2 p-2 m-1 gap-4 flex flex-col text-lg text-gray-400">Users:
                            <div className="overflow-y-auto hover:bg-royalblue-300 p-2 m-1 flex-wrap flex items-center gap-2  border-b-2 ">
                                <div className="bg-slate-200 p-2 m-1  h-[40px] w-[40px] border rounded-full "></div>
                                <p className="text-slate-700 hidden lg:block">BananaSplitz</p>
                            </div>
                           



                        </div>
                        <div className="col-span-5   m-2  flex flex-col justify-between">
                            {/* Chat messages */}
                            <div className="h-[720px] overflow-y-auto p-4 rounded-md bg-slate-100 flex-col justify-end">
                                
                                
                              
                                <ul>

                                 {chatLog.map((msg, index) => (

                                   <li key = {index}><ChatMessage msg={msg} index={index} /></li>
                                ))}
                                </ul>

                           

                            </div>




                           



                            
                            
                            <form onSubmit={(e) => { handleSend(e) }} className="container flex gap-2 p-3">
                                <button className="bg-royalblue-800 text-white px-3 rounded-md ml-1">Send</button>
                                <input
                                    type="text"
                                    value={inputMsg}
                                    onChange={(e) => setInputMsg(e.target.value)}
                                    placeholder="Type your message..."
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