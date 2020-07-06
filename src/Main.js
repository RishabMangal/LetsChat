import React, { Component } from "react";
import io from "socket.io-client";
import User from "./User";
import UserLike from "./UserLike";
import Message from "./Message";
import Timer from "./Timer";
import Join from "./Join";
// import Toast from "./Toast";
var socket;
const ENDPOINT = "http://localhost:8080/";
// const ENDPOINT = "https://chat-server-socketio.herokuapp.com/";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      allMessage: [],
      users: [],
      usersLiked: [],
      message: "",
      joined: false,
      flag: false,
      error: "",
      leftUser: "",
    };
  }

  componentDidMount() {
    this.setState({ username: localStorage.getItem("username") }, () => {
      // console.log("username recieved:", this.state.username);
      if (this.state.username) {
        socket = io(ENDPOINT);
        socket.emit("join-chat", {
          username: this.state.username,
        });
        this.setState({ joined: true }, () => {
          // console.log("Yay ! Chat joined Successfully");
          socket.on("all-users", (users) => {
            this.setState(
              { users },
              () => {}
              // console.log("users recieved", users)
            );
          });
          socket.on("message-update", (allMessage) => {
            this.setState({ allMessage: allMessage, message: "" });
          });
        });
      }
    });
  }
  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: "" }, () => {});
  };

  joinHandler = (e) => {
    e.preventDefault();
    if (!this.state.error) {
      socket = io(ENDPOINT);
      socket.emit("join-chat", {
        username: this.state.username,
      });
      socket.on("is-user-exists", (flag) => {
        // console.log("is user exists: ", flag);
        if (!flag) {
          this.setState({ joined: true }, () => {
            localStorage.setItem("username", this.state.username);
            // console.log("Yay ! Chat joined Successfully");
            socket.on("all-users", (users) => {
              this.setState(
                { users },
                () => {}
                // console.log("users recieved", users)
              );
            });
            socket.on("message-update", (allMessage) => {
              this.setState({ allMessage: allMessage, message: "" });
            });
          });
        } else {
          this.setState(
            {
              error: (
                <p className="small pt-1">
                  User already logged in...!
                  <br /> Please try different <b>username</b>.
                </p>
              ),
            },
            () => {}
          );
        }
      });
      // socket.on("user-disconnected", (username) => {
      //   this.setState({ leftUser: username }, () => {
      //     console.log("User disconnected", username);
      //   });
      // });
    }
  };

  onSubmitHandler = (e) => {
    e.preventDefault();
    let obj = { from: this.state.username, message: this.state.message };
    socket.emit("send-message", obj);
    socket.on("message-recieved", (obj) => {
      this.state.allMessage.push(obj);
    });
  };

  signOut = () => {
    socket.emit("sign-out", this.state.username);
    // socket.on("user-disconnected", (username) => {
    //   this.setState({ leftUser: username }, () => {
    //     console.log("User disconnected", username);
    //   });
    // });
    localStorage.clear();
    this.setState({ username: "", joined: false });
  };
  render() {
    const {
      username,
      users,
      usersLiked,
      allMessage,
      joined,
      error,
      // leftUser,
    } = this.state;
    const sendIcon = <i className="fas fa-paper-plane"></i>;
    return (
      <div className="main-div">
        {!joined && (
          <Join
            changeHandler={this.onChangeHandler}
            username={username}
            joinHandler={this.joinHandler}
            error={error}
          ></Join>
        )}
        {joined && (
          <div className="p-2">
            {/* <Toast username={leftUser}></Toast> */}
            <div className="jumbotron">
              <h2>
                {" "}
                Welcome <span className="username">{username}</span>
              </h2>
              <p className="description">Send Messages and Likes below</p>
              <Timer></Timer>
              <span>
                <button
                  className="btn btn-danger sign-out"
                  onClick={this.signOut}
                >
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
                      username !== u.username ? (
                        <User u={u} key={i}></User>
                      ) : null
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
                  ):
                  //  : leftUser ? (
                  //   <li className="text-danger text-center m-4">
                  //     {leftUser} Disconnected..!
                  //   </li>
                      // ) : 
                      (
                    <li className="lead text-center m-4">
                      No Likes Recieved Yet..!
                    </li>
                  )}
                </ul>
              </div>

              <div className="col-md-8 chat-window">
                <form onSubmit={this.onSubmitHandler}>
                  <div className="input-group">
                    <input
                      className="form-control"
                      type="text"
                      name="message"
                      placeholder="Type a message..."
                      onChange={this.onChangeHandler}
                      value={this.state.message}
                      required
                    />
                    <span className="input-group-btn">
                      <button className="btn btn-primary" type="submit">
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
              {/* <div className="col-md-1"></div> */}
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default Main;
