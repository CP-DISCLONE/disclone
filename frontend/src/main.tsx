import ReactDOM from "react-dom/client";
import "./index.css";
import router from "./Router";
import { RouterProvider } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
