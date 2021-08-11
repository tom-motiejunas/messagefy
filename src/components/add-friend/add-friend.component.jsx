import React, { useState } from "react";

import "./add-friend.style.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Loading from "../loading/loading.component";

async function makeFriendRequest(setLoading) {
  try {
    const userId = JSON.parse(localStorage.getItem("user"));
    const username = document.querySelector("#friend-request").value;
    setLoading(true);
    const options = {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId.token}`,
      },
    };
    const request = await fetch(
      `http://10.144.0.1:5001/api/friend/send/${username}/`,
      options
    );
    if (request.ok === true) {
      console.log("Succesfully sended friend request");
    }
    setLoading(false);
  } catch (err) {
    console.error("failed to send friend request", err);
  }
}

function AddFriend() {
  const [loading, setLoading] = useState(false);

  return (
    <section className="friend-box">
      {loading ? <Loading></Loading> : null}
      <h2>Add Friend</h2>
      <span>You can add a friend by typing their username</span>
      <div className="search-box">
        <input type="text" name="userName" id="friend-request" />
        <button onClick={() => makeFriendRequest(setLoading)}>
          <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
        </button>
      </div>
    </section>
  );
}

export default AddFriend;
