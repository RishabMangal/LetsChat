import React from "react";

function UserLike({ u }) {
  return (
    <li>
      <span className="label btn-mini label-default userlabel">
        <i className="fa fa-thumbs-o-up mx-1"></i>
        {u.username}
      </span>
      <small className="text-primary">&nbsp; sent like</small>
    </li>
  );
}

export default UserLike;
