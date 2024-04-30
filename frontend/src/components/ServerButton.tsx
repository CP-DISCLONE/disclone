import { ReactElement } from "react";
import { Server } from "../types/serverElementTypes";
import { Link } from "react-router-dom";

interface ServerButtonProps {
    server: Server;
}
const ServerButton: React.FC<ServerButtonProps> = ({
    server
}: ServerButtonProps): ReactElement => {
    return (
        // We have to use <a href> tags here because Link won't re-mount the page and therefore won't get the new channels
        <a
            href={`/server/${server.id}/`}
            className="relative block py-3 text-center text-md ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2 lg:px-4 lg:py-2 lg:text-base"
        >
            {server.name}
        </a>

    );
};

export default ServerButton;