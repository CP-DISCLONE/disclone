import { useState, useEffect, useMemo, FormEvent, ReactElement } from "react";
import ChatMessage from "../components/ChatMessage";
import VideoChat from "../components/VideoChat";
import { w3cwebsocket as W3CWebSocket, IMessageEvent } from "websocket";
import { Message } from "../types/chatElementTypes";
import { ContextType } from "../types/contextTypes";
import { useOutletContext } from "react-router-dom";

const ChatRoom: React.FC = (): ReactElement => {
  const { currentUser } = useOutletContext<ContextType>();
  const [inputMsg, setInputMsg] = useState<string>("");
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const room: string = "testroom"; // Update later to use the channel's name grabbed from request to WSGI

  const client: W3CWebSocket = useMemo(
    (): W3CWebSocket => new W3CWebSocket(`ws://0.0.0.0:8000/ws/video/${room}/`),
    [room]
  );



 

  return (
    <>
      <h1>Video Chat</h1>
      <VideoChat />
    </>
  );
};

export default ChatRoom;
