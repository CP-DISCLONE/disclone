import { ReactElement } from "react";
import editNoteImage from "../images/EditNoteRounded.svg";
import removecircleImage from "../images/RemoveCircleOutlineRounded.svg";
import { Message } from "../types/chatElementTypes";
import { parse, format } from 'date-fns'
interface ChatMessageProps {
  msg: Message;
  index: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  msg,
  index,
}: ChatMessageProps): ReactElement => {


  //---------------------------------------------------------------------------------------------
  //  It's long, but all of this makes sure the time zone is properly converted and formatted
  const datetimeString: string = msg.datetime;
  const date = parse(datetimeString, "HH:mm - MMMM dd, yyyy", new Date(), { timeZone: 'UTC' });

  // Adjust the parsed date to the user's local timezone
  const adjustedDate = new Date(date);
  adjustedDate.setHours(date.getHours() - date.getTimezoneOffset() / 60); // Adjust hours to local timezone

  const localTimeString = adjustedDate.toLocaleTimeString(undefined, {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hour12: false, // Use 24-hour format
    hour: '2-digit',
    minute: '2-digit',
  });

  // Format the adjusted date string
  const localDateString = `${localTimeString} - ${adjustedDate.toLocaleDateString(undefined, {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })}`;
  //----------------------------------------------------------------------------------------------


  return (
    <>
      <div className="flex items-left justify-left bg-slate-200 p-2 m-1 flex-col rounded-md">
        <div className=" inline-block text-slate-400">{localDateString}: {msg.sender}</div>
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
