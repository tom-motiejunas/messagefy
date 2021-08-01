import React, { useRef } from "react";

import "./message.style.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";

async function sendNewMsg({ current }, msgId) {
  try {
    const userId = JSON.parse(localStorage.getItem("user"));
    const data = {
      Content: current.textContent,
    };

    const options = {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId.token}`,
      },
      body: JSON.stringify(data),
    };
    const request = await fetch(
      `http://25.79.95.4:5001/api/message/edit/${msgId}`,
      options
    );
    if (request.ok === true) {
      console.log("Succesfully edited messages");
    }
  } catch (err) {
    console.error("failed to edit message");
  }
}

async function deleteMsg(msgId) {
  try {
    const userId = JSON.parse(localStorage.getItem("user"));
    const options = {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId.token}`,
      },
    };
    const request = await fetch(
      `http://25.79.95.4:5001/api/message/delete/${msgId}`,
      options
    );
    if (request.ok === true) {
      console.log("Succesfully deleted messages");
    }
  } catch (err) {
    console.error("failed to deleted message");
  }
}

function Message({ content, sender, id }) {
  const userId = JSON.parse(localStorage.getItem("user"));
  const messageField = useRef(null);

  function editMsg() {
    messageField.current.focus();
    messageField.current.contentEditable = "true";
  }

  return (
    <div
      className={`msg ${
        sender.toLowerCase() === userId.username.toLowerCase()
          ? "user"
          : "other"
      }-msg`}
    >
      <p ref={messageField} onBlur={() => sendNewMsg(messageField, id)}>
        {content}
      </p>
      {sender.toLowerCase() === userId.username.toLowerCase() ? (
        <div className="btn-box">
          <button onClick={() => deleteMsg(id)}>
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
