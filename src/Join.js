import React, { Component } from "react";
class Join extends Component {
  render() {
    const { username, changeHandler, joinHandler, error } = this.props;
    const errClassname = error ? "is-invalid" : null;
    return (
      <div className="join-div">
        <div className="row marketing">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <div className="panel panel-default panel-primary">
              <div className="panel-heading">
                <h3 className="panel-title">Join Chat</h3>
              </div>
              <form className="panel-body" onSubmit={joinHandler}>
                <div className="input-group">
                  <label>Username</label>
                  {error ? (
                    <div className="bg-light text-danger row mx-0">
                      <span
                        className="input-group-text p-2 px-3 bg-danger text-light"
                        style={{
                          fontSize: "17px",
                          border: "2px solid red",
                          borderTopRightRadius: "10px",
                          borderTopLeftRadius: "10px",
                        }}
                      >
                        <i className="fas fa-warning" aria-hidden="true"></i>
                      </span>
                      <div className="col">{error}</div>
                    </div>
                  ) : null}
                  <div className="input-group-prepend">
                    <span
                      className="input-group-text"
                      style={{ fontSize: "25px " }}
                    >
                      @
                    </span>
                    <input
                      className={`input-lg form-control ${errClassname}`}
                      maxLength="20"
                      type="text"
                      name="username"
                      onChange={changeHandler}
                      value={username || ""}
                      placeholder="Choose any username..."
                      required
                    />
                  </div>
                </div>
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
