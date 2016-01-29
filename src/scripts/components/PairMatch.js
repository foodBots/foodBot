import React from 'react';
import ReactDOM from 'react-dom'
import Avatar from 'material-ui/lib/avatar';
import styles from 'material-ui/lib/styles';


const colors = styles.Colors;

export default class PairMatch extends React.Component {

  render() {
    return (
      <div>
        <Avatar
            color={colors.deepOrange300}
            backgroundColor={colors.purple500}>A
          </Avatar>

         <Avatar
            color={colors.blue300}
            backgroundColor={colors.indigo900}>B
          </Avatar>            
      </div>           
    )
  }
}
