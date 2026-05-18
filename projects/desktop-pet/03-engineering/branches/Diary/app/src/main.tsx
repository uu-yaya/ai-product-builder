import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DiaryModuleApp } from "./diary/DiaryModuleApp";
import "./diary/styles/diary.css";
import "./diary/styles/portrait.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DiaryModuleApp />
  </StrictMode>
);
