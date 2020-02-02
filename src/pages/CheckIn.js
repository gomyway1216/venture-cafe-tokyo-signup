import React, { useState, Component } from 'react'
import { TextField, Button } from '@material-ui/core/'
import { withStyles } from '@material-ui/core/styles'
import AuthContext from '../context/auth-context'
import Spinner from '../components/Spinner/Spinner'
import AttendeeList from '../components/Attendees/AttendeeList'
import styles from './checkIn.module.css'
var QRCode = require('qrcode.react')

const useStyles = theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
})

class FormPropsTextFields extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      isLoading: false,
      attendees: [],
    }
  }

  isActive = true

  static contextType = AuthContext

  onNameChange = event => {
    this.setState({ name: event.target.value })
  }

  onRegister = () => {
    const userId = this.state.name.concat(' id')
    const name = this.state.name
    const drinkCounter = 0
    const date = new Date().toISOString()

    console.log('userId', userId)
    console.log('name', name)
    console.log('drinkCounter', drinkCounter)
    console.log('date', date)

    if (name.trim() !== '') {
      const requestBody = {
        query: `
          mutation CheckInAttendee($userId: String!, $name: String!, $drinkCounter: Int!, $date: String!){
            checkInAttendee(attendeeInput: {userId: $userId, name: $name, drinkCounter: $drinkCounter, date: $date}) {
              userId
              name
              drinkCounter
            }
          }
        `,
        variables: {
          userId: userId,
          name: name,
          drinkCounter: drinkCounter,
          date: date,
        },
      }

      fetch(`${process.env.REACT_APP_URL}graphql`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('Failed!')
          }
          return res.json()
        })
        .then(resData => {
          this.setState(prevState => {
            const updatedAttendees = [...prevState.attendees]
            updatedAttendees.push({
              userId: resData.data.checkInAttendee.userId,
              name: resData.data.checkInAttendee.name,
              drinkCounter: resData.data.checkInAttendee.drinkCounter,
            })
            return { attendees: updatedAttendees }
          })
          this.setState({ name: '' })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  fetchAttendees() {
    this.setState({ isLoading: true })
    const requestBody = {
      query: `
            query {
                attendees {
                    userId
                    name
                    drinkCounter
                }
            }
          `,
    }

    fetch(`${process.env.REACT_APP_URL}graphql`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!')
        }
        return res.json()
      })
      .then(resData => {
        const attendees = resData.data.attendees
        if (this.isActive) {
          this.setState({ attendees: attendees, isLoading: false })
        }
      })
      .catch(err => {
        console.log(err)
        if (this.isActive) {
          this.setState({ isLoading: false })
        }
      })
  }

  componentDidMount() {
    this.fetchAttendees()
  }

  componentWillUnmount() {
    this.isActive = false
  }

  render() {
    const { classes } = this.props
    return (
      <div className={styles.attendeesContainer}>
        <div className={styles.addNewAttendee}>
          {/* <form
            noValidate
            autoComplete="off"
            className={styles.inputBoxContainer}
          > */}
          {/* <TextField
            required
            id="standard-required"
            label="Required"
            value={this.state.name}
            onChange={this.onNameChange}
            className={styles.inputBox}
          /> */}
          <input
            value={this.state.name}
            placeholder="Enter your name"
            onChange={this.onNameChange}
            className={styles.inputBox}
          />
          {/* </form> */}
          <Button variant="contained" color="primary" onClick={this.onRegister}>
            Register
          </Button>
        </div>

        <div>
          {this.state.isLoading ? (
            <Spinner />
          ) : (
            <AttendeeList attendees={this.state.attendees} />
          )}
        </div>
      </div>
    )
  }
}

export default withStyles(useStyles, { withTheme: true })(FormPropsTextFields)
