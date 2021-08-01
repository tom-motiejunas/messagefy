import React, { useEffect, useState } from "react";

import "./App.css";

import ChatRoom from "./pages/chat-room/chat-room.component";
import Header from "./components/header/header.component";
import Lobby from "./pages/lobby/lobby.component";
import SignIn from "./pages/sign-in/sign-in.component";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from "./redux/user/user.selector";
import { setCurrentUser } from "./redux/user/user.action";

import { BrowserRouter, Route, Switch } from "react-router-dom";

function App({ setCurrentUser }) {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setCurrentUser(foundUser);
    } else {
      setRedirect(true);
    }
  }, []);

  return (
    <BrowserRouter>
      {/* This needs setUser */}
      <Header></Header>
      <Switch>
        <Route path="/chat-room">
          <ChatRoom></ChatRoom>
        </Route>
        <Route exact path="/sign-in">
          {/* This needs setUser */}
          <SignIn></SignIn>
        </Route>
        <Route path="/">
          <Lobby></Lobby>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
