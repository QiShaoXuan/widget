import React from 'react'
import DraggableCircle from "./index";

class DraggableContent extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return (
      <div className="">this is draggable content</div>
    )
  }
}


class Container extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  render() {
    return (
      <div className="">
        <DraggableCircle><DraggableContent/></DraggableCircle>
      </div>
    )
  }
}

export default Container
