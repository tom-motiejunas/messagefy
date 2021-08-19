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
import { faTimes, faPen } from "@fortawesome/free-solid-svg-icons";

import TimeAgo from "react-timeago";

function Groups({ groups, setGroups }) {
  const [loading, setLoading] = useState(null);

  const groupTitleRef = useRef(null);

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
  }, []);

  function allowRename(e) {
    const nameNode =
      e.currentTarget.parentElement.childNodes[0].childNodes[0].childNodes[1]
        .childNodes[0];
    groupTitleRef.current = nameNode;
    nameNode.focus();
    nameNode.contentEditable = true;
  }

  async function editTitle(id) {
    try {
      const userId = JSON.parse(localStorage.getItem("user"));

      const data = {
        Id: id,
        title: "name",
      };
      console.log(data);
      const options = {
        method: "POST",
        mode: "cors",
        headers: {
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
  return (
    <main className="lobby-container">
      {loading ? <Loading></Loading> : null}
      {groups
        ? groups.map((el) => {
            return (
              <div className="group-cont" key={el.id}>
                <Link to={`/chat-room/${el.id}`}>
                  <div className="people-cont">
                    <img
                      src={
                        el.image
                          ? `data:image/png;base64,${el.image}`
                          : DefaultPic
                      }
                      alt="profile-pic"
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
                <button className="rename-group" onClick={allowRename}>
                  <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                </button>
                <button
                  className="ban-group"
                  // onClick={() => deleteGroup(el.result.userName)}
                >
                  <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
                </button>
              </div>
            );
          })
        : null}
    </main>
  );
}

const mapStateToProps = createStructuredSelector({
  groups: selectGroups,
});

const mapDispatchToProps = (dispatch) => ({
  setGroups: (group) => dispatch(setGroups(group)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
