import React from 'react';

class Spinner extends React.Component {
  constructor(props){
    super(props);
    this.styles = {

    }
  }
  render() {
    return (
      <div className="profile-container">
        <img src="/spinner.gif" />
      </div>
    )
  }
}

export default Spinner;
