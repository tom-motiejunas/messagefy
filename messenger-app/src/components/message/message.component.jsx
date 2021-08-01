import React from "react";

import "./message.style.css";

function Message({ content, sender }) {
  const userId = JSON.parse(localStorage.getItem("user"));
  console.log(userId);
  return (
    <div className={`msg ${sender === userId.username ? "user" : "other"}-msg`}>
      <p>{content}</p>
    </div>
  );
}

export default Message;
