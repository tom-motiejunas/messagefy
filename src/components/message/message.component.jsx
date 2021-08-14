import React, { useRef } from "react";

import "./message.style.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";

import MsgLoad from "../message-load/message-load.component";

function Message({
  content,
  sender,
  id,
  connection,
  latestChat,
  setMessage,
  seeners,
}) {
  const userId = JSON.parse(localStorage.getItem("user"));
  const messageField = useRef(null);

  function editMsg() {
    messageField.current.focus();
    messageField.current.contentEditable = "true";
  }

  async function editMessage() {
    try {
      if (!connection) return;
      const newMsgContent = { content: messageField.current.textContent };
      await connection.invoke("EditMessage", id, newMsgContent);
      console.log("EDITED MSG");
    } catch (err) {
      if (err.source === "HubException") {
        console.error(`${e.message} : ${e.data.user}`);
      }
    }
  }

  async function deleteMessage() {
    try {
      if (!connection) return;
      await connection.invoke("DeleteMessage", id);
      const newChat = latestChat.current.filter((el) => {
        if (el.messageId !== id) return el;
      });
      setMessage(newChat);
    } catch (err) {
      if (err.source === "HubException") {
        console.error(`${e.message} : ${e.data.user}`);
      }
    }
  }

  return (
    <div
      className={`msg ${
        sender.toLowerCase() === userId.username.toLowerCase()
          ? "user"
          : "other"
      }-msg`}
    >
      <p ref={messageField} onBlur={editMessage}>
        {content}
      </p>
      {id === "loading" ? <MsgLoad></MsgLoad> : null}
      {sender.toLowerCase() === userId.username.toLowerCase() ? (
        <div className="btn-box">
          <button onClick={deleteMessage}>
            <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
          </button>
          <button onClick={editMsg}>
            <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default Message;
