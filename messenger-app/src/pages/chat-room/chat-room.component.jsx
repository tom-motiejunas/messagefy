import React, { useEffect, useState } from "react";

import "./chat-room.style.css";

import Message from "../../components/message/message.component";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

async function getMessages(setMessage, url) {
  const request = await fetch(url);
  const messages = await request.json();
  console.log(messages);
  // setMessage(messages);
}

async function postMsg(msg) {
  const data = {
    content: msg,
  };

  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const request = await fetch("http://25.79.95.4:5001/api/Message/", options);
}

function ChatRoom() {
  const [msgType, setMsgType] = useState(null);
  const [message, setMessage] = useState([]);

  useEffect(() => {
    getMessages(setMessage, "http://25.79.95.4:5001/api/Message/");
  }, []);

  return (
    <main className="container">
      <section className="msg-box">
        {/* {message.map(el => <Message msgType={} msgText={}></Message>)} */}
        <Message msgType={"user"}></Message>
        <Message msgType={"other"}></Message>
        <Message msgType={"other"}></Message>
        <Message msgType={"user"}></Message>
      </section>
      <footer className="send-msg-box">
        <input type="text" name="message" className="message-field" />
        <button
          className="send-btn"
          onClick={() => {
            postMsg(document.querySelector(".message-field").value);
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
        </button>
      </footer>
    </main>
  );
}

export default ChatRoom;
