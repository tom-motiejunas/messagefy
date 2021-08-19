import React, { useState, useRef, useEffect } from "react";

import "./add-group.style.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import Loading from "../loading/loading.component";

import { createStructuredSelector } from "reselect";
import { selectFriends } from "../../redux/friends/friend.selector";
import { connect } from "react-redux";

import DefaultPic from "../../assets/img/default-profile.png";

function AddGroup({ friends }) {
  const userId = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(false);

  const groupTitleRef = useRef(null);
  const groupOptionRef = useRef(null);
  const friendsRef = useRef(null);

  //   converting to array to access map method
  useEffect(() => {
    friendsRef.current = Array.from(
      document.querySelectorAll(".group-friend-list li")
    );
  }, []);

  async function createGroup() {
    try {
      const checkedFriends = friendsRef.current.filter((el) => {
        if (el.lastChild.checked) return el;
      });
      if (checkedFriends.length < 2) return;
      setLoading(true);

      const friendUsernames = checkedFriends.map(
        (el) => el.childNodes[1].textContent
      );
      const groupTitle = groupTitleRef.current.value;

      const data = {
        Title: groupTitle,
        Recipients: friendUsernames,
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
        `http://10.144.0.1:5001/api/group/create/`,
        options
      );
      if (request.ok === true) {
        console.log("Succesfully sended friend request");
        const response = await request.json();
        console.log(response);
      }
      setLoading(false);
      hideGroupOptions();
    } catch (err) {
      console.error("failed to send friend request", err);
    }
  }

  function displayGroupOptions() {
    groupOptionRef.current.classList.remove("hidden");
  }
  function hideGroupOptions() {
    groupOptionRef.current.classList.add("hidden");
  }

  function checkFriend(e) {
    e.currentTarget.lastChild.checked = !e.currentTarget.lastChild.checked;
  }

  return (
    <section className="group-box">
      {loading ? <Loading></Loading> : null}
      <div className="create-group-box">
        <h2>Create Group</h2>
        <button className="display-group-options" onClick={displayGroupOptions}>
          <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
        </button>
      </div>
      <div className="group-option-box hidden" ref={groupOptionRef}>
        <header>
          <input
            type="text"
            name="group-name"
            className="group-title"
            placeholder={"Group Title (optional)"}
            ref={groupTitleRef}
          />
          <button className="close-group-option" onClick={hideGroupOptions}>
            <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
          </button>
        </header>

        <ul className="group-friend-list">
          {friends
            ? friends.map((el) => {
                return (
                  <li onClick={checkFriend}>
                    <img
                      src={
                        el.result.image
                          ? `data:image/png;base64,${el.result.image}`
                          : DefaultPic
                      }
                      alt="profile-pic"
                    />
                    <h3>{el.result.userName}</h3>
                    <input
                      type="checkbox"
                      name="addFriend"
                      className="group-checkbox"
                    />
                  </li>
                );
              })
            : null}
        </ul>
        <button className="create-group-btn" onClick={createGroup}>
          Create Group
        </button>
      </div>
    </section>
  );
}

const mapStateToProps = createStructuredSelector({
  friends: selectFriends,
});

export default connect(mapStateToProps)(AddGroup);
