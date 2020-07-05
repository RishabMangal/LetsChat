import React, { Component } from 'react'
import money from './offline_chat.png';
class Header extends Component {
    render() {
        return (
            <div className="text-center bg-dark m-0 container-fluid mx-0">
                <h1 className="heading"><img className="money" src={money} alt="money"></img>Lets Chat</h1>
            </div>
        )
    }
}

export default Header
