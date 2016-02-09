import React from 'react';
import ReactDOMServer from 'react-dom/server';
import $ from 'jquery';
import DropzoneComponent from 'react-dropzone-component';

const djsConfig = {
  previewTemplate: ReactDOMServer.renderToStaticMarkup(
    <div className="dz-preview dz-file-preview">
      <div className="dz-details">
      </div>
      <div className="dz-progress"><span className="dz-upload" data-dz-uploadprogress></span></div>
      <div className="dz-error-message"><span data-dz-errormessage></span></div>
    </div>
  ),
  dictDefaultMessage: ''
}

class PhotoUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: []
    };
    //change this to recipeId when integrated
    this.appendData = (file, xhr, formData) => {
      formData.append('recipeId', this.props.recipeid);
    };
    //change this to props.userId when integrated
    this.componentConfig = {
      showFiletypeIcon: false,
      postUrl: '/foodbot/photos/' + this.props.userid,
    };
    this.djsConfig = {
      uploadMultiple: false
    };
    this.eventHandlers = {
      sending: this.appendData,
      success: this.props.increaseUploadCount
    }

  }

  //this component is not rendered on screen, file upload is trigged via camera icon
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