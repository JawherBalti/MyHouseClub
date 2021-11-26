import React, { Component } from 'react'
import { TextField, Button, Grid, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'

export default class RoomJoinPage extends Component {
  state = {
    roomCode: '',
    error: '',
  }

  handleTextFieldChange = (e) => {
    this.setState({
      roomCode: e.target.value,
    })
  }

  roomButtonPressed = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: this.state.roomCode,
      }),
    }
    fetch('/api/join-room', requestOptions)
      .then((response) => {
        if (response.ok) {
          this.props.history.push(`/room/${this.state.roomCode}`)
        } else {
          this.setState({ error: 'Room not found.' })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    return (
      <Grid className="center" container spacing={1}>
        <Grid item xs={12} align="center">
          <h4>
            Join a Room
          </h4>
        </Grid>
        <Grid item xs={12} align="center">
          <TextField
            required={true}
            error={this.state.error}
            label="Code"
            placeholder="Enter A Room Code"
            value={this.state.roomCode}
            helperText={this.state.error}
            variant="outlined"
            onChange={this.handleTextFieldChange}
            focused
            inputProps={{
              style: {
                color: '#fff',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="primary"
            onClick={this.roomButtonPressed}
          >
            Enter Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button variant="contained" color="secondary" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    )
  }
}
