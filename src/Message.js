import React from "react";

function Message({ m, currentUser }) {
  const classname= m.from === currentUser ? "mymessage" : null ;
  return (
    <li className="message">
    <div className="message-box row mx-0">
        <span className={`from-container`}> 
        <span className={`from-box   ${classname}`}>
          <i className="fas fa-comment"></i>      
          &nbsp;
            <b>{m.from === currentUser ? "You" : m.from} </b>
        </span>
        </span>
        <span className={`message-container col ${classname}`}>{m.message}</span>
    </div>
    </li>
  );
}

export default Message;
