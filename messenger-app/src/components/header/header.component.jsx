import React, { useState } from "react";

import "./header.style.css";

import DefaultPic from "../../assets/img/default-profile.png";

import { Link, Redirect } from "react-router-dom";

// TODO implement these function (logout clears localStorage user, signin redirects to /sign-in)

function logoutFunc(setUser, setToSignIn, setRedirect) {
  setUser();
  localStorage.removeItem("user");
  setToSignIn(false);
  setRedirect(true);
}
function signInFunc(setToSignIn) {
  setToSignIn(true);
}

function Header({ user, setUser, setRedirect }) {
  const [toSignIn, setToSignIn] = useState(false);

  return (
    <nav className="header-box">
      <div className="logo">
        <Link to="/" className="header-anchor">
          <h1>Messagefy</h1>
        </Link>
      </div>
      <div className="profile-box">
        <img src={DefaultPic} alt="profile-pic" className="profile-pic" />
        <div className="hide user-box">
          {user ? (
            <button
              onClick={() => logoutFunc(setUser, setToSignIn, setRedirect)}
            >
              Logout
            </button>
          ) : (
            <button onClick={() => signInFunc(setToSignIn)}>Sign In</button>
          )}
        </div>
      </div>
      {toSignIn ? <Redirect to="/sign-in"></Redirect> : null}
    </nav>
  );
}

export default Header;
