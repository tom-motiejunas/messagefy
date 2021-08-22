import React, { useEffect, useState, useRef } from "react";

import "./chat-room.style.css";

import Message from "../../components/message/message.component";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";

import { HubConnectionBuilder } from "@microsoft/signalr";
import MsgInput from "../../components/message-input/message-input.component";

import DefaultPic from "../../assets/img/default-profile.png";

function ChatRoom() {
  const [message, setMessage] = useState([]);
  const chatId = document.URL.split("/").pop();

  const [connection, setConnection] = useState(null);
  const [seeners, setSeeners] = useState([]);
  const [loadMsgNum, setLoadMsgNum] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState(false);

  const latestChat = useRef(null);
  const msgBoxRef = useRef(null);
  const loadMsgNumRef = useRef(null);
  const userImgs = useRef({});

  const userId = JSON.parse(localStorage.getItem("user"));

  latestChat.current = message;
  loadMsgNumRef.current = loadMsgNum;

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

      await connection.invoke("DownloadMessages", chatId, num);
    } catch (err) {
      if (err.source === "HubException") {
        console.error(`${e.message} : ${e.data.user}`);
      }
    }
  }

  async function seenMessage(connection) {
    try {
      if (!connection) return;
      await connection.invoke("SeenMessage", latestChat.current[0].messageId);
      // Setting seen messages of people
    } catch (err) {
      if (err.source === "HubException") {
        console.error(`${e.message} : ${e.data.user}`);
      }
    }
  }

  async function getUserDetails() {
    try {
      const userId = JSON.parse(localStorage.getItem("user"));

      const options = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId.token}`,
        },
      };
      const request = await fetch(
        `http://10.144.0.1:5001/api/group/userdetails/${chatId}`,
        options
      );
      if (request.ok === true) {
        console.log("Succesfully got all users details");
        const data = await request.json();
        const seenData = [];
        data.forEach((el) => {
          seenData.push([el.displayName, el.lastSeenMessageId]);
          userImgs.current[el.username] = el.image;
        });
        setSeeners(seenData);
      }
    } catch (err) {
      console.error("failed to get all users details", err);
    }
  }

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          getMessages(connection);
          connection.on("ReceiveMessage", async (msg) => {
            setMessage([msg, ...latestChat.current]);
            seenMessage(connection);
          });
          connection.on("ReceiveMessages", async (allMsgs) => {
            if (allMsgs.length === 0) return;
            setMessage([...latestChat.current, ...allMsgs]);
            getUserDetails();
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
            console.log(msg);
            setSeeners([
              [userId.username, msg.messageId],
              [msg.senderName, msg.messageId],
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
                  <div
                    className={`msg-content ${
                      el.senderName !== userId.username ? "other" : null
                    }`}
                  >
                    <img
                      src={
                        userImgs.current[el.senderName]
                          ? `data:image/png;base64,${
                              userImgs.current[el.senderName]
                            }`
                          : DefaultPic
                      }
                      alt="user-pic"
                      className="user-pic"
                    />
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
                </div>
              );
            })
          : null}
      </section>
      <MsgInput
        chatId={chatId}
        connection={connection}
        setMessage={setMessage}
        seenMessage={seenMessage}
        latestChat={latestChat}
      ></MsgInput>
    </main>
  );
}

export default ChatRoom;
