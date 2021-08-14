import React, { useRef, useEffect } from "react";

import "./notification.style.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import DefaultImg from "../../assets/img/default-profile.png";

function Notification({ notific }) {
  const { title, content, sender } = notific;
  const notificEle = useRef();

  function removeNotific() {
    if (!notificEle.current) return;
    notificEle.current.classList.add("disappear");
  }

  useEffect(() => {
    setTimeout(() => {
      removeNotific();
    }, 5000);
  }, []);

  return (
    <div className="notific-cont" ref={notificEle}>
      <header>
        <p>{title}</p>
        <button onClick={removeNotific}>
          <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
        </button>
      </header>
      {sender ? (
        <div className="main-cont">
          <div className="prof">
            <img src={DefaultImg} alt="profile-pic" />
            <h5>{sender}</h5>
          </div>
          <p>{content}</p>
        </div>
      ) : null}
    </div>
  );
}

export default Notification;
