import React, { useEffect, useState, useRef } from "react";

import "./groups.style.css";

import Loading from "../loading/loading.component";

import { createStructuredSelector } from "reselect";
import { selectGroups } from "../../redux/groups/groups.selector";
import { setGroups } from "../../redux/groups/groups.action";
import { connect } from "react-redux";

import { Link } from "react-router-dom";

import DefaultPic from "../../assets/img/default-profile.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";

import TimeAgo from "react-timeago";
import { selectFriends } from "../../redux/friends/friend.selector";

function Groups({ groups, friends, setGroups }) {
  const [loading, setLoading] = useState(null);

  const groupTitleRef = useRef(null);
  const photoFileRef = useRef(null);
  const idRef = useRef(null);
  const groupOptionRef = useRef(null);
  const friendsRef = useRef(null);

  //   converting to array to access map method

  async function updateGroupList() {
    try {
      const userId = JSON.parse(localStorage.getItem("user"));
      if (!userId) return;
      setLoading(true);

      const options = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId.token}`,
        },
      };
      const request = await fetch(`http://10.144.0.1:5001/api/group/`, options);
      const data = await request.json();
      if (request.ok === true) {
        console.log("Succesfully got all groups");
        setGroups(data);
      }
      setLoading(false);
    } catch (err) {
      console.error("failed to get all groups", err);
      setLoading(false);
    }
  }

  useEffect(() => {
    updateGroupList();
    friendsRef.current = Array.from(
      document.querySelectorAll(".group-friend-list li")
    );
  }, []);

  function allowRename(e) {
    const nameNode =
      e.currentTarget.parentElement.parentElement.parentElement.childNodes[0]
        .childNodes[0].childNodes[1].childNodes[0];
    groupTitleRef.current = nameNode;
    nameNode.focus();
    nameNode.contentEditable = true;
  }

  async function editTitle(id) {
    try {
      const userId = JSON.parse(localStorage.getItem("user"));

      const data = {
        id: id,
        parameter: groupTitleRef.current.textContent,
      };
      console.log(data);
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
        `http://10.144.0.1:5001/api/group/renamegroup`,
        options
      );
      if (request.ok === true) {
        console.log("Succesfully sended file");
      }
    } catch (err) {
      console.error("Failed to send file", err);
    }
  }

  function selectFile(e) {
    photoFileRef.current.click();
    idRef.current =
      e.currentTarget.parentElement.parentElement.parentElement.dataset.id;
  }

  async function changeGroupPhoto() {
    const photo = photoFileRef.current.files[0];

    if (!photo) return;
    try {
      setLoading(true);
      const userId = JSON.parse(localStorage.getItem("user"));

      const formData = new FormData();

      formData.append("file", photo);
      formData.append("id", idRef.current);

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
        `http://10.144.0.1:5001/api/file/sendgroup/`,
        options
      );
      if (request.ok === true) {
        console.log("Succesfully change group photo");
        updateGroupList();
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to change group photo", err);
    }
  }

  async function leaveGroup(e) {
    try {
      const userId = JSON.parse(localStorage.getItem("user"));
      const id =
        e.currentTarget.parentElement.parentElement.parentElement.dataset.id;
      const data = {
        id: id,
        parameter: userId.username,
      };

      const options = {
        method: "DELETE",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userId.token}`,
        },
        body: JSON.stringify(data),
      };
      const request = await fetch(
        `http://10.144.0.1:5001/api/group/removerecipient`,
        options
      );
      if (request.ok === true) {
        console.log("Succesfully left a group");
        updateGroupList();
      }
    } catch (err) {
      console.error("Failed to leave a group", err);
    }
  }

  function showOptions(e) {
    const currentTarget = e.currentTarget.nextSibling;

    if (currentTarget.classList.contains("appear")) {
      currentTarget.classList.toggle("appear");
      return;
    }
    const allPanels = document.querySelectorAll(".group-option");
    // Closing all opened panels
    allPanels.forEach((el) => el.classList.remove("appear"));

    currentTarget.classList.toggle("appear");
  }

  function openGroupOptions(e) {
    groupOptionRef.current.classList.remove("hide");
    idRef.current =
      e.currentTarget.parentElement.parentElement.parentElement.dataset.id;
  }

  function hideGroupOptions() {
    groupOptionRef.current.classList.add("hide");
  }

  function checkFriend(e) {
    e.currentTarget.lastChild.checked = !e.currentTarget.lastChild.checked;
  }

  async function addFriendToGroup(e) {
    const checkedFriends = friendsRef.current.filter((el) => {
      if (el.lastChild.checked) return el;
    });
    try {
      const userId = JSON.parse(localStorage.getItem("user"));
      const id = idRef.current;
      const data = {
        id: id,
        parameter: checkedFriends[0].textContent,
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
        `http://10.144.0.1:5001/api/group/addrecipient`,
        options
      );
      if (request.ok === true) {
        console.log("Succesfully added recipient");
      }
    } catch (err) {
      console.error("Failed to add recipient", err);
    }
  }

  return (
    <main className="lobby-container">
      {loading ? <Loading></Loading> : null}
      <div className="group-option-box hide" ref={groupOptionRef}>
        <header className="close">
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
                      type="radio"
                      name="addFriend"
                      className="group-checkbox"
                    />
                  </li>
                );
              })
            : null}
        </ul>
        <button className="create-group-btn" onClick={addFriendToGroup}>
          Add Friend to Group
        </button>
      </div>
      {groups
        ? groups.map((el) => {
            return (
              <div className="group-cont" key={el.id} data-id={el.id}>
                <Link to={`/chat-room/${el.id}`}>
                  <div className="people-cont">
                    <img
                      src={
                        el.image
                          ? `data:image/png;base64,${el.image}`
                          : DefaultPic
                      }
                      alt="group-pic"
                    />
                    <div className="info">
                      <span className="name" onBlur={() => editTitle(el.id)}>
                        {el.title}
                      </span>
                      <span className="last-msg">
                        {el.lastMessageIsReferenceToFile
                          ? "file"
                          : el.lastMessageContent}
                      </span>
                      <span className="last-msg-time">
                        {el.lastMessageDate ? (
                          <TimeAgo date={+el.lastMessageDate}></TimeAgo>
                        ) : null}
                      </span>
                    </div>
                  </div>
                </Link>
                <button className="show-options-btn" onClick={showOptions}>
                  <FontAwesomeIcon icon={faChevronDown}></FontAwesomeIcon>
                </button>
                <ul className="group-option">
                  <li>
                    <button className="list-btn" onClick={allowRename}>
                      <span>Rename Group</span>
                    </button>
                  </li>
                  <li>
                    <button className="list-btn" onClick={selectFile}>
                      <span>Change Group Photo</span>
                    </button>
                    <input
                      type="file"
                      className="file"
                      id="attachment"
                      style={{ display: "none" }}
                      onChange={changeGroupPhoto}
                      ref={photoFileRef}
                      accept="image/*"
                    />
                  </li>
                  <li>
                    <button className="list-btn" onClick={openGroupOptions}>
                      <span>Add Friends to Group</span>
                    </button>
                  </li>
                  <li>
                    <button className="list-btn" onClick={leaveGroup}>
                      <span>Leave Group</span>
                    </button>
                  </li>
                </ul>
              </div>
            );
          })
        : null}
    </main>
  );
}

const mapStateToProps = createStructuredSelector({
  groups: selectGroups,
  friends: selectFriends,
});

const mapDispatchToProps = (dispatch) => ({
  setGroups: (group) => dispatch(setGroups(group)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
