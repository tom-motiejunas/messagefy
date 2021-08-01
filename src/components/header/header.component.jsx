import React from "react";

import "./header.style.css";
import DefaultPic from "../../assets/img/default-profile.png";

import { Link, Redirect } from "react-router-dom";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from "../../redux/user/user.selector";
import { setCurrentUser } from "../../redux/user/user.action";

function logoutFunc(setCurrentUser) {
  setCurrentUser("");
  localStorage.removeItem("user");
}

function Header({ user, setCurrentUser }) {
  if (!user) return null;
  return (
    <nav className="header-box">
      <div className="logo">
        <Link to="/" className="header-anchor">
          <h1>Messagefy</h1>
        </Link>
      </div>
      <div className="profile-box">
        <span>{user.displayName}</span>
        <div>
          <img src={DefaultPic} alt="profile-pic" className="profile-pic" />
          <div className="hide user-box">
            {user ? (
              <button onClick={() => logoutFunc(setCurrentUser)}>Logout</button>
            ) : (
              <button>Sign In</button>
            )}
          </div>
        </div>
      </div>
      {!user ? <Redirect to="/sign-in"></Redirect> : null}
    </nav>
  );
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
