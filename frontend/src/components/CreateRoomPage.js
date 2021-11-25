import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  Collapse,
  Grid,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormHelperText,
  TextField,
} from '@material-ui/core'

export default class CreateRoomPage extends Component {
  static defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallback: () => {},
  }

  state = {
    guestCanPause: this.props.guestCanPause,
    votesToSkip: this.props.votesToSkip,
    error: '',
    success: '',
  }

  handleVotesChange = (e) => {
    this.setState({
      votesToSkip: e.target.value,
    })
  }

  handleGuestCanPauseChange = (e) => {
    this.setState({
      guestCanPause: e.target.value === 'true' ? true : false,
    })
  }

  handleRoomButtonPressed = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
      }),
    }
    fetch('/api/create-room/', requestOptions)
      .then((res) => res.json())
      .then((data) => this.props.history.push('/room/' + data.code))
  }

  handleUpdateButtonPressed = () => {
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
        code: this.props.roomCode,
      }),
    }

    fetch('/api/update-room', requestOptions).then((res) => {
      if (res.ok) {
        this.setState({
          success: 'Updated Successfully!',
        })
      } else {
        this.setState({
          error: 'Could Not Update!',
        })
      }
      this.props.updateCallback()
    })
  }

  render() {
    const title = this.props.update ? 'Update Room' : 'Create A Room'
    return (
      <Grid className="center" container spacing={1}>
        <Grid item xs={12} align="center">
          <Collapse in={this.state.error != "" || this.state.success != ""}>
            {this.state.success != '' ? this.state.success : this.state.error}
          </Collapse>
        </Grid>
        <Grid item xs={12} align="center">
          <h4>
            {title}
          </h4>
        </Grid>

        <Grid item xs={12} align="center">
          <FormControl component="fieldset">
            <FormHelperText component="div">
              <div align="center">Guest Control of Playback State</div>
            </FormHelperText>
            <RadioGroup
              row
              defaultValue={this.props.guestCanPause.toString()}
              onChange={this.handleGuestCanPauseChange}
            >
              <FormControlLabel
                value="true"
                control={<Radio color="primary" />}
                label="Play/Pause"
                labelPlacement="bottom"
              />
              <FormControlLabel
                value="false"
                control={<Radio color="secondary" />}
                label="No Control"
                labelPlacement="bottom"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              onChange={this.handleVotesChange}
              required={true}
              type="number"
              defaultValue={this.state.votesToSkip}
              inputProps={{ min: 1, style: { textAlign: 'center' } }}
            />
            <FormHelperText component="div">
              <div align="center">Votes Required To Skip Song</div>
            </FormHelperText>
          </FormControl>
        </Grid>

        {this.props.update ? (
          <>
            <Grid item xs={12} align="center">
              <Button
                color="primary"
                variant="contained"
                onClick={this.handleUpdateButtonPressed}
              >
                Update
              </Button>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} align="center">
              <Button
                color="secondary"
                variant="contained"
                onClick={this.handleRoomButtonPressed}
              >
                Create A Room
              </Button>
            </Grid>

            <Grid item xs={12} align="center">
              <Button
                color="primary"
                variant="contained"
                to="/"
                component={Link}
              >
                Back
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    )
  }
}
