import React, { Component } from 'react';
import {
  isSignInPending,
  redirectToSignIn,
  handlePendingSignIn,
  signUserOut,
  isUserSignedIn,
  loadUserData
} from 'blockstack';
import Signin from './Signin';
import Header from './Header';

export default class Invites extends Component {

  componentWillMount() {
    if (isSignInPending()) {
      handlePendingSignIn().then((userData) => {
        window.location = window.location.origin;
      });
    }
  }

  componentDidMount() {
    isUserSignedIn() ? this.props.loadInvite() : loadUserData();
  }

  handleSignIn(e) {
    e.preventDefault();
    const origin = window.location.origin
    redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data'])
  }

  handleSignOut(e) {
    e.preventDefault();
    signUserOut(window.location.origin);
  }

  render() {
    return (
      <div>
        { !isUserSignedIn() ?
          <Signin handleSignIn={ this.handleSignIn } />
          :
          <div>
            <Header />
            <div className="container payment-wrapper">
              <div className="center-align">
                <h3>You have been invited to join a Graphite Pro team.</h3>
                <p>Learn more about Graphite Pro here.</p>
                <p>Click below to accept the invite. You will have access to all the free features, but until the person who invited you confirms the invite acceptance, you will not be able to access the Pro features.</p>
                <p>Read more about Graphite Pro's{/*'*/} security <a>here</a>.</p>
                <button onClick={this.props.acceptInvite} className="btn black">Accept Invite</button>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}
