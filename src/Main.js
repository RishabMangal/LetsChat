import React, { Component } from "react";
import io from "socket.io-client";
import User from "./User";
import UserLike from "./UserLike";
import Message from "./Message";
import Timer from "./Timer";
import Join from "./Join";
import Loader from "react-loader-spinner";
import url from "./assets/sounds/clearly.mp3";
import url_2 from "./assets/sounds/piece.mp3";

// import Toast from "./Toast";
var socket;
// const ENDPOINT = "http://localhost:8080/";
const ENDPOINT = "https://chat-server-socketio.herokuapp.com/";

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
      loading: false,
      typingUsers: [],
      audio: new Audio(url),
      audioR: new Audio(url_2),
    };
  }

  componentDidMount() {
    // this.myRef.current.scrollTop = this.myRef.current.scrollHeight;
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
          socket.on("who-is-typing", (u) => {
            // this.state.typingUsers.push(u);
            this.setState({ typingUsers: u });
          });
          socket.on("message-update", (allMessage) => {
            this.setState({ allMessage: allMessage }, () => {
              if (
                allMessage[allMessage.length - 1].from !== this.state.username
              ) {
                this.state.audioR.play();
              }
            });
          });
        });
      }
    });
  }
  onChangeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: "" }, () => {});
    if (e.target.name === "message") {
      socket.emit("typing", this.state.username);
      socket.on("who-is-typing", (u) => {
        // this.state.typingUsers.push(u);
        this.setState({ typingUsers: u });
      });
    }
  };

  joinHandler = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    if (!this.state.error) {
      socket = io(ENDPOINT);
      socket.emit("join-chat", {
        username: this.state.username,
      });
      socket.on("is-user-exists", (flag) => {
        // console.log("is user exists: ", flag);
        if (!flag) {
          this.setState({ joined: true, loading: false }, () => {
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
              this.setState({ allMessage: allMessage });
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
    this.state.audio.play();
    let obj = { from: this.state.username, message: this.state.message };
    this.setState({ message: "" });
    socket.on("who-is-typing", (u) => {
      // this.state.typingUsers.push(u);
      this.setState({ typingUsers: u });
    });
    socket.emit("done-typing", this.state.username);
    socket.emit("send-message", obj);
    socket.on("message-recieved", (obj) => {
      this.state.allMessage.push(obj);
    });
    socket.on("typing-update", (set) => this.setState({ typingUsers: set }));
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
      loading,
      typingUsers,
      // leftUser,
    } = this.state;
    const blur = loading ? "blur" : null;
    const sendIcon = <i className="fas fa-paper-plane"></i>;
    return (
      <div className="main-div">
        {loading && (
          <div className="loader-container">
            <div className="loader">
              <Loader
                height={100}
                width={100}
                type="Circles"
                color="lightblue"
              ></Loader>
              <p className="loader-title">Joining Chat...</p>
            </div>
          </div>
        )}
        {!joined && (
          <div className={`${blur}`}>
            <Join
              changeHandler={this.onChangeHandler}
              username={username}
              joinHandler={this.joinHandler}
              error={error}
            ></Join>
          </div>
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

              <div className="col-md-8 chat-window">
                {/* <br /> */}
                <div className="chatbox" id="chat_history">
                  <ul
                    className="list-unstyled"
                    style={{ overflowY: "scroll", height: "47vh" }}
                  >
                    {typingUsers.length
                      ? typingUsers.map((u, i) => (
                          <Message
                            currentUser="Rishab"
                            key={i}
                            m={{ from: u, message: "Typing..." }}
                          ></Message>
                        ))
                      : null}
                    {allMessage.map((m, i) => (
                      <Message m={m} key={i} currentUser={username}></Message>
                    ))}
                  </ul>
                </div>
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
                    //  : leftUser ? (
                    //   <li className="text-danger text-center m-4">
                    //     {leftUser} Disconnected..!
                    //   </li>
                    // ) :
                    <li className="lead text-center m-4">
                      No Likes Recieved Yet..!
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default Main;
