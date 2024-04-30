import { ReactElement, useEffect, useState } from "react";

import { Channel } from "../types/channelElementTypes";

interface ChannelPageProps {
    channel: Channel;
}
const ChannelPage: React.FC<ChannelPageProps> = ({
    channel
}: ChannelPageProps): ReactElement => {

    return (
        <div className='w-full bg-red-100 text-black'>
            <p>{channel.name}</p>
        </div>

    )
};

export default ChannelPage;
