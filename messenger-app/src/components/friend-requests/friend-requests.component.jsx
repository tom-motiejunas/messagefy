import React, { useEffect, useState } from "react";

import "./friend-requests.style.css";

import DefaultPic from "../../assets/img/default-profile.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

async function getFriendRequest() {
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
      `http://25.79.95.4:5001/api/friend/requests/`,
      options
    );
    const data = await request.json();
    if (request.ok === true) {
      console.log("Succesfully got all friend requests");
    }
    return data;
  } catch (err) {
    console.error("failed to send friend request", err);
  }
}

async function acceptFriendRequest(friendRequestId, setFriendRequests) {
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
      `http://25.79.95.4:5001/api/friend/accept/${friendRequestId}/`,
      options
    );
    if (request.ok === true) {
      console.log("Succesfully accepted friend requests");
      updateFriendRequests(setFriendRequests);
    }
  } catch (err) {
    console.error("failed to accept friend request", err);
  }
}

async function declineFriendRequest(friendRequestId, setFriendRequests) {
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
      `http://25.79.95.4:5001/api/friend/decline/${friendRequestId}/`,
      options
    );
    if (request.ok === true) {
      console.log("Succesfully declined friend requests");
      updateFriendRequests(setFriendRequests);
    }
  } catch (err) {
    console.error("failed to decline friend request", err);
  }
}

async function updateFriendRequests(setFriendRequests) {
  const data = await getFriendRequest();
  setFriendRequests(data);
}

function FriendRequests() {
  const [friendRequests, setFriendRequests] = useState(0);
  useEffect(() => {
    updateFriendRequests(setFriendRequests);
  }, []);

  return (
    <section className="friend-request-box">
      <h2>All Your Friend Requests</h2>

      {friendRequests
        ? friendRequests.map((el) => {
            console.log(el);
            return (
              <div
                className="people-cont"
                style={{ cursor: "default" }}
                key={el.id}
              >
                <img src={el.result.image || DefaultPic} alt="profile-pic" />
                <div className="request-info">
                  <span className="name">{el.result.displayName}</span>
                  <button
                    className="green"
                    onClick={() =>
                      acceptFriendRequest(
                        el.result.conversationId,
                        setFriendRequests
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
                  </button>
                  <button
                    className="red"
                    onClick={() =>
                      declineFriendRequest(
                        el.result.conversationId,
                        setFriendRequests
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                  </button>
                </div>
              </div>
            );
          })
        : null}
    </section>
  );
}

export default FriendRequests;
