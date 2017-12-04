import React, { Component } from 'react';
import axios from 'axios';
import openSocket from 'socket.io-client';

import SelectedGifs from './Components/SelectedGifs';
import GifSearch from './Components/GifSearch';
import Spinner from './Components/Spinner';
import './App.css';

class App extends Component {
  state = {
    selectedGifs: [],
    gifCaptions: [],
    finishedGifUrl: "",
    gifError: false,
    showSearch: false,
    loading: false
  };

  addGif(gif) {

    const newSelectedGifs = this.state.selectedGifs.concat(gif);
    const newGifCaptions = this.state.gifCaptions.concat("");

    this.setState({ selectedGifs: newSelectedGifs, gifCaptions: newGifCaptions });
    this.setState({ showSearch: false });

  };

  removeGif(index) {
    var selectedGifs = this.state.selectedGifs.slice();
    var gifCaptions = this.state.gifCaptions.slice();

    selectedGifs.splice(index, 1);
    gifCaptions.splice(index, 1);

    this.setState({ selectedGifs, gifCaptions });
  }

  shiftGif(index, increment) {
    var newSelectedGifs = this.state.selectedGifs.slice();
    var newGifCaptions = this.state.gifCaptions.slice();

    if ((index + increment) < 0 || (index + increment) >= newSelectedGifs.length)
      return;

    newSelectedGifs.splice(index + increment, 0, newSelectedGifs.splice(index, 1)[0]);
    newGifCaptions.splice(index + increment, 0, newGifCaptions.splice(index, 1)[0]);

    this.setState({selectedGifs: newSelectedGifs, gifCaptions: newGifCaptions});
  }

  addCaption(index, text) {

    var newGifCaptions = this.state.gifCaptions.slice();
    newGifCaptions[index] = text;
    this.setState({ gifCaptions: newGifCaptions });
  }

  subscribeToSocket(msg, cb) {
    const socket = openSocket('http://seinfeld-gif-api.herokuapp.com');

    socket.emit('message', msg);
    socket.on('urlReturn', function(data) {
      cb(data);
      socket.disconnect();
    });
  }

  combineGifs() {
    this.setState({finishedGifUrl: "", loading: true, gifError: false}); //
    this.subscribeToSocket('React Subscribing', (data) => this.setState({finishedGifUrl: data, loading: false}));

    axios.post('http://seinfeld-gif-api.herokuapp.com/CreateScene', { images: this.state.selectedGifs, textArr: this.state.gifCaptions, gifError: false })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        //console.log(error);
        console.log('received error');
        this.setState({gifError: true, loading: false});
      });

  }

  renderFinishedResult() {
    if (this.state.gifError)
      return(
        <div style={{maxWidth: '600px', textAlign:'left'}}>
          <p>There appears to have been an error creating the gif.</p>
          <p>This could be due to:</p>
          <ol type="1">
            <li>An error with the imgur API.</li>
            <li>A Corrupt Gif</li>
            <li>Newman...</li>
          </ol>
        </div>
      )
    if (this.state.finishedGifUrl !== "")
    {
      if (this.state.finishedGifUrl.indexOf("imgur") !== -1)
        return(
          <div style={styles.finishedGifStyle}>
            <img src={this.state.finishedGifUrl} alt="Finished Gif"/>
          </div>
        )
      else {
        return(
          <div style={styles.finishedGifStyle}>
            <img src={this.state.finishedGifUrl} alt="Finished Gif Non-Imgur" />
            <p>The gifs you selected result in a final product > 10MB, which imgur will reject from uploading.</p>
            <p>Please right click and save the gif above, as it will be deleted from our servers at the end of the day.</p>
          </div>
        )
      }
    }
  }

  searchSwitch(searchBool) {
    this.setState({showSearch: searchBool})
  }

  renderSearch() {
    if (this.state.showSearch)
      return(
        <div style={styles.container}>
          <GifSearch
            onGifClick={this.addGif.bind(this)}
            searchModalToggle={this.searchSwitch.bind(this)}
          />
        </div>
      )
  }

  checkLoading() {
    if(this.state.loading)
    {
      return(
        <div>
          <Spinner style={{margin:10}}/>
          <div style={{margin:5}}>Creating Scene... this may take a few moments</div>
        </div>
      )
    }
    else
    {
      return(
          <SelectedGifs
            gifs={this.state.selectedGifs}
            captions={this.state.gifCaptions}
            addCaption={this.addCaption.bind(this)}
            onSelectedGifsSubmit={this.combineGifs.bind(this)}
            searchModalToggle={this.searchSwitch.bind(this)}
            removeGif={this.removeGif.bind(this)}
            shiftGif={this.shiftGif.bind(this)}
          />
      )
    }
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">sin(feldcreator)</h1>
          <h2 className="App-subtitle">A Tool to Create Seinfeld Scenes</h2>
          <h3 className="App-subtitle-subtitle">Inspired by RedditWritesSeinfeld</h3>
        </header>
        {this.renderFinishedResult()}
        <div style={styles.container}>
          {this.checkLoading()}
        </div>
        {this.renderSearch()}
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'inline-block',
    minWidth: '50%',
    margin: 10,
    padding: 10,
    borderStyle: "solid",
    borderWidth: "5px",
    borderRadius: '20px'
  },
  finishedGifStyle: {
    margin: 10
  }
}

export default App;
