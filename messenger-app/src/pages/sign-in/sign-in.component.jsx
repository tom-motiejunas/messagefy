import React from "react";
import { Redirect } from "react-router-dom";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { setCurrentUser } from "../../redux/user/user.action";
import { selectCurrentUser } from "../../redux/user/user.selector";

import "./sign-in.style.css";

async function handleSignIn(e, setCurrentUser) {
  try {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    const data = {
      Email: email,
      Password: password,
    };

    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const request = await fetch(
      "http://25.79.95.4:5001/api/account/login",
      options
    );
    const requestData = await request.json();
    if (request.ok === true) {
      setCurrentUser(JSON.stringify(requestData));
      localStorage.setItem("user", JSON.stringify(requestData));
    }
  } catch (err) {
    console.error("failed to register", err);
  }
}
async function handleSignUp(e, setCurrentUser) {
  try {
    e.preventDefault();
    const userName = e.target[0].value;
    const displayName = e.target[1].value;
    const email = e.target[2].value;
    const password = e.target[3].value;

    const data = {
      DisplayName: displayName,
      Email: email,
      Password: password,
      UserName: userName,
    };

    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    const request = await fetch(
      "http://25.79.95.4:5001/api/account/register",
      options
    );
    const requestData = await request.json();
    if (request.ok === true) {
      setCurrentUser(JSON.stringify(requestData));
      localStorage.setItem("user", JSON.stringify(requestData));
    }
  } catch (err) {
    console.error("failed to register", err);
  }
}

function SignIn({ user, setCurrentUser }) {
  return (
    <main className="form-container">
      {/* SIGN UP */}
      <form onSubmit={(e) => handleSignUp(e, setCurrentUser)}>
        <h2>Sign Up</h2>
        <div>
          <label htmlFor="user-name">User Name</label>
          <input type="text" id="user-name" name="user-name" defaultValue="" />
        </div>
        <div>
          <label htmlFor="display-name">Display Name</label>
          <input
            type="text"
            id="display-name"
            name="display-name"
            defaultValue=""
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="emailIn"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label htmlFor="pwd">Password:</label>
          <input type="password" id="pwdIn" name="pwd" />
        </div>
        <input type="submit" value="Submit" />
      </form>
      {/* SIGN IN */}
      <form onSubmit={(e) => handleSignIn(e, setCurrentUser)}>
        <h2>Sign In</h2>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="emailUp"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label htmlFor="pwd">Password:</label>
          <input type="password" id="pwdUp" name="pwd" />
        </div>
        <input type="submit" value="Submit" />
      </form>
      {user ? <Redirect exact to="/"></Redirect> : null}
    </main>
  );
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
