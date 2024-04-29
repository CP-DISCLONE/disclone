import { ReactElement } from "react";
import editNoteImage from "../images/EditNoteRounded.svg";
import removecircleImage from "../images/RemoveCircleOutlineRounded.svg";
import { Message } from "../types/chatElementTypes";

interface ChatMessageProps {
  msg: Message;
  index: number;
}


const ChatMessage: React.FC<ChatMessageProps> = ({
  msg,
  index,
}: ChatMessageProps): ReactElement => {

  return (
    <>
      <div className="flex items-left justify-left bg-slate-200 p-2 m-1 flex-col rounded-md">
        <div className=" inline-block text-slate-400">09:31: {msg.sender}</div>
        <div key={index} className="">
          {msg.text}
        </div>
        <div className="flex flex-row justify-end gap-2">
          <button className="transform hover:scale-110" title="Edit Message">
            <img src={editNoteImage} alt="Edit Note" />
          </button>
          <button className="transform hover:scale-110" title="Delete Message">
            <img src={removecircleImage} alt="Remove Circle" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatMessage;
