import {lookupProfile} from 'blockstack';
import axios from 'axios';

export function loadInitial(props) {
  // console.log("publicDoc helper - loadInitial props: ", props)
  this.setState({
    userToLoadFrom: props.substr(0, props.indexOf('-')),
    idToLoad: props.split('-')[1]
  })
  setTimeout(this.fetchData, 300);
}

export function fetchData() {
  lookupProfile(this.state.userToLoadFrom, "https://core.blockstack.org/v1/names")
  .then((profile) => {
    console.log('publicDoc helper - fetchData - profile.apps: ', profile.apps['http://localhost:3000']);
    // if(process.env.NODE_ENV !== 'production') {
    //   this.setState({url: profile.apps['http://localhost:3000']});
    // } else {
    //   this.setState({url: profile.apps['https://app.graphitedocs.com']});
    //   // this.setState({ url: profile.apps['https://serene-hamilton-56e88e.netlify.com']})
    // }
    this.setState({ url: profile.apps[window.location.origin]})
    setTimeout(this.loadDoc, 300);
  })
  .catch((error) => {
    console.log('could not resolve profile')
  })
}

export function loadDoc() { //loadDoc is called from fetchData, above, which is called by loadInitial, above that...
  console.error('publicDoc helper - loadDoc called...')
  axios.get(this.state.url + 'public/' + this.state.idToLoad + '.json') //NOTE: this probably gets the object created by sharePublicly in SingleDoc...
  .then((response) => {
    console.log("publicDoc helper - loadDoc response: ", response);
    console.log("publicDoc helper - Object.keys(response.data).length < 1: ", Object.keys(response.data).length < 1);
    var responseHeaders = response.headers // response.headers: {last-modified: "Sat, 30 Jun 2018 21:07:31 GMT", content-type: "text/plain", cache-control: "public, max-age=1"}
    var lastUpdated = responseHeaders[Object.keys(responseHeaders)[0]]; //this is the value of last-modified
    console.log('publicDoc helper - lastUpdated is: ', lastUpdated)
    if(Object.keys(response.data).length > 0) {
      this.setState({
        content: response.data.content,
        docLoaded: true,
        lastUpdated: lastUpdated,
        singleDocIsPublic: response.data.singleDocIsPublic,
        title: response.data.title,
        readOnly: response.data.readOnly,
        words: response.data.words,
      })
    } else {
      this.setState({
        singleDocIsPublic: false,
      })
      console.error("publicDoc helper - nothing shared")
    }
  })
  .catch((error) => {
    console.log('error:', error);
  });
}

//this function is for TextEdit...
export function handlePubChange(event) { //calling this on change in textarea...
  console.log('PublicDoc -->> handleChange called, event is: ', event)
  var updateString = event.target.value
  console.log('typeof updateString: ', typeof updateString)
  this.setState({
    content: updateString
  });
}

export function handlePubTitleChange(e) {
  this.setState({
    title: e.target.value
  });
}
