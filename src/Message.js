import React from "react";

function Message({ m, currentUser }) {
  // const classname = m.from === currentUser ? "mymessage" : null;
  const messageBodyClassName =
    m.from === currentUser ? "mymessagebody" : "othermessagebody";
  return (
    <li className="message m-1 my-2">
      <div className="message-box mx-0">
        {m.from === currentUser ? null : (
          <span className="from-container">
            <div className="from-box">
              <i className="fas fa-comment px-1 mr-2"></i>
              <b>{m.from} </b>
            </div>
          </span>
        )}
        <span
          className={`message-container p-3 ${messageBodyClassName}`}
          style={{ width: "fit-content" }}
        >
          {m.message}
        </span>
      </div>
    </li>
  );
}

export default Message;
