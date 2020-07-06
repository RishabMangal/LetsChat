import React, { Component } from "react";

var timer;
class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: "",
    };
  }

  getTime = () => {
    let time =
      new Date().toDateString() + " " + new Date().toLocaleTimeString();
    this.setState({ time });
  };
  componentDidMount() {
    timer = setInterval(this.getTime, 1000);
  }
  componentWillUnmount() {
    clearInterval(timer);
  }
  render() {
    return (
      <div>
        <p className="timer">
          {this.state.time}
          <i className="fas fa-hourglass-start mx-4 spinner"></i>
        </p>
      </div>
    );
  }
}

export default Timer;
