import React, { useEffect, useState } from "react";

import "./App.css";

import ChatRoom from "./pages/chat-room/chat-room.component";
import Header from "./components/header/header.component";
import Lobby from "./pages/lobby/lobby.component";
import SignIn from "./pages/sign-in/sign-in.component";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

function App() {
  const [user, setUser] = useState();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    } else {
      setRedirect(true);
    }
  }, [redirect]);

  // console.log(!(user === undefined));
  // console.log(user);
  return (
    <BrowserRouter>
      <Header user={user} setUser={setUser} setRedirect={setRedirect}></Header>
      <Switch>
        <Route exact path="/chat-room">
          <ChatRoom></ChatRoom>
        </Route>
        <Route exact path="/sign-in">
          <SignIn
            setUser={setUser}
            setRedirect={setRedirect}
            redirect={redirect}
          ></SignIn>
        </Route>
        <Route path="/">
          {!redirect ? <Lobby></Lobby> : <Redirect to="/sign-in" />}
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
