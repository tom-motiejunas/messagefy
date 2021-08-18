import React, { useRef, useState, useEffect } from "react";

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
  isFile,
}) {
  const userId = JSON.parse(localStorage.getItem("user"));
  const messageField = useRef(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  function editMsg() {
    messageField.current.focus();
    messageField.current.contentEditable = "true";
  }

  async function getFile() {
    try {
      const userId = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      id = content.split(",")[1];
      if (!id) return;
      const options = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId.token}`,
        },
      };
      const request = await fetch(
        `http://10.144.0.1:5001/api/file/receivemessage/${id}/`,
        options
      );
      const data = await request.json();

      if (request.ok === true) {
        setLoading(false);
        // If file is a photo
        if (data.fileExtension.match(/(jpg|jpeg|png|gif|webp)$/i)) {
          setFile(
            <img src={`data:image/png;base64,${data.data}`} alt="photo"></img>
          );
        }
        // If file is a video
        else if (data.fileExtension.match(/(mp4|webm|ogg)$/i)) {
          setFile(
            <video width="250" controls>
              <source
                src={`data:video/${data.fileExtension};base64,${data.data}`}
              />
            </video>
          );
        }
        // If file is other
        else {
          // setFile(<a href="" download><span>data.file</span></a>)
          let header = "";
          switch (data.fileExtension) {
            case "pdf":
              header = "application/pdf";
              break;
            case "doc":
            case "docx":
              header = "application/msword";
              break;
            case "odp":
            case "ppt":
            case "pptx":
              header = "application/mspowerpoint";
              break;
            default:
              header = "text/plain";
              break;
          }
          setFile(
            <a
              id="download_link"
              download={`${data.fileName}.${data.fileExtension || "txt"}`}
              href={`data:${header};base64,${data.data}`}
            >
              {`${data.fileName}.${data.fileExtension || "txt"}`}
            </a>
          );
        }
      }
    } catch (err) {
      console.error("Failed to get file", err);
    }
  }

  async function editMessage() {
    <MsgLoad></MsgLoad>;
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

  useEffect(() => {
    if (isFile) {
      getFile();
    }
  }, []);
  return (
    <div
      className={`msg ${
        sender.toLowerCase() === userId.username.toLowerCase()
          ? "user"
          : "other"
      }-msg`}
    >
      {isFile ? (
        file ? (
          file
        ) : null
      ) : (
        <p ref={messageField} onBlur={editMessage}>
          {content}
        </p>
      )}
      {id === "loading" ? <MsgLoad></MsgLoad> : null}
      {loading ? <MsgLoad></MsgLoad> : null}
      {sender.toLowerCase() === userId.username.toLowerCase() ? (
        <div className="btn-box">
          <button onClick={deleteMessage}>
            <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
          </button>
          {isFile ? null : (
            <button onClick={editMsg}>
              <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Message;
