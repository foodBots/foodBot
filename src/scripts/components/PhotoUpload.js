import React from 'react';
import ReactDOMServer from 'react-dom/server';
import $ from 'jquery';
import DropzoneComponent from 'react-dropzone-component';

const djsConfig = {
  previewTemplate: ReactDOMServer.renderToStaticMarkup(
    <div className="dz-preview dz-file-preview">
      <div className="dz-details">
        <img data-dz-thumbnail />
      </div>
      <div className="dz-progress"><span className="dz-upload" data-dz-uploadprogress></span></div>
      <div className="dz-error-message"><span data-dz-errormessage></span></div>
    </div>
  ),
  dictDefaultMessage: 'Upload Photo'
}

class PhotoUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: []
    };
    //change this to recipeId when integrated
    this.appendData = (file, xhr, formData) => {
      formData.append('recipeId', 1);
    };
    //change this to props.userId when integrated
    this.componentConfig = {
      showFiletypeIcon: false,
      postUrl: '/foodbot/photos/1',
    };
    this.djsConfig = {
      uploadMultiple: false
    };
    this.eventHandlers = {
      sending: this.appendData
    }

  }

  render() {
    return(
      <div >
        <DropzoneComponent
          config={this.componentConfig}
          djsConfig={djsConfig}
          eventHandlers={this.eventHandlers}
         />
      </div>
    )
  }
}

export default PhotoUpload;