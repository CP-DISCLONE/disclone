import React, { useState } from 'react';

const ChatRoom: React.FC = () => {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState<string[]>([]);

    const handleSend = () => {
        setChatLog([...chatLog, message]);
        setMessage('');
    };

    return (
        <div className="flex flex-col h-full">
            <div className="overflow-auto p-4">
                {chatLog.map((msg, index) => (
                    <div key={index} className="p-2 bg-blue-200 rounded-lg my-2">
                        {msg}
                    </div>
                ))}
            </div>
            <div className="p-4 flex-none flex">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-grow border rounded-lg p-2 mr-2"
                />
                <button onClick={handleSend} className="bg-blue-500 text-white rounded-lg px-4 py-2">Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;