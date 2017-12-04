import React, { Component } from 'react';
import axios from 'axios';

class GifSearch extends Component {
  state = {
    gifs: []
  };

  onSearchChange(e) {
    const value = e.target.value;

    if (value === "") {
      this.setState({
        gifs: []
      });
    } else {
      axios.get(`https://api.giphy.com/v1/gifs/search?q=seinfeld+${value}&api_key=M7SyDjrFEu2jstmVhofA6xC7rjZi5hn3`)
      .then((gifResponse) => {
        this.setState({ gifs: gifResponse.data.data})
      })
      .catch(err => {
        console.log(err);
      })
    }
  }

  render() {
    const { gifs } = this.state;

    const renderGifs = gifs.map((gif, id) => (
      <div
        key={id}
        onClick={() => this.props.onGifClick(gif)}
        style={{flex:1, flexBasis:'25%'}}
      >
        <img src={gif.images.fixed_width.url} alt="missing gif"/>
      </div>
    ));

    return(
      <div style={{ position:"relative"}}>
        <button
          style={{ border:"none", background: "black", color:"white", fontSize:"16px", position:"absolute", top:0, right:0}}
          onClick={() => this.props.searchModalToggle(false)}>
          X
        </button>
        <div>
          <input
            type="text"
            placeholder="Search Giphy gifs..."
            style={{marginTop:5, marginBottom:5, padding:5}}
            value={this.state.searchQuery}
            onChange={this.onSearchChange.bind(this)}
          />
        </div>
        <div style={{display:'flex', flexDirection:'row', flexWrap: 'wrap'}}>
          {renderGifs}
        </div>
      </div>
    )
  }
}

export default GifSearch;
