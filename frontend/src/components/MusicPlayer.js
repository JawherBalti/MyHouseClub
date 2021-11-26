import React, { Component } from 'react'
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from '@material-ui/core'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import SkipNextIcon from '@material-ui/icons/SkipNext'

export default class MusicPlayer extends Component {

  canPause = () => {
    this.setState({
      guestCanPause: this.props.canPause
    })
    console.log(this.state.guestCanPause);
  }

  skipSong() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
    fetch('/spotify/skip', requestOptions)
  }

  pauseSong() {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    }
    fetch('/spotify/pause', requestOptions)
  }

  playSong() {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    }
    fetch('/spotify/play', requestOptions)
  }

  render() {
    const songProgress = (this.props.song.time / this.props.song.duration) * 100
    return (
      <Card className="player">
        <Grid container alignItems="center">
          <Grid item align="center" xs={4}>
            <img
              style={{
                borderRadius: '50%',
                border: '2px solid #000',
                marginTop: '5px',
              }}
              src={this.props.song.image_url}
              height="90%"
              width="90%"
            />
          </Grid>
          <Grid item align="center" xs={8}>
            <h5>{this.props.song.title}</h5>
            <Typography color="textSecondary" variant="subtitle1">
              {this.props.song.artist}
            </Typography>
            {this.props.host || this.props.canPause ? (
              <div>
                <IconButton
                  onClick={() => {
                    this.props.song.is_playing
                      ? this.pauseSong()
                      : this.playSong()
                  }}
                >
                  {this.props.song.is_playing ? (
                    <PauseIcon />
                  ) : (
                    <PlayArrowIcon />
                  )}
                </IconButton>
                <IconButton onClick={() => this.skipSong()}>
                  {this.props.song.votes} / {this.props.song.votes_required}
                  <SkipNextIcon />
                </IconButton>
              </div>
            ) : null }
          </Grid>
        </Grid>
        <LinearProgress variant="determinate" value={songProgress} />
      </Card>
    )
  }
}
