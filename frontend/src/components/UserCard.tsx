import { User } from "@/types/userTypes";
import { ReactElement } from "react";
import defaultProfilePicture from '../assets/default-image.jpg';
interface UserCardProps {
    user: User;
}


const UserCard: React.FC<UserCardProps> = ({ user }: UserCardProps): ReactElement => {
    return (
        <>
            <div className="overflow-y-auto hover:bg-royalblue-300 p-2 m-1 flex-wrap flex items-center gap-2  rounded-md bg-background ">
                {user.profilePicture ? <img className='rounded' alt={`${user.displayName}'s Profile Picture`} src={`http://localhost:8001${user.profilePicture}`} /> : <img className='rounded' src={defaultProfilePicture} alt={`${user.displayName}'s Profile Picture`} />}
                {user ? <p className="text-foreground hidden lg:block">{user.displayName}</p> : null}
            </div>
        </>
    );
};

export default UserCard;
