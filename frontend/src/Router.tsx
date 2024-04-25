import { createBrowserRouter } from "react-router-dom";
import App from "./App"
import { Children } from "react";
import LandingPage from "./pages/LandingPage"
import NotFoundPage from "./pages/NotFoundPage"
import ErrorPage from "./pages/ErrorPage"
import SignupPage from "./pages/SignupPage";
import ChatRoom from "./pages/ChatRoom";
import AccountInfo from "./pages/AccountInfo";

const Router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <LandingPage />
            },
            {
                path: "chatroom/",
                element: <ChatRoom />
            },

            {
                path: "*",
                element: <NotFoundPage />
            },
            {
                path: "signup/",
                element: <SignupPage />
            },
            {
                path: "account/",
                element: <AccountInfo />
            }
        ],
        errorElement: <ErrorPage />
    },
]);

export default Router;
