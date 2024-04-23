import React, { useState, useEffect, useMemo } from 'react';
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

    const client: W3CWebSocket = useMemo(() => new W3CWebSocket(`ws://0.0.0.0:8000/ws/${room}/`), [room]);

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

    const handleSend = () => {
        setChatLog([...chatLog, { text: inputMsg, sender: name }]);
        setInputMsg('');
    };

    return (
        <div className="flex flex-col h-full">
            <div className="overflow-auto p-4">
                {chatLog.map((msg, index) => (
                    <div key={index} className="p-2 bg-blue-200 rounded-lg my-2">
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="p-4 flex-none flex">
                <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    className="flex-grow border rounded-lg p-2 mr-2"
                />
                <button onClick={handleSend} className="bg-blue-500 text-white rounded-lg px-4 py-2">Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;