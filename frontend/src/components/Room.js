import React, { Component } from 'react'
import { Grid, Button, Typography } from '@material-ui/core'
import CreateRoomPage from './CreateRoomPage'
import MusicPlayer from './MusicPlayer'

export default class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      showSettings: false,
      spotifyAuthenticated: false,
      song: {},
    }
    this.getRoomDetails()
  }

  componentDidMount() {
    this.interval = setInterval(this.getCurrentSong, 2000)
    this.interval2 = setInterval(this.getRoomDetails, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
    clearInterval(this.interval2)
  }

  getRoomDetails = () => {
    fetch('/api/get-room' + '?code=' + this.props.match.params.roomCode)
      .then((res) => {
        if (!res.ok) {
          fetch('/api/leave-room', requestOptions).then((res) => {
            this.props.history.push('/')
          })
        }
        return res.json()
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        })
        if (this.state.isHost) this.authenticateSpotify()
      })
  }

  leaveButtonPressed = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
    fetch('/api/leave-room', requestOptions).then((res) => {
      this.props.history.push('/')
    })
  }

  updateShowSettings = (value) => {
    this.setState({
      showSettings: value,
    })
  }

  authenticateSpotify() {
    fetch('/spotify/is-authenticated')
      .then((response) => response.json())
      .then((data) => {
        this.setState({ spotifyAuthenticated: data.status })
        console.log(data.status)
        if (!data.status) {
          fetch('/spotify/get-auth-url')
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url)
            })
        }
      })
  }

  getCurrentSong = () => {
    fetch('/spotify/current-song')
      .then((res) => {
        if (!res.ok) {
          return {}
        } else {
          return res.json()
        }
      })
      .then((data) => this.setState({ song: data }))
  }

  copyCode = () => {
    /* Get the text field */
    var copyText = document.getElementById("my-input").innerHTML
     /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText);
    /* Alert the copied text */
    alert("Copied the text: " + copyText);
  }

  render() {
    if (this.state.showSettings) {
      return (
        <Grid container spacing={1}>
          <Grid item xs={12} align="center">
            <CreateRoomPage
              update={true}
              votesToSkip={this.state.votesToSkip}
              guestCanPause={this.state.guestCanPause}
              roomCode={this.props.match.params.roomCode}
              updateCallback={this.getRoomDetails}
            />
          </Grid>
          <Grid
            style={{ marginTop: '31rem', marginLeft: '-0.2rem' }}
            item
            xs={12}
            align="center"
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={() => this.updateShowSettings(false)}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      )
    } else {
      return (
        <Grid className="center" container spacing={1}>
          <Grid item xs={12} align="center">
            <h4>Room Code: <span onClick={this.copyCode} className="room-code" id="my-input" >{this.props.match.params.roomCode}</span></h4>
            {this.state.isHost ? (
              <h5 className="notice">
                Go To <a href="https://www.spotify.com">Spotify.com</a> And
                Select Your Track
              </h5>
            ) : null}
            <h5 className="notice">
              A Premium Spotify Account Is Required To Be Able To Pause/Play or
              Skip Tracks
            </h5>
          </Grid>

          <Grid item xs={12} align="center">
            <MusicPlayer
              host={this.state.isHost}
              canPause={this.state.guestCanPause}
              song={this.state.song}
            />
          </Grid>

          {/* {this.state.isHost ? this.renderSettingsButton() : null} */}
          {this.state.isHost && (
            <Grid item xs={12} align="center">
              <Button
                variant="contained"
                color="primary"
                onClick={() => this.updateShowSettings(true)}
              >
                Settings
              </Button>
            </Grid>
          )}

          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={this.leaveButtonPressed}
            >
              Leave Room
            </Button>
          </Grid>
        </Grid>
      )
    }
  }
}
