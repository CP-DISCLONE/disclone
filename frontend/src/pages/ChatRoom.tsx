import { useState, useEffect, useMemo, FormEvent, ReactElement, useRef, ChangeEvent } from "react";
import ChatMessage from "../components/ChatMessage";
import { w3cwebsocket as W3CWebSocket, IMessageEvent } from "websocket";
import { Message } from "../types/chatElementTypes";
import { ContextType } from "../types/contextTypes";
import { useOutletContext, useParams } from "react-router-dom";
import Picker from "emoji-picker-react";
import { api } from "../utilities/axiosInstance";
import { AxiosResponse } from "axios";
import { format, toZonedTime } from "date-fns-tz";
import { Channel } from "../types/channelElementTypes";
import { Button } from "@/components/ui/button";

/**
 * @description The interface that defines the incoming props from the ServerPage
 *
 * @prop {Channel} channel The current Channel being rendered
 */
interface ChatRoomProps {
  channel: Channel;
}

/**
 * @description The ChatRoom page that renders the current Channel's messages
 * and a form for users to submit new messages
 * 
 * @param {ChatRoomProps} channel The current Channel being rendered
 * 
 * @returns {ReactElement} The ChatRoom page
 */
const ChatRoom: React.FC<ChatRoomProps> = ({ channel }: ChatRoomProps): ReactElement => {
  const [inputImage, setInputImage] = useState<File | null>(null);
  const { currentUser } = useOutletContext<ContextType>();
  const [inputMsg, setInputMsg] = useState<string>("");
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const { server_id } = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chosenEmoji, setChosenEmoji] = useState<string | null>(null);
  const room: string = `servers${server_id}channels${channel.id}`; // Update later to use the channel's name grabbed from request to WSGI

  /**
   * @description Creates a new WebSocket client that interacts asynchronously with the backend.
   * The definition is cached with the useMemo hook until the room changes so the client is not
   * open and closed each time the component re-renders
   */
  const client: W3CWebSocket = useMemo(
    (): W3CWebSocket => new W3CWebSocket(`ws://0.0.0.0:8000/ws/chat/${room}/`),
    [room]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatLog]);

  // This useEffect handles opening the websocket and receiving messages
  useEffect(() => {
    // Confirms we are connected to websocket
    client.onopen = (): void => {
      console.log("WebSocket Client Connected");
    };

    client.onclose = (): void => {

      console.log("WebSocket Client Disconnected");


    }

    // accepts broadcast and updates messages on page
    client.onmessage = (message: IMessageEvent): void => {
      const dataFromServer: string = message.data.toString(); // Assuming the server sends stringified JSON
      try {
        const parsedData: Message = JSON.parse(dataFromServer);
        console.log(parsedData);
        console.log("update messages");
        setChatLog((prevChatLog) => [...prevChatLog, parsedData]);
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };
    return () => {
      client.close(); // Close WebSocket connection
    };
  }, [client]);



  useEffect((): void => {
    console.log("Getting messages");
    const getMessages = async (): Promise<void> => {
      try {
        const resp: AxiosResponse = await api.get(
          `servers/${server_id}/channels/${channel.id}/messages/`
        );
        console.log(resp.data);
        setChatLog(resp.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, []);

  /**
   * @description Handler for a new message submission. A post request is made to the
   * synchronous portion of the backend and, if successful, the message is stored for later
   * retrieval. The message is also posted to the WebSocket, where the asynchronous portion
   * of the backend receives the message in the channel and sends it to all other clients
   * that are connected to the channel
   * 
   * @param {FormEvent} e The submission FormEvent
   */
  const handleSend = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    let messageToSend: any = {};
    if (chosenEmoji) {
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
    try {
      const resp: AxiosResponse = await api.post(
        `servers/${server_id}/channels/${channel.id}/messages/`,
        { text: inputMsg, sender: currentUser?.displayName }
      );
      console.log(resp.data);
    } catch (error) {
      console.log(error);
    }
    const currentUtcDate = new Date();
    const utcDateInSpecificTimezone = toZonedTime(currentUtcDate, "Etc/UTC");

    const datetime: string = format(
      utcDateInSpecificTimezone,
      "HH:mm - MMMM dd, yyyy"
    );

      client.send(
        JSON.stringify({
          type: "message",
          text: inputMsg,
          sender: currentUser?.displayName,
          datetime: datetime,
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
          <h1 className=" text-xl">Selected Channel: {channel.name}</h1>
          <div className="grid grid-cols-7 gap-1  h-[650px] justify-center">
           
            <div className="col-span-2 p-4 m-2 gap-4 flex flex-col text-md text-gray-400 rounded-md bg-primary-dark">
              Users:
              <div className="overflow-y-auto hover:bg-royalblue-300 p-2 m-1 flex-wrap flex items-center gap-2  rounded-md bg-background ">
                <div className="bg-slate-200 p-2 m-1  h-[40px] w-[40px] border  rounded-full "></div>
                <p className="text-foreground hidden lg:block">BananaSplitz</p>
              </div>
            </div>
            <div className="col-span-5 m-2 flex flex-col">
              {/* Chat messages */}
              <div className="h-[600px] overflow-y-auto p-4 rounded-md bg-primary-dark flex-col justify-end">
                <ul>
                  {chatLog.map((msg, index) => (
                    <li key={index}>
                      <ChatMessage msg={msg} index={index} />
                    </li>
                  ))}
                  <div ref={messagesEndRef} />
                </ul>
              </div>

              <form
                onSubmit={(e) => {
                  handleSend(e);
                }}
                className="flex gap-2 py-4"
              >
                <Button className="bg-primary-dark">
                  Send
                </Button>
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-4 py-2 rounded-md focus:outline-none border bg-background focus:border-blue-500"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUpload(e)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
                <Picker onEmojiClick={onEmojiClick} />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatRoom;