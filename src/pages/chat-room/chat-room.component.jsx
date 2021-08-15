import React, { useEffect, useState, useRef } from "react";

import "./chat-room.style.css";

import Message from "../../components/message/message.component";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faArrowAltCircleLeft,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";

import { HubConnectionBuilder } from "@microsoft/signalr";

function ChatRoom() {
  const [message, setMessage] = useState([]);
  const username = document.URL.split("/").pop();

  const [connection, setConnection] = useState(null);
  const [seeners, setSeeners] = useState([]);

  const latestChat = useRef(null);

  const userId = JSON.parse(localStorage.getItem("user"));

  latestChat.current = message;

  async function postMsg(el, friendsUsername, connection) {
    try {
      if (!connection) return;
      const userMsg = el.value.trim();
      if (userMsg === "") return;
      const msg = userMsg;
      el.value = "";

      const msgToSend = {
        content: msg,
      };
      const msgToAdd = {
        messageId: "loading",
        content: msg,
        date: null,
        senderName: userId.username,
        dateEdited: null,
      };
      setMessage([msgToAdd, ...message]);
      let sendedMsg = await connection.invoke(
        "PostMessage",
        friendsUsername,
        msgToSend
      );
      const msgNoLoadArr = message.filter((el) => el.messageId !== "loading");
      // random id generator
      setMessage([sendedMsg, ...msgNoLoadArr]);
      seenMessage(connection);
    } catch (err) {
      if (err.source === "HubException") {
        console.error(`${e.message} : ${e.data.user}`);
      }
    }
  }

  useEffect(async () => {
    const userToken = JSON.parse(localStorage.getItem("user"));

    const newConnection = new HubConnectionBuilder()
      .withUrl("http://10.144.0.1:5001/message", {
        accessTokenFactory: () => {
          return userToken.token;
        },
      })
      .withAutomaticReconnect()
      .build();

    await setConnection(newConnection);
  }, []);

  async function getMessages(connection) {
    try {
      if (!connection) return;
      await connection.invoke("DownloadMessages", username, 0);
    } catch (err) {
      if (err.source === "HubException") {
        console.error(`${e.message} : ${e.data.user}`);
      }
    }
  }

  async function seenMessage(connection) {
    try {
      if (!connection) return;
      await connection.invoke(
        "SeenMessage",
        username,
        latestChat.current[0].messageId
      );
      const friendSeen = await connection.invoke("GetSeenMessageId", username);
      // Setting seen messages of people
      setSeeners([
        [userId.username, latestChat.current[0].messageId],
        [username, friendSeen.messageId],
      ]);
    } catch (err) {
      if (err.source === "HubException") {
        console.error(`${e.message} : ${e.data.user}`);
      }
    }
  }

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          getMessages(connection);
          connection.on("ReceiveMessage", async (msg) => {
            if (msg.senderName !== username) return;
            setMessage([msg, ...latestChat.current]);
            seenMessage(connection);
          });
          connection.on("ReceiveMessages", async (allMsgs) => {
            setMessage(allMsgs);
            seenMessage(connection);
          });
          connection.on("UpdateMessage", async (msg) => {
            const newChat = latestChat.current.map((el) =>
              el.messageId === msg.messageId ? msg : el
            );
            setMessage(newChat);
          });
          connection.on("DeleteMessage", async (msg) => {
            const newChat = latestChat.current.filter((el) => {
              if (el.messageId !== msg.messageId) return el;
            });
            setMessage(newChat);
          });
          connection.on("SeenMessage", async (msg) => {
            console.log("seenMessage");
            setSeeners([
              [userId.username, msg.messageId],
              [username, msg.messageId],
            ]);
          });
        })
        .catch((err) => null);
    }
  }, [connection]);

  return (
    <main className="container">
      <Link to="/" className="go-back-container">
        <button className="go-back">
          <FontAwesomeIcon icon={faArrowAltCircleLeft}></FontAwesomeIcon>
        </button>
      </Link>
      <section className="msg-box">
        {message.length !== 0
          ? message.map((el) => {
              return (
                <div className="msg-container" key={el.messageId}>
                  {seeners.map((seen) =>
                    seen[1] === el.messageId ? (
                      <span
                        key={Math.round(Math.random() * Math.random() * 99999)}
                      >{`Seen by ${seen[0]}`}</span>
                    ) : null
                  )}
                  <Message
                    content={el.content}
                    sender={el.senderName}
                    id={el.messageId}
                    connection={connection}
                    setMessage={setMessage}
                    latestChat={latestChat}
                  ></Message>
                </div>
              );
            })
          : null}
      </section>
      <footer className="send-msg-box">
        <input
          type="text"
          name="message"
          className="message-field"
          onKeyPress={(e) =>
            e.key === "Enter"
              ? postMsg(
                  document.querySelector(".message-field"),
                  username,
                  connection
                )
              : null
          }
        />
        <button
          className="send-btn"
          onClick={() => {
            postMsg(
              document.querySelector(".message-field"),
              username,
              connection
            );
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
        </button>
        <input
          type="file"
          name="input-photo"
          id="input-photo"
          accept="image/*"
          onChange={null}
          ref={null}
          hidden
        />
        <label htmlFor="input-photo" className="send-btn">
          <FontAwesomeIcon icon={faFileAlt}></FontAwesomeIcon>
        </label>
      </footer>
    </main>
  );
}

export default ChatRoom;