import React, { useEffect } from "react";

import "./messages.style.css";

import DefaultPic from "../../assets/img/default-profile.png";

import { Link } from "react-router-dom";
import TimeAgo from "react-timeago";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectFriends } from "../../redux/friends/friend.selector";
import { setFriends } from "../../redux/friends/friend.action";

async function updateFriendList(setFriends) {
  try {
    const userId = JSON.parse(localStorage.getItem("user"));
    if (!userId) return;
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
      setFriends(data);
    }
  } catch (err) {
    console.error("failed to get all friends", err);
  }
}

function Messages({ friends, setFriends }) {
  useEffect(() => {
    updateFriendList(setFriends);
    console.log(friends);
  }, []);

  return (
    <main className="lobby-container">
      {friends
        ? friends.map((el) => {
            console.log(el);
            return (
              <Link to={`/chat-room/${el.result.userName}`} key={el.id}>
                <div className="people-cont">
                  <img src={el.result.image || DefaultPic} alt="profile-pic" />
                  <div className="info">
                    <span className="name">{el.result.displayName}</span>
                    <span className="last-msg">
                      {el.result.lastMessageContent}
                    </span>
                    <span className="last-msg-time">
                      <TimeAgo date={+el.result.lastMessageDate}></TimeAgo>
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

const mapStateToProps = createStructuredSelector({
  friends: selectFriends,
});

const mapDispatchToProps = (dispatch) => ({
  setFriends: (friend) => dispatch(setFriends(friend)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
