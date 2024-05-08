import { ReactElement } from "react";
import { Server } from "../types/serverElementTypes";

/**
 * @description The interface that defines the props passed down to the ServerButton
 *
 * @property {Server} server The Server attached to the button
 */
interface ServerButtonProps {
  server: Server;
}

/**
 * @description The ServerButton that redirects a user to the selected server
 *
 * @param {ServerButtonProps} server The server attached to the button
 *
 * @returns {ReactElement} The ServerButton component
 */
const ServerButton: React.FC<ServerButtonProps> = ({
  server,
}: ServerButtonProps): ReactElement => {
  return (
    // We have to use <a href> tags here because Link won't re-mount the page and therefore won't get the new channels
    <a
      href={`/server/${server.id}/`}
      className="flex flex-row px-3 text-center text-md text-primary-dark  "
    >
      {server.name}
    </a>
  );
};

export default ServerButton;
