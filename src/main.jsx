import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ChessProfile from "./ChessProfile.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChessProfile />
  </StrictMode>,
);
