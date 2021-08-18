import React, { useRef } from "react";

import "./option.style.css";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectCurrentUser } from "../../redux/user/user.selector";
import { setCurrentUser } from "../../redux/user/user.action";

async function setUserProfile(imgFile, user, setCurrentUser) {
  try {
    const userId = JSON.parse(localStorage.getItem("user"));
    const formData = new FormData();

    formData.append("file", imgFile);

    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${userId.token}`,
      },
      body: formData,
    };
    delete options.headers["Content-Type"];
    const request = await fetch(
      `http://10.144.0.1:5001/api/file/sendprofile/`,
      options
    );
    if (request.ok === true) {
      console.log("Succesfully changed profile pic");

      // Making file to base64
      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });

      const base64Data = await toBase64(imgFile);

      const newUser = JSON.parse(user);
      newUser.image = base64Data;

      setCurrentUser(JSON.stringify(newUser));
      localStorage.setItem("user", JSON.stringify(newUser));
    }
  } catch (err) {
    console.error("Failed to change profile pic", err);
  }
}

function Options({ user, setCurrentUser }) {
  const inputImage = useRef(null);

  function changeAvatar() {
    const imgFile = inputImage.current.files[0];
    setUserProfile(imgFile, user, setCurrentUser);
  }

  return (
    <section className="option-box">
      <div className="profile-photo">
        <h3>Change profile picture</h3>
        <input
          type="file"
          name="input-photo"
          id="input-photo"
          accept="image/*"
          onChange={changeAvatar}
          ref={inputImage}
          hidden
        />
        <label htmlFor="input-photo" className="label-photo">
          Change Avatar
        </label>
      </div>
    </section>
  );
}

const mapStateToProps = createStructuredSelector({ user: selectCurrentUser });

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Options);
