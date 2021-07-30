import React, { useState } from "react";

import "./lobby.style.css";

import SideFunction from "../../components/side-functions/side-functions.component";
import AddFriend from "../../components/add-friend/add-friend.component";
import Messages from "../../components/messages/messages.component";
import FriendRequests from "../../components/friend-requests/friend-requests.component";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from "../../redux/user/user.selector";
import { Redirect } from "react-router-dom";

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

  return (
    <div className="lobby-box">
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
