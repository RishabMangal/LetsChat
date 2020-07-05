import React from "react";

function Message({ m, currentUser }) {
  const classname= m.from === currentUser ? "mymessage" : null ;
  return (
    <li className={`message ${classname}`}>
      <i className="fa fa-comment"></i>
      &nbsp;
      <b>{m.from === currentUser ? "You" : m.from} </b>: &nbsp;
      {m.message}
    </li>
  );
}

export default Message;
