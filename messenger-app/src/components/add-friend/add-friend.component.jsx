import React from "react";

import "./add-friend.style.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

async function makeFriendRequest() {
  try {
    const userId = JSON.parse(localStorage.getItem("user"));
    const username = document.querySelector("#friend-request").value;

    const options = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId.token}`,
      },
    };
    const request = await fetch(
      `http://25.79.95.4:5001/api/friend/send/${username}/`,
      options
    );
    console.log(request);
    if (request.ok === true) {
      console.log("Succesfully sended friend request");
    }
  } catch (err) {
    console.error("failed to send friend request", err);
  }
}

function AddFriend() {
  return (
    <section className="friend-box">
      <h2>Add Friend</h2>
      <span>You can add a friend by typing their username</span>
      <div className="search-box">
        <input type="text" name="userName" id="friend-request" />
        <button onClick={makeFriendRequest}>
          <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
        </button>
      </div>
    </section>
  );
}

export default AddFriend;
