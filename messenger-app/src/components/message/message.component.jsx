import React from "react";

import "./message.style.css";

function Message({ msgType }) {
  return (
    <div className={`msg ${msgType}-msg`}>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores quae ab
        accusantium iusto voluptate suscipit obcaecati exercitationem adipisci
        laborum laboriosam.
      </p>
    </div>
  );
}

export default Message;
