import { ReactElement } from "react";
import editNoteImage from "../images/EditNoteRounded.svg";
import removecircleImage from "../images/RemoveCircleOutlineRounded.svg";
import { Message } from "../types/chatElementTypes";
import { parseISO } from "date-fns";
import { format } from "date-fns-tz";
/**
 * @description The interface that defines the props being passed down from the ChatRoom
 * page
 *
 * @property {Message} msg The message
 * @property {number} index The index of the message to properly render the React element
 * being mapped over
 */
interface ChatMessageProps {
  msg: Message;
  index: number;
}
/**
 * @description The component for each individual message displayed in the ChatRoom page
 *
 * @param {ChatMessageProps} props The props passed down from the ChatRoom page to the
 * component
 *
 * @returns {ReactElement} The ChatMessage component
 */
const ChatMessage: React.FC<ChatMessageProps> = ({
  msg,
  index,
}: ChatMessageProps): ReactElement => {
  const datetimeString: string = msg.datetime;
  const date: Date = parseISO(datetimeString);
  const localDateString: string = format(date, "HH:mm - MMMM dd, yyyy", {
    timeZone: "auto",
  });

  return (
    <>
      <div className="flex items-left justify-left bg-background p-2 m-1 flex-col rounded-md">
        <div className="inline-block text-slate-400 text-sm">
          {localDateString}: {msg.sender}
        </div>
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
