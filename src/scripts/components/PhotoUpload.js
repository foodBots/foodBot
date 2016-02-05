import React from 'react';
import $ from 'jquery';
import Dropzone from 'react-dropzone';


class PhotoUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [1,2,3,4]
    }
  }

  onDrop(photos) {
    this.setState({
      photos: photos
    }, function() {
      console.log('Received photos: ', this.state.photos);
      this.forceUpdate();
    });

  }

  render() {
    return(
      <div >
        <Dropzone ref="dropzone" onDrop={this.onDrop.bind(this)}>
          <div>Try dropping some photos here, or click to select photos to upload.</div>
        </Dropzone>
        <div>
        <h2>Uploading {this.state.photos.length} photos...</h2>
        <div>{this.state.photos.map((file) => {
          <img src={file.preview} />
          console.log('file is ', file);
        })}</div>
        </div>
      </div>
    )
  }
}

export default PhotoUpload;