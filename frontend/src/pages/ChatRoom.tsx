import { useState, useEffect, useMemo, FormEvent, ReactElement, ChangeEvent } from "react";
import ChatMessage from "../components/ChatMessage";
import { w3cwebsocket as W3CWebSocket, IMessageEvent } from "websocket";
import { Message } from "../types/chatElementTypes";
import { ContextType } from "../types/contextTypes";
import { useOutletContext } from "react-router-dom";
import Picker from "emoji-picker-react";


const ChatRoom: React.FC = (): ReactElement => {
    const [inputImage, setInputImage] = useState<File | null>(null);
    const { currentUser } = useOutletContext<ContextType>();
    const [inputMsg, setInputMsg] = useState<string>("");
    const [chatLog, setChatLog] = useState<Message[]>([]);
    const [chosenEmoji, setChosenEmoji] = useState<string | null>(null);
    const room: string = "testroom"; // Update later to use the channel's name grabbed from request to WSGI

    const client: W3CWebSocket = useMemo(
        (): W3CWebSocket => new W3CWebSocket(`ws://0.0.0.0:8000/ws/chat/${room}/`),
        [room]
    );

    useEffect((): void => {
        client.onopen = (): void => {
            console.log("WebSocket Client Connected");
        };
        client.onmessage = (message: IMessageEvent): void => {
            const dataFromServer: string = message.data.toString(); // Assuming the server sends stringified JSON
            try {
                const parsedData: Message = JSON.parse(dataFromServer);
                setChatLog((prevChatLog) => [...prevChatLog, parsedData]);
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        };
    }, [client]);

    const handleSend = (e: FormEvent): void => {
        e.preventDefault()
        let messageToSend: any = {};
        if (chosenEmoji){
          messageToSend = {
            type: "message",
            text: inputMsg + chosenEmoji,
            sender: currentUser?.displayName
          }
        } else if (inputImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageBase64 = reader.result as string;
                client.send(JSON.stringify({
                    type: 'image',
                    image: imageBase64,
                    sender: currentUser?.displayName
                }))
            }
            reader.readAsDataURL(inputImage);
        } else {
            client.send(
                JSON.stringify({
                    type: "message",
                    text: inputMsg,
                    sender: currentUser?.displayName
                }))
        } 
        setInputMsg('');
        setInputImage(null);
    };

    const onEmojiClick = (e: any, emojiObject: any) => {
      setChosenEmoji(emojiObject.emoji);
    }

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
                        <div className="col-span-1 bg-royalblue-800 p-2 m-1 flex flex-col rounded-md text-lg text-gray-100">
                            Channels:
                        </div>
                        <div className="col-span-2 p-2 m-1 gap-4 flex flex-col text-lg text-gray-400">
                            Users:
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
                                        <li key={index}>
                                            <ChatMessage msg={msg} index={index} />
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <form
                                onSubmit={(e) => {
                                    handleSend(e);
                                }}
                                className="container flex gap-2 p-3"
                            >
                                <button className="bg-royalblue-800 text-white px-3 rounded-md ml-1">
                                    Send
                                </button>
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
                                <Picker onEmojiClick={onEmojiClick}/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatRoom;
