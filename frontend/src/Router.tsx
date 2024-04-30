import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import ErrorPage from "./pages/ErrorPage";
import SignupPage from "./pages/SignupPage";
import ServerPage from "./pages/ServerPage";
import AccountInfo from "./pages/AccountInfo";
import { userConfirmation } from "./utilities/userUtilities";

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
        path: "server/:server_id/",
        element: <ServerPage />,
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
    ],
    errorElement: <ErrorPage />,
  },
]);

export default router;
