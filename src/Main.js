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
      time:"",
    };
  }

  getTime = () => {
    let time = new Date().toDateString() + " " + new Date().toLocaleTimeString();
    this.setState({time})
  }

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
   timer=setInterval(this.getTime, 1000);
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
    const { username, users, usersLiked, allMessage,time } = this.state;
    return (
      <div className="p-4">
        <div className="jumbotron">
          <h2>
            {" "}
            Welcome <span className="username">{username}</span>
          </h2>
          <p className="description">Send Messages and Likes below</p>
          <p className="timer">{time}</p>
          <button className="btn btn-primary float-right" onClick={this.signOut}>
            Sign Out
          </button>
        </div>
        <br />
        <div className="row main">
          <div className="col-md-2">
            <h5 className="marker">Other Users</h5>
            <ul className="list-unstyled usersList">
              {users.map((u, i) =>
                username !== u.username ? <User u={u} key={i}></User> : null
              )}
            </ul>
          </div>

          <div className="col-md-2">
            <h5 className="marker">Likes</h5>
            <ul className="list-unstyled usersLikeList">
              {usersLiked.map((u, i) =>
                username !== u.username ? (
                  <UserLike u={u} key={i}></UserLike>
                ) : null
              )}
            </ul>
          </div>

          <div className="col-md-7">
            <form onSubmit={this.onSubmitHandler}>
              <div className="input-group">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Type a message..."
                  onChange={this.onChangeHandler}
                  value={this.state.message}
                />
                <span className="input-group-btn">
                  <input
                    className="btn btn-primary"
                    type="submit"
                    value="Send"
                  />
                </span>
              </div>
            </form>
            <br />
            <div className="well chatbox" id="chat_history">
              <ul
                className="list-unstyled"
                style={{ overflowY: "scroll", height: "42vh" }}
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
