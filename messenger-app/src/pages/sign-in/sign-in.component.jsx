import React, { useState } from "react";

import Logo from "../../assets/img/logo.svg";

import { Redirect } from "react-router-dom";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { setCurrentUser } from "../../redux/user/user.action";
import { selectCurrentUser } from "../../redux/user/user.selector";

import "./sign-in.style.css";
import Loading from "../../components/loading/loading.component";

async function handleSignIn(e, setCurrentUser, setLoading) {
  try {
    e.preventDefault();
    setLoading(true);
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
      "http://10.144.0.1:5001/api/account/login",
      options
    );
    const requestData = await request.json();
    if (request.ok === true) {
      setCurrentUser(JSON.stringify(requestData));
      localStorage.setItem("user", JSON.stringify(requestData));
    }
    setLoading(false);
  } catch (err) {
    console.error("failed to register", err);
  }
}
async function handleSignUp(e, setCurrentUser, setLoading) {
  try {
    e.preventDefault();
    setLoading(true);
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
      "http://10.144.0.1:5001/api/account/register",
      options
    );
    const requestData = await request.json();
    if (request.ok === true) {
      setCurrentUser(JSON.stringify(requestData));
      localStorage.setItem("user", JSON.stringify(requestData));
    }
    setLoading(false);
  } catch (err) {
    console.error("failed to register", err);
  }
}

function SignIn({ user, setCurrentUser }) {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      {loading ? <Loading></Loading> : null}
      <img src={Logo} alt="" className="logo-img" />
      <main className="form-container">
        {/* SIGN UP */}
        <form onSubmit={(e) => handleSignUp(e, setCurrentUser, setLoading)}>
          <h2>Sign Up</h2>
          <div>
            <label htmlFor="user-name">User Name</label>
            <input
              type="text"
              id="user-name"
              name="user-name"
              defaultValue=""
            />
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
        <form onSubmit={(e) => handleSignIn(e, setCurrentUser, setLoading)}>
          <h2>Sign In</h2>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="emailUp"
              placeholder="your@email.com"
              defaultValue={"ron@ron.com"}
            />
          </div>
          <div>
            <label htmlFor="pwd">Password:</label>
            <input
              type="password"
              id="pwdUp"
              name="pwd"
              defaultValue={"Pa$$w0rd"}
            />
          </div>
          <input type="submit" value="Submit" />
        </form>
        {user ? <Redirect exact to="/"></Redirect> : null}
      </main>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
