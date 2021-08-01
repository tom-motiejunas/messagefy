import React from "react";

import "./side-function.style.css";

function addActive(element) {
  //Removes all active class from all buttons
  const allBtns = document.querySelectorAll(".side-box button");
  allBtns.forEach((el) => {
    el.classList.remove("active");
  });

  // Adds active to the buttons which was pressed
  element.classList.add("active");
}

function SideFunction({ setRender }) {
  return (
    <aside className="side-box">
      <button
        className="active"
        onClick={(e) => {
          addActive(e.target);
          return setRender("Messages");
        }}
      >
        Messages
      </button>
      <button
        onClick={(e) => {
          addActive(e.target);
          return setRender("AddFriend");
        }}
      >
        Add Friend
      </button>
      <button
        onClick={(e) => {
          addActive(e.target);
          return setRender("FriendRequests");
        }}
      >
        Friend Requests
      </button>
    </aside>
  );
}

export default SideFunction;
