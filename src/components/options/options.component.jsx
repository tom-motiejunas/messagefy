import React, { useRef } from "react";

import "./option.style.css";

async function setUserProfile(imgFile) {
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
    }
  } catch (err) {
    console.error("Failed to change profile pic", err);
  }
}

function Options(e) {
  const inputImage = useRef(null);

  function changeAvatar() {
    const imgFile = inputImage.current.files[0];
    // if (!imgFile) return;
    // const reader = new FileReader();
    // reader.onload = function () {
    // };
    // reader.readAsBinaryString(imgFile);
    setUserProfile(imgFile);
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

export default Options;
