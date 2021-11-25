import React, { Component } from 'react'
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";


export default class HomePage extends Component {
  
  state = {
    roomCode: null,
  }

  componentDidMount = async () => {
    fetch("/api/user-in-room")
      .then(res => res.json())
      .then(data => {
        this.setState({
          roomCode: data.code,
        })
      })
  }

  render() {
    if (this.state.roomCode)
    return ( <Redirect to={`/room/${this.state.roomCode}`} /> )
    else
    return (
      <Grid className="center" container spacing={3}>
        <Grid item xs={12} align="center">
          <h3>
            Welcome To The House Club
          </h3>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" to="/join" component={Link}>
              Join a Room
            </Button>
            <h6>OR</h6>
            <Button color="secondary" to="/create" component={Link}>
              Create a Room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    )
  }
}
