import { User } from "@/types/userTypes";
import { ReactElement } from "react";

interface UserCardProps {
    user: User;
}


const UserCard: React.FC<UserCardProps> = ({ user }: UserCardProps): ReactElement => {
    return (
        <>
            <div className="overflow-y-auto hover:bg-royalblue-300 p-2 m-1 flex-wrap flex items-center gap-2  rounded-md bg-background ">
                <div className="bg-slate-200 p-2 m-1  h-[40px] w-[40px] border  rounded-full "></div>
                {user ? <p className="text-foreground hidden lg:block">{user.displayName}</p> : null}
            </div>
        </>
    );
};

export default UserCard;
