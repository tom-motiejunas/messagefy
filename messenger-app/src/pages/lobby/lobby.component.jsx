import React, { useState, useEffect, useRef } from "react";

import "./lobby.style.css";

import SideFunction from "../../components/side-functions/side-functions.component";
import AddFriend from "../../components/add-friend/add-friend.component";
import Messages from "../../components/messages/messages.component";
import FriendRequests from "../../components/friend-requests/friend-requests.component";
import Notification from "../../components/notification/notification.component";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from "../../redux/user/user.selector";
import { Redirect } from "react-router-dom";

import { HubConnectionBuilder } from "@microsoft/signalr";

function whatToRender(render) {
  switch (render) {
    case "Messages":
      return <Messages></Messages>;
    case "AddFriend":
      return <AddFriend></AddFriend>;
    case "FriendRequests":
      return <FriendRequests></FriendRequests>;
    default:
      return <Messages></Messages>;
  }
}

function Lobby({ user }) {
  const [render, setRender] = useState(null);
  const [connection, setConnection] = useState(false);
  const [notific, setNotific] = useState([]);

  const allNotific = useRef(null);

  allNotific.current = notific;

  useEffect(async () => {
    const userToken = JSON.parse(localStorage.getItem("user"));

    const newConnection = new HubConnectionBuilder()
      .withUrl("http://10.144.0.1:5001/message", {
        accessTokenFactory: () => {
          return userToken.token;
        },
      })
      .withAutomaticReconnect()
      .build();

    await setConnection(newConnection);
  }, []);

  useEffect(async () => {
    if (connection.connectionState === "Disconnected") {
      connection.start().then(() => {
        connection.on("ReceiveMessage", async (msg) => {
          const newNotification = {
            title: "New message",
            content: msg.content,
            sender: msg.senderName,
          };
          setNotific([...allNotific.current, newNotification]);
        });
      });
    }
  }, [connection]);

  return (
    <div className="lobby-box">
      {notific.length !== 0
        ? notific.map((el) => (
            <Notification
              notific={el}
              key={Math.round(Math.random() * 9999)}
            ></Notification>
          ))
        : null}
      {!user ? <Redirect to="/sign-in"></Redirect> : null}
      <SideFunction setRender={setRender}></SideFunction>

      {whatToRender(render)}
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
});

export default connect(mapStateToProps)(Lobby);
