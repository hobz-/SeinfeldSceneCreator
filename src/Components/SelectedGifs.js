import React, { Component } from 'react';
import FaPlusCircle from 'react-icons/lib/fa/plus-circle';

class SelectedGifs extends Component {

  onCaptionChange(id, e) {
    this.props.addCaption(id, e.target.value);
  }

  renderGifs() {
    const { gifs, captions } = this.props;

    return gifs.map((gif, id) => (
      <div key={id} style={styles.cardItemStyle}>
          <div style={{display:'flex', margin: 5}}>
            <button style={styles.buttonStyle} onClick={() => this.props.shiftGif(id, -1)}>{'<'}</button>
            <button style={styles.buttonStyle} onClick={() => this.props.shiftGif(id, 1)}>{'>'}</button>
            <button style={styles.buttonStyle} onClick={() => this.props.removeGif(id)}>{'X'}</button>
          </div>
          <div style={{display:'flex', margin: 5}}>
            <img src={gif.images.fixed_width.url} alt={gif.slug} />
          </div>
          <div style={{display:'flex', margin: 5}}>
            <input
              type="text"
              placeholder="Add a Caption to this Gif"
              value={captions[id]}
              onChange={this.onCaptionChange.bind(this, id)}
            />
          </div>
      </div>
    ));
  }

  renderButton() {
    const { gifs } = this.props;

    if (gifs.length > 0)
    {
      return(
        <button style={styles.buttonStyle} onClick={() => this.props.onSelectedGifsSubmit()}>
          CREATE SCENE
        </button>
      )
    }
  }

  render() {
    return (
      <div style={{display:'flex', flexDirection:'column'}}>
        <div>
          Add Gifs to Create a Scene
        </div>
        <div style={styles.cardStyle}>
          {this.renderGifs()}
          <div style={styles.cardItemStyle}>
            <FaPlusCircle
              style={{flex:1, height: '100%', minHeight: "inherit"}}
              size={100}
              onClick={() => this.props.searchModalToggle(true)}/>
          </div>
        </div>
        <div>
          {this.renderButton()}
        </div>
      </div>
    )
  }
}

const styles = {
  buttonStyle: {
    margin: 5,
    backgroundColor: '#e7e7e7',
    border: 'none',
    color: 'black',
    padding: '15px 32px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px'
  },
  cardStyle: {
    display:'flex',
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center',
    flexWrap: 'wrap'
  },
  cardItemStyle: {
    display: 'flex',
    flexBasis:'20%',
    borderStyle: 'solid',
    borderRadius: '20px',
    margin: 10,
    padding: 5,
    minHeight: '250px',
    minWidth: '250px',
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default SelectedGifs;
