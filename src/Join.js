import React, { Component } from "react";
import io from "socket.io-client"

// const ENDPOINT = "http://localhost:8080/";
const ENDPOINT = "https://chat-server-socketio.herokuapp.com/";
class Join extends Component {
    constructor(props) {
        super(props);
        this.state = {
          username: ""
    };
  }

  onChangeHandler = (e) => {
      this.setState({ [e.target.name]: e.target.value }, () => {});
    };
    onSubmitHandler = (e) => {
        e.preventDefault();
        var socket = io(ENDPOINT);
        socket.emit("join-chat", {
            username: this.state.username
        });
        // socket.on("is-user-exists",(flag)=>{this.setState({flag:flag},()=>console.log("recieved flag is: ",flag))})
      // if (!this.state.flag) {
        // console.log("flag os ", this.state.flag);
          this.props.history.push(
            {pathname:"/main",state:this.state}
        );
        localStorage.setItem("username", this.state.username);
        // }
    };
    
    render() {
        const { username } = this.state;
    return (
      <div>
        <div className="row marketing">
          <div className="col-md-2"></div>  
          <div className="col-md-8">
            <div className="panel panel-default panel-primary">
              <div className="panel-heading">
                <h3 className="panel-title">Join Chat</h3>
              </div>
              <form
                className="panel-body ng-pristine ng-valid"
                onSubmit={this.onSubmitHandler}
              >
                <label>Username</label>
                <input
                  className="input-lg form-control ng-pristine ng-valid"
                  maxLength="20"
                  type="text"
                  name="username"
                  onChange={this.onChangeHandler}
                  value={username}
                  placeholder="Choose any username..."
                />
                <br />
                <input
                  className="btn btn-block btn-primary"
                  type="submit"
                  value="Join"
                />
              </form>
            </div>
          </div>

          <div className="col-md-2"></div>
        </div>
      </div>
    );
  }
}

export default Join;
