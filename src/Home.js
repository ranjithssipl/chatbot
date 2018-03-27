import React, { Component } from 'react';
import home from './images/home.jpg'
import App from './App'
import Close from './images/close_icon.png'

var message;
class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showComponent: false,
        };
    }

    componentWillMount() {

    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {

        return (
            <div ><button class="btn btn-default dropdown-toggle"  type="button" id="menu1" data-toggle="dropdown">
            <img src={Close} />
            </button>
                <App message={(document.getElementById("root_value")) ? document.getElementById("root_value").value : undefined} user={(document.getElementById("root_user")) ? document.getElementById("root_user").value : undefined} />,
            </div>
        );
    }

}

export default Home;
