import React, { useState, useEffect } from "react";

import "./messages.style.css";

import DefaultPic from "../../assets/img/default-profile.png";

import { Link } from "react-router-dom";

async function updateFriendList(setFriendList) {
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
    const request = await fetch(`http://25.79.95.4:5001/api/friend/`, options);
    const data = await request.json();
    if (request.ok === true) {
      console.log("Succesfully got all friends");
      setFriendList(data);
    }
  } catch (err) {
    console.error("failed to get all friends", err);
  }
}

function Messages() {
  const [friendList, setFriendList] = useState(null);
  useEffect(() => {
    updateFriendList(setFriendList);
  }, []);

  return (
    <main className="lobby-container">
      {friendList
        ? friendList.map((el) => {
            return (
              <Link to="/chat-room" key={el.id}>
                <div className="people-cont">
                  <img src={el.result.image || DefaultPic} alt="profile-pic" />
                  <div className="info">
                    <span className="name">{el.result.displayName}</span>
                    <span className="last-msg">
                      Lorem ipsum dolor sit amet.
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        : null}
    </main>
  );
}

export default Messages;
