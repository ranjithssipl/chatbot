import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import React,{Component} from 'react';
// import { CSSTransitionGroup } from 'react-transition-group'

// var ReactTransitionGroup = require('react-addons-transition-group');

// var ReactCSSTransitionGroup = React.ReactCSSTransitionGroup

var Modal = React.createClass({
    render: function() {
        if(this.props.isOpen){
            return (
              <ReactCSSTransitionGroup transitionName={this.props.transitionName}>
                <div className="modal">
                  {this.props.children}
                </div>
              </ReactCSSTransitionGroup>
            );
        } else {
            return <ReactCSSTransitionGroup transitionName={this.props.transitionName} />;
        }
    }
});
export default Modal