import React, { Component } from "react";
import io from "socket.io-client";
import User from "./User";
import UserLike from "./UserLike";
import Message from "./Message";
// const ENDPOINT = "http://localhost:8080/";
const ENDPOINT = "https://chat-server-socketio.herokuapp.com/";
var timer;
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      mynickname: "",
      allMessage: [{ from: "Chat Bot", message: "Welcome to Lets Chat" }],
      users: [],
      usersLiked: [],
      message: "",
      socket: "",
      time: "",
    };
  }

  getTime = () => {
    let time =
      new Date().toDateString() + " " + new Date().toLocaleTimeString();
    this.setState({ time });
  };

  componentDidMount() {
    var socket = io(ENDPOINT);
    this.setState({ socket, username: localStorage.getItem("username") });
    socket.on("all-users", (users) => {
      this.setState({ users, socket }, () =>
        console.log("users recieved", users)
      );
      //   this.setState(
      //     { users, username: this.props.location.state.username, socket },
      //     () => console.log("users recieved", users)
      //   );
    });
    socket.on("message-update", (allMessage) => {
      this.setState({ allMessage: allMessage });
    });
    timer = setInterval(this.getTime, 1000);
  }
  componentWillUnmount() {
    clearInterval(timer);
  }
  onChangeHandler = (e) => {
    this.setState({ message: e.target.value });
  };
  onSubmitHandler = (e) => {
    e.preventDefault();
    // alert(this.state.message);
    let obj = { from: this.state.username, message: this.state.message };
    this.state.socket.emit("send-message", obj);
    this.state.socket.on("message-update", (allMessage) => {
      this.setState({ allMessage: allMessage, message: "" });
    });
  };

  signOut = () => {
    this.state.socket.emit("sign-out", this.state.username);
    window.location = "/";
  };
  render() {
    const { username, users, usersLiked, allMessage, time } = this.state;
    const sendIcon = <i className="fas fa-paper-plane"></i>;
    return (
      <div className="p-4">
        <div className="jumbotron">
          <h2>
            {" "}
            Welcome <span className="username">{username}</span>
          </h2>
          <p className="description">Send Messages and Likes below</p>
          <p className="timer">
            {time}
            <i
              className="fas fa-hourglass-start mx-4 spinner"
            ></i>
          </p>
          <span>
            <button className="btn btn-danger sign-out" onClick={this.signOut}>
              Sign Out <i className="fas fa-sign-out-alt ml-2"></i>
            </button>
          </span>
        </div>
        <br />
        <div className="row main">
          <div className="col-md-2">
            <h5 className="marker">Other Users</h5>
            <ul className="list-unstyled usersList">
              {users.length > 1 ? (
                users.map((u, i) =>
                  username !== u.username ? <User u={u} key={i}></User> : null
                )
              ) : (
                <li className="lead text-center m-4">No Active Users</li>
              )}
            </ul>
          </div>

          <div className="col-md-2">
            <h5 className="marker">Likes</h5>
            <ul className="list-unstyled usersLikeList">
              {usersLiked.length ? (
                usersLiked.map((u, i) =>
                  username !== u.username ? (
                    <UserLike u={u} key={i}></UserLike>
                  ) : null
                )
              ) : (
                <li className="lead text-center m-4">
                  No Likes Recieved Yet..!
                </li>
              )}
            </ul>
          </div>

          <div className="col-md-7 chat-window">
            <form onSubmit={this.onSubmitHandler}>
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Type a message..."
                  onChange={this.onChangeHandler}
                  value={this.state.message}
                  required
                />
                <span className="input-group-btn">
                  <button
                    className="btn btn-primary"
                    type="submit"
                    // value={`Send`}
                  >
                    Send {sendIcon}
                  </button>
                </span>
              </div>
            </form>
            <br />
            <div className="chatbox" id="chat_history">
              <ul
                className="list-unstyled"
                style={{ overflowY: "scroll", height: "47vh" }}
              >
                {allMessage.map((m, i) => (
                  <Message m={m} key={i} currentUser={username}></Message>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
