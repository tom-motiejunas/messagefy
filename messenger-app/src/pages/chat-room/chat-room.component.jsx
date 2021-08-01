import React, { useEffect, useState } from "react";

import "./chat-room.style.css";

import Message from "../../components/message/message.component";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectFriends } from "../../redux/friends/friend.selector";

async function getMessages(setMessage, friendsUsername) {
  try {
    const userId = JSON.parse(localStorage.getItem("user"));
    if (!userId) return;
    const options = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId.token}`,
      },
    };
    const request = await fetch(
      `http://25.79.95.4:5001/api/message/${friendsUsername}/-1`,
      options
    );
    const messages = await request.json();
    setMessage(messages);
    if (request.ok === true) {
      console.log("Succesfully got all messages");
    }
  } catch (err) {
    console.error("failed to get all messages", err);
  }
}

async function postMsg(msg, friendsUsername) {
  try {
    const userId = JSON.parse(localStorage.getItem("user"));
    const data = {
      Content: msg,
    };

    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId.token}`,
      },
      body: JSON.stringify(data),
    };
    const request = await fetch(
      `http://25.79.95.4:5001/api/message/send/${friendsUsername}`,
      options
    );
    if (request.ok === true) {
      console.log("Succesfully sended messages");
    }
  } catch (err) {
    console.error("failed to send message");
  }
}

function ChatRoom() {
  const [message, setMessage] = useState([]);
  const username = document.URL.split("/").pop();
  useEffect(() => {
    getMessages(setMessage, username);
  }, []);

  return (
    <main className="container">
      <section className="msg-box">
        {message.length !== 0
          ? message.map((el) => {
              return (
                <Message
                  key={el.result.messageId}
                  content={el.result.content}
                  sender={el.result.senderName}
                ></Message>
              );
            })
          : null}
      </section>
      <footer className="send-msg-box">
        <input type="text" name="message" className="message-field" />
        <button
          className="send-btn"
          onClick={() => {
            postMsg(
              document.querySelector(".message-field").value,
              friends[0].result.userName
            );
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
        </button>
      </footer>
    </main>
  );
}

export default ChatRoom;
