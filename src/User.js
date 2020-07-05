import React from "react";

function User({u}) {
  return (
    <li className="user">
      <span className="">
        <i className="fa fa-user mx-3"></i>
        {u.username}
      </span>
      <a href="#test">
        <i className="fa fa-thumbs-up float-right"></i>
      </a>
    </li>
  );
}

export default User;
