
import React, { useState, useEffect, useMemo, FormEvent } from 'react';
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
                                <div className="flex items-left justify-left bg-slate-200 p-2 m-1 flex-col">
                                    <div className=" rounded-full inline-block text-slate-400">09:28: User Name</div>

                                    How about we play some Among Us? It's been a while since we've all played together, and it's always a blast.
                                </div>
                                <div className="flex items-left justify-left bg-slate-200 p-2 m-1 flex-col">
                                    <div className=" rounded-full inline-block text-slate-400">09:28: User Name</div>

                                    How about we play some Among Us? It's been a while since we've all played together, and it's always a blast.
                                </div>

                                <div className="flex items-left justify-left bg-slate-200 p-2 m-1 flex-col">
                                    <div className=" rounded-full inline-block text-slate-400">09:28: User Name</div>

                                    Can't wait! It's going to be epic! I'll see you guys at 8.
                                </div>
                                <div className="flex items-left justify-left bg-slate-200 p-2 m-1 flex-col">
                                    <div className=" rounded-full inline-block text-slate-400">09:28: User Name</div>

                                    I'm in! I could use some distraction right now. Just let me know what you guys decide on.
                                </div>
                                <div className="flex items-left justify-left bg-slate-200 p-2 m-1 flex-col">
                                    <div className=" rounded-full inline-block text-slate-400">09:28: User Name</div>

                                    I'm in! I could use some distraction right now. Just let me know what you guys decide on.
                                </div>

                                <div className="flex items-left justify-left bg-slate-200 p-2 m-1 flex-col">
                                    <div className=" rounded-full inline-block text-slate-400">09:28: User Name</div>

                                    Just got back from work. Exhausted! I had this never-ending meeting today that just drained all my energy. Can't wait to unwind a bit.
                                </div>
                                <div className="flex items-left justify-left bg-slate-200 p-2 m-1 flex-col">
                                    <div className=" rounded-full inline-block text-slate-400">09:28: User Name</div>

                                    Yeah, definitely take some time for yourself. You deserve it after a long day like that.
                                </div>

                                <div className="flex items-left justify-left bg-slate-200 p-2 m-1 flex-col">
                                    <div className=" rounded-full inline-block text-slate-400">09:28: User Name</div>

                                    Anyone up for some online games later? I was thinking we could all hop on and play something together.
                                </div>
                                <div className="flex items-left justify-left bg-slate-200 p-2 m-1 flex-col">
                                    <div className=" rounded-full inline-block text-slate-400">09:28: User Name</div>

                                    Count me in too. Let's schedule it for tonight? I'll make sure to clear my schedule.
                                </div>
                                <div className="flex items-left justify-left bg-slate-200 p-2 m-1 flex-col">
                                    <div className=" rounded-full inline-block text-slate-400">09:30: User Name</div>

                                    Hey there! How are you doing today?
                                    Did you hear about the new movie coming out?
                                    Let's catch up soon!
                                    Sounds good. Let's say around 8 PM? That should give everyone enough time to finish up whatever they need to do.
                                </div>
                                <div className="flex items-left justify-left bg-slate-200 p-2 m-1 flex-col">
                                    <div className="rounded-full inline-block text-slate-400">09:31: User Name</div>

                                    How about now?
                                </div>


                                {chatLog.map((msg, index) => (

                                    <div className="flex items-left justify-left bg-slate-200 p-2 m-1 flex-col">
                                        <div className="rounded-full inline-block text-slate-400">09:31: User Name</div>
                                        <div key={index} className="">
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}



                            </div>
                            {/* Render chat messages here */}



                            {/* Chat input */}
                            <form onSubmit={(e) => { handleSend(e) }} className="mt-4 container flex gap-2">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2">Send</button>
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