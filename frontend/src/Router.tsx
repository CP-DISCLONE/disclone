import { createBrowserRouter } from "react-router-dom";
import App from "./App"
import { Children } from "react";
import LandingPage from "./pages/LandingPage"
import NotFoundPage from "./pages/NotFoundPage"
import ErrorPage from "./pages/ErrorPage"

const Router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children:[
            {
                index: true,
                element: <LandingPage />
            },
            
            {
                path:"*",
                element: <NotFoundPage />
            }
        ],
        errorElement: <ErrorPage />
    },
    ]); 
    
    export default Router;
