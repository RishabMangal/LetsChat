import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import Join from "./Join";
import Main from "./Main";
import Header from "./Header";
function App() {
  return (
    <Router>
      <div className="App">
        <Header></Header>
        <Switch>
          <Route exact path="/" component={Join}></Route>
          <Route exact path="/main" component={Main}></Route>
          {/* <Join></Join> */}
          {/* <Main></Main> */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
