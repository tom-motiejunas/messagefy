import React, { useRef, useEffect } from "react";

import "./message-input.style.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faFileAlt } from "@fortawesome/free-solid-svg-icons";

function MsgInput({ chatId, connection, setMessage, seenMessage, latestChat }) {
  const fileRef = useRef(null);
  const msgFieldRef = useRef(null);
  const userId = JSON.parse(localStorage.getItem("user"));

  async function postMsg() {
    try {
      if (!connection) return;
      const userMsg = msgFieldRef.current.value.trim();

      if (userMsg === "") return;
      const msg = userMsg;
      msgFieldRef.current.value = "";

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
      await setMessage([msgToAdd, ...latestChat.current]);
      let sendedMsg = await connection.invoke("PostMessage", chatId, msgToSend);
      const msgNoLoadArr = latestChat.current.filter(
        (el) => el.messageId !== "loading"
      );
      // random id generator
      setMessage([sendedMsg, ...msgNoLoadArr]);
      seenMessage(connection);
    } catch (err) {
      if (err.source === "HubException") {
        console.error(`${e.message} : ${e.data.user}`);
      }
    }
  }

  async function sendFile(connection) {
    try {
      const userId = JSON.parse(localStorage.getItem("user"));
      const formData = new FormData();
      const fileData = fileRef.current.files[0];

      if (!fileData) return;

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
        `http://10.144.0.1:5001/api/file/sendmessage/${chatId}`,
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

  // Drag and drop
  useEffect(() => {
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      window.addEventListener(eventName, preventDefaults, false);
    });
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ["dragenter", "dragover"].forEach((eventName) => {
      window.addEventListener(eventName, highlight, false);
    });
    ["dragleave", "drop"].forEach((eventName) => {
      window.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
      document.getElementsByTagName("body")[0].style.opacity = "0.7";
    }

    function unhighlight() {
      document.getElementsByTagName("body")[0].style.opacity = "1";
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
  }, [connection]);

  return (
    <footer className="send-msg-box">
      <input
        type="text"
        name="message"
        className="message-field"
        ref={msgFieldRef}
        onKeyPress={(e) => (e.key === "Enter" ? postMsg() : null)}
      />
      <button className="send-btn" onClick={postMsg}>
        <FontAwesomeIcon icon={faPaperPlane}></FontAwesomeIcon>
      </button>
      <input
        type="file"
        name="input-photo"
        id="input-photo"
        onChange={() => sendFile(connection)}
        ref={fileRef}
        hidden
      />
      <label htmlFor="input-photo" className="send-btn">
        <FontAwesomeIcon icon={faFileAlt}></FontAwesomeIcon>
      </label>
    </footer>
  );
}

export default MsgInput;
