import React, { useEffect, useState } from "react";

import "./chat-room.style.css";

import Message from "../../components/message/message.component";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faArrowAltCircleLeft,
} from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";

import { HubConnectionBuilder } from "@microsoft/signalr";

// async function getMessages(setMessage, friendsUsername) {
//   try {
//     const userId = JSON.parse(localStorage.getItem("user"));
//     if (!userId) return;
//     const options = {
//       method: "GET",
//       mode: "cors",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userId.token}`,
//       },
//     };
//     const request = await fetch(
//       `http://10.144.0.1:5001/api/message/${friendsUsername}/0`,
//       options
//     );
//     let messages = await request.json();
//     messages = messages.sort((el1, el2) => {
//       return el2.result.date - el1.result.date;
//     });
//     setMessage(messages);
//     if (request.ok === true) {
//       console.log("Succesfully got all messages");
//     }
//   } catch (err) {
//     console.error("failed to get all messages", err);
//   }
// }

function ChatRoom() {
  const [message, setMessage] = useState([]);
  const username = document.URL.split("/").pop();

  const [connection, setConnection] = useState(null);

  async function addNewMsg(newMsg) {
    const result = { result: newMsg };
    let newMsgArr = [result, ...message];

    // Deletes temp msg's
    newMsgArr = newMsgArr.filter((el) => el.messageId !== "loading");
    setMessage(newMsgArr);
  }

  async function postMsg(el, friendsUsername) {
    try {
      // setMsgLoading(...msgLoading, msg)
      const msg = el.value;
      console.log(msg);
      el.value = "";
      const userId = JSON.parse(localStorage.getItem("user"));
      const tempMsg = {
        messageId: "loading",
        content: msg,
        date: null,
        senderName: userId.username,
        dateEdited: null,
      };
      addNewMsg(tempMsg);

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
        `http://10.144.0.1:5001/api/message/send/${friendsUsername}`,
        options
      );
      if (request.ok === true) {
        console.log("Succesfully sended messages");
        const data = await request.json();
        console.log(data);
        addNewMsg(data);
      }
    } catch (err) {
      console.error("failed to send message");
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

  useEffect(async () => {
    if (connection) {
      connection
        .start()
        .then((result) => {
          getMessages(connection);
          connection.on("Received Msg", async (msg) => {
            console.log("GOT MESSAGE");
            addNewMsg(msg);
          });
          connection.on("ReceiveMessages", async (allMsgs) => {
            setMessage(allMsgs);
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
                <Message
                  key={el.result.messageId}
                  content={el.result.content}
                  sender={el.result.senderName}
                  id={el.result.messageId}
                ></Message>
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
              ? postMsg(document.querySelector(".message-field"), username)
              : null
          }
        />
        <button
          className="send-btn"
          onClick={() => {
            postMsg(document.querySelector(".message-field"), username);
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
        </button>
      </footer>
    </main>
  );
}

export default ChatRoom;
