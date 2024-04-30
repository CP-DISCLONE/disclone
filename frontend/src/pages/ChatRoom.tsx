import { useState, useEffect, useMemo, FormEvent, ReactElement } from "react";
import ChatMessage from "../components/ChatMessage";
import { w3cwebsocket as W3CWebSocket, IMessageEvent } from "websocket";
import { Message } from "../types/chatElementTypes";
import { ContextType } from "../types/contextTypes";
import { useOutletContext, useParams } from "react-router-dom";
import { api } from "../utilities/axiosInstance";
import { AxiosResponse } from "axios";
import { format, toZonedTime } from 'date-fns-tz';
import { Channel } from "../types/channelElementTypes";

interface ChatRoomProps {
  channel: Channel;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ channel }): ReactElement => {
  const { currentUser } = useOutletContext<ContextType>();
  const [inputMsg, setInputMsg] = useState<string>("");
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const { server_id, channel_id } = useParams()



  const room: string = "testroom"; // Update later to use the channel's name grabbed from request to WSGI

  const client: W3CWebSocket = useMemo(
    (): W3CWebSocket => new W3CWebSocket(`ws://0.0.0.0:8000/ws/chat/${room}/`),
    [room]
  );

  // This useEffect handles opening the websocket and receiving messages
  useEffect((): void => {
    // Confirms we are connected to websocket
    client.onopen = (): void => {
      console.log("WebSocket Client Connected");
    };

    // accepts broadcast and updates messages on page
    client.onmessage = (message: IMessageEvent): void => {
      const dataFromServer: string = message.data.toString(); // Assuming the server sends stringified JSON
      try {
        const parsedData: Message = JSON.parse(dataFromServer);
        console.log(parsedData)
        console.log('update messages')
        setChatLog((prevChatLog) => [...prevChatLog, parsedData]);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };
  }, [client]);

  useEffect((): void => {
    console.log("Getting messages")
    const getMessages = async (): Promise<void> => {
      try {
        const resp: AxiosResponse = await api.get(`servers/${server_id}/channels/${channel_id}/messages/`)
        console.log(resp.data)
        setChatLog(resp.data)
      } catch (error) {
        console.log(error)
      }
    }
    getMessages()
  }, [])

  const handleSend = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      const resp: AxiosResponse = await api.post(`servers/${server_id}/channels/${channel_id}/messages/`, { text: inputMsg, sender: currentUser.displayName })
      console.log(resp.data)
    } catch (error) {
      console.log(error)
    }
    const currentUtcDate = new Date();
    const utcDateInSpecificTimezone = toZonedTime(currentUtcDate, 'Etc/UTC')

    const datetime: string = format(utcDateInSpecificTimezone, "HH:mm - MMMM dd, yyyy")

    client.send(
      JSON.stringify({
        type: "message",
        text: inputMsg,
        sender: currentUser?.displayName,
        datetime: datetime
      })
    );
    setInputMsg("");
  };



  return (
    <>
      <div className="">
        <div className="justify-center">
          <h1 className="text-center text-4xl">Room Name</h1>
          <div className="grid grid-cols-8 gap-1  h-[800px]">
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatRoom;
