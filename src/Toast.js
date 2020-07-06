import React, { Component } from "react";

class Toast extends Component {
    render() {
        const { username } = this.props;
    return (
      <div>
        <div className="float-right bg-warning text-dark">{username} Disconnected</div>
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{position: "relative", minHeight: "200px"}}
        >
          <div className="toast" style={{position: "absolute" ,top: "0", right: "0"}}>
            <div className="toast-header">
              {/* <img src="..." class="rounded mr-2" alt="..." /> */}
              <strong className="mr-auto">Notification</strong>
              {/* <small>11 mins ago</small> */}
              <button
                type="button"
                className="ml-2 mb-1 close"
                data-dismiss="toast"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
                    <div className="toast-body"><b>{username}</b> Have Left the Chat.</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Toast;
