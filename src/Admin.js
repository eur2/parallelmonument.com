import React from 'react';
import FirebaseAuth from 'react-firebaseui/FirebaseAuth';
import Firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import './firebase.js';

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      developers: [],
      modalOpen: false
    };
  }

  componentDidMount() {
    this.getUserData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state.developers) {
      this.writeUserData();
    }
  }

  writeUserData = () => {
    Firebase.database()
      .ref('/developers')
      .set(this.state.developers);
    //console.log("DATA SAVED");
  };

  getUserData = () => {
    let ref = Firebase.database().ref('/');
    ref.on('value', snapshot => {
      const state = snapshot.val();
      this.setState(state);
      //console.log(state);
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    let lat = parseFloat(this.refs.lat.value);
    let lng = parseFloat(this.refs.lng.value);
    let name = this.refs.name.value;
    let email = this.refs.email.value;
    let title = this.refs.title.value;
    let role = this.refs.role.value;
    let subscribe = this.refs.subscribe.value;
    let uid = this.refs.uid.value;

    if (uid && name && email && title && role && subscribe && lat && lng) {
      const { developers } = this.state;
      const devIndex = developers.findIndex(data => {
        return data.uid === uid;
      });
      developers[devIndex].lat = lat;
      developers[devIndex].lng = lng;
      developers[devIndex].name = name;
      developers[devIndex].email = email;
      developers[devIndex].title = title;
      developers[devIndex].role = role;
      developers[devIndex].subscribe = subscribe;
      this.setState({ developers });
    } else if (lat && lng && name && email && title && role && subscribe) {
      const uid = new Date().getTime().toString();
      const { developers } = this.state;
      developers.push({ lat, lng, uid, name, email, title, role, subscribe });
      this.setState({ developers });
    }

    this.refs.lat.value = '';
    this.refs.lng.value = '';
    this.refs.name.value = '';
    this.refs.email.value = '';
    this.refs.title.value = '';
    this.refs.role.value = '';
    this.refs.subscribe.value = '';
    this.refs.uid.value = '';
    this.setState({
      modalOpen: false
    });
  };

  removeData = developer => {
    window.confirm('Are you sure?');
    const { developers } = this.state;
    const newState = developers.filter(data => {
      return data.uid !== developer.uid;
    });
    this.setState({ developers: newState });
  };

  updateData = developer => {
    this.setState({
      modalOpen: true
    });
    this.refs.uid.value = developer.uid;
    this.refs.name.value = developer.name;
    this.refs.email.value = developer.email;
    this.refs.role.value = developer.role;
    this.refs.subscribe.value = developer.subscribe;
    this.refs.lat.value = developer.lat;
    this.refs.lng.value = developer.lng;
    this.refs.title.value = developer.title;
  };
  onCloseForm = event => {
    event.stopPropagation();
    this.setState({ modalOpen: false });
  };
  onNewForm = event => {
    event.stopPropagation();
    this.setState({ modalOpen: true });
  };

  render() {
    const { developers, modalOpen } = this.state;
    return (
      <div className="admin">
        <div className="card-body">
          <p className="center">
            <button onClick={this.onNewForm} className="btn border">
              Create
            </button>
          </p>
        </div>
        <div className="row">
          {developers.map(developer => (
            <div key={developer.uid} className="card-body">
              <p className="center">
                <span className="bborder">{developer.lat}</span>
                <span className="bborder">{developer.lng}</span>
              </p>
              <p>{developer.name}</p>
              <p>
                <a href={`mailto:${developer.email}`}>{developer.email}</a>
              </p>
              <p>
                Subscribe:
                {developer.subscribe}
              </p>
              <p className="card-text" style={{ textAlign: 'center' }}>
                {developer.title}
              </p>
              <p className="card-text">{developer.role}</p>
              <p className="center">
                <button
                  onClick={() => this.removeData(developer)}
                  className="btn border"
                >
                  Delete
                </button>
                <button
                  onClick={() => this.updateData(developer)}
                  className="btn border"
                >
                  Edit
                </button>
              </p>
            </div>
          ))}
        </div>
        <div>
          <form
            onSubmit={this.handleSubmit}
            className="form border"
            style={{ display: modalOpen ? 'flex' : 'none' }}
          >
            <div>
              <button onClick={this.onCloseForm} className="close">
                ×
              </button>
            </div>
            <div className="form-row">
              <div>
                <label>Latitude</label>
                <input type="text" ref="lat" placeholder="0" />
              </div>
              <div>
                <label>Longitude</label>
                <input type="text" ref="lng" placeholder="0" />
              </div>
            </div>
            <div className="form-row">
              <input type="hidden" ref="uid" />
              <div>
                <label>Qui</label>
                <input type="text" ref="name" placeholder="Votre nom" />
              </div>
              <div>
                <label>Email</label>
                <input type="email" ref="email" placeholder="Votre email" />
              </div>
              <div>
                <label>Quand</label>
                <input type="text" ref="title" placeholder="JJ/MM/AAAA" />
              </div>
              <div>
                <label>Quoi</label>
                <textarea type="text" ref="role" placeholder="Votre texte" />
              </div>
            </div>
            <div>
              <button type="submit" className="close">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default class SignInScreen extends React.Component {
  // The component's Local state.
  state = {
    isSignedIn: false // Local signed-in state.
  };

  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [Firebase.auth.EmailAuthProvider.PROVIDER_ID],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false
    }
  };

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.unregisterAuthObserver = Firebase.auth().onAuthStateChanged(user =>
      this.setState({ isSignedIn: !!user })
    );
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    if (!this.state.isSignedIn) {
      return (
        <div className="signin">
          <FirebaseAuth
            uiConfig={this.uiConfig}
            firebaseAuth={Firebase.auth()}
          />
        </div>
      );
    }
    return (
      <div>
        <h1>Parallel Monument</h1>
        <div className="card-body">
          <p className="center">
            <button
              className="btn border"
              onClick={() => Firebase.auth().signOut()}
            >
              Sign-out
            </button>
          </p>
        </div>
        <Admin />
      </div>
    );
  }
}
