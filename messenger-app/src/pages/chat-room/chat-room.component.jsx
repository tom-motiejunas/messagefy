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
  const [loadMsgNum, setLoadMsgNum] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState(false);

  const latestChat = useRef(null);
  const fileRef = useRef(null);
  const msgBoxRef = useRef(null);
  const loadMsgNumRef = useRef(null);

  const userId = JSON.parse(localStorage.getItem("user"));

  latestChat.current = message;
  loadMsgNumRef.current = loadMsgNum;

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

  async function sendFile() {
    try {
      const userId = JSON.parse(localStorage.getItem("user"));
      const formData = new FormData();
      const fileData = fileRef.current.files[0];
      console.log(fileData);

      console.log(fileData);

      formData.append("file", fileData);

      const options = {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${userId.token}`,
        },
        body: formData,
      };
      delete options.headers["Content-Type"];
      const request = await fetch(
        `http://10.144.0.1:5001/api/file/sendmessage/${username}`,
        options
      );
      if (request.ok === true) {
        console.log("Succesfully sended file");
        const newMessage = await request.json();
        setMessage([newMessage, ...latestChat.current]);
        seenMessage(connection);
      }
    } catch (err) {
      console.error("Failed to send file", err);
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

  async function getMessages(connection, num = 0) {
    try {
      if (!connection) return;

      await connection.invoke("DownloadMessages", username, num);
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
            if (allMsgs.length === 0) return;
            setMessage([...latestChat.current, ...allMsgs]);
            seenMessage(connection);
            setLoadingMsg(false);
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

  const loadOldMsg = async function () {
    if (loadingMsg) return;

    const scrollHeight = msgBoxRef.current.scrollHeight;
    const scrollTop = msgBoxRef.current.scrollTop;
    const clientHeight = msgBoxRef.current.clientHeight;
    // Scroll near the top, load older msg
    if (scrollHeight + scrollTop < clientHeight + 150) {
      setLoadingMsg(true);
      await setLoadMsgNum(loadMsgNumRef.current + 20);
      getMessages(connection, loadMsgNumRef.current);
    }
  };

  // Drag and drop
  useEffect(() => {
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      window.addEventListener(eventName, preventDefaults, false);
    });
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    window.addEventListener("drop", handleDrop, false);

    function handleDrop(e) {
      let dt = e.dataTransfer;
      let files = dt.files;
      handleFile(files);
    }

    function handleFile(e) {
      fileRef.current.files = e;
      sendFile();
    }
  }, []);

  return (
    <main className="container">
      <Link to="/" className="go-back-container">
        <button className="go-back">
          <FontAwesomeIcon icon={faArrowAltCircleLeft}></FontAwesomeIcon>
        </button>
      </Link>
      <section className="msg-box" ref={msgBoxRef} onScroll={loadOldMsg}>
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
                    isFile={el.isReferenceToFile}
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
          onChange={sendFile}
          ref={fileRef}
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
