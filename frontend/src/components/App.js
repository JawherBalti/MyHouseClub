import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import RoomJoinPage from './RoomJoinPage'
import CreateRoomPage from './CreateRoomPage'
import HomePage from './HomePage'
import Room from './Room'

export default class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/join" component={RoomJoinPage} />
        <Route exact path="/create" component={CreateRoomPage} />
        <Route exact path="/room/:roomCode" component={Room}/>
      </Switch>
    )
  }
}
