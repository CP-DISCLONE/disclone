
import React, { useState, useEffect, useMemo, FormEvent } from 'react';


interface ChatMessageProps {
    msg: {
        text: string;
        sender: string;
    };
    index: number;

}

const ChatMessage: React.FC<ChatMessageProps> = ({ msg, index }) => {
  
    return (
        <>
    

            <div className="flex items-left justify-left bg-slate-200 p-2 m-1 flex-col rounded-md">
                <div className=" inline-block text-slate-400">09:31: User Name</div>
                <div key={index} className="">
                    {msg.text}
                </div>
            </div>
        
        
        
        
        </>
    );
};

export default ChatMessage;