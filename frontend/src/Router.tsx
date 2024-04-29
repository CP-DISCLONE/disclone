import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import ErrorPage from "./pages/ErrorPage";
import SignupPage from "./pages/SignupPage";
import ChatRoom from "./pages/ChatRoom";
import AccountInfo from "./pages/AccountInfo";
import { userConfirmation } from "./utilities/userUtilities";
import VideoChatPage from "./pages/VideoChatPage";
import VideoChat from "./components/VideoChat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: userConfirmation,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "chatroom/",
        element: <ChatRoom />,
      },

      {
        path: "*",
        element: <NotFoundPage />,
      },
      {
        path: "signup/",
        element: <SignupPage />,
      },
      {
        path: "account/",
        element: <AccountInfo />,
      },
      {
        path: "videochat/",
        element: <VideoChat />,
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

export default router;
