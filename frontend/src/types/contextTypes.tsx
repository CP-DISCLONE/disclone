import { Server } from "./serverElementTypes";
import { User } from "./userTypes";

/**
 * @description The interface that sets the props that are passed through Outlet
 * Context by React Router DOM
 * 
 * @prop {User | null} currentUser The current User that is logged in
 * @prop {React.Dispatch<React.SetStateAction<User | null>>} setCurrentUser The setter for the currentUser state
 */
export interface ContextType {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  myServers: Server[];
  setMyServers: (myServers: Server[]) => void;
}
