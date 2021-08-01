import React, { useEffect } from "react";

import "./friend-requests.style.css";

import DefaultPic from "../../assets/img/default-profile.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectFriendRequests } from "../../redux/friend-request/friend-request.selector";
import { setFriendRequests } from "../../redux/friend-request/friend-request.action";

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
    console.error("failed to get friend requests", err);
  }
}

async function acceptFriendRequest(friendRequestId, setFriendRequests) {
  try {
    const userId = JSON.parse(localStorage.getItem("user"));
    console.log(userId.token);
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
    console.log(request);
    if (request.ok === true) {
      console.log("Succesfully accepted friend requests");
      updateFriendRequests(setFriendRequests);
    }
    const data = await request.json();
    console.log(data);
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

function FriendRequests({ friendRequests, setFriendRequests }) {
  useEffect(() => {
    updateFriendRequests(setFriendRequests);
  }, []);

  return (
    <section className="friend-request-box">
      <h2>All Your Friend Requests</h2>

      {friendRequests
        ? friendRequests.map((el) => {
            return (
              <div
                className="people-cont"
                style={{ cursor: "default" }}
                key={el.id}
              >
                <img src={el.result.image || DefaultPic} alt="profile-pic" />
                <div className="request-info">
                  <span className="name">{el.result.displayName}</span>
                  {el.result}
                  <button
                    className="green"
                    onClick={() =>
                      acceptFriendRequest(
                        el.result.requestId,
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
                        el.result.requestId,
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

const mapStateToProps = createStructuredSelector({
  friendRequests: selectFriendRequests,
});

const mapDispatchToProps = (dispatch) => ({
  setFriendRequests: (request) => dispatch(setFriendRequests(request)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FriendRequests);
