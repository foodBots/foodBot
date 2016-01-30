import React from 'react';
import ReactDOM from 'react-dom'
import Avatar from 'material-ui/lib/avatar';
import styles from 'material-ui/lib/styles';


const colors = styles.Colors;


//Eventually we want some kind of avatar or prfile pic here
export default class PairMatch extends React.Component {

  render() {
    var name = this.props.username
    return (
      <div>
        <Avatar
            color={colors.deepOrange300}
            backgroundColor={colors.purple500}>{name[0]}
          </Avatar>         
      </div>           
    )
  }
}
