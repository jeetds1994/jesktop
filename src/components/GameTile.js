import React from 'react';
import {Grid, Segment} from 'semantic-ui-react'

const GameTile = (props) => {

  return(
    <div className="five wide column" >
    <div id={props.index}>
      <h3 onClick={props.showQuestion}>{props.display}</h3>
    </div>
    </div>
  )
}

export default GameTile;
