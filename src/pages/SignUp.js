import React, { useState, Component } from 'react'
import { TextField, Button } from '@material-ui/core'
// import QRCode from 'qrcode.react'
import { QRCode } from 'react-qr-svg'
import styles from './SignUp.module.css'

const SignUp = () => {
  const [signUpMode, setSignUpMode] = useState(true)
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState('')

  return (
    <>
      {signUpMode && (
        <SignUpForm
          setSignUpMode={setSignUpMode}
          setId={setId}
          setLoading={setLoading}
        />
      )}
      {console.log(signUpMode)}
      {console.log(signUpMode)}
      {!signUpMode && !loading && <QRCodeScreen id={id} includeMargin={true} />}
    </>
  )
}

const QRCodeScreen = props => {
  const downloadQR = () => {
    const canvas = document.getElementById('123456')
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream')
    let downloadLink = document.createElement('a')
    downloadLink.href = pngUrl
    downloadLink.download = '123456.png'
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  return (
    <div>
      <div>
        このQRコードを保存してください。ドリンクを注文する際に必要となります。
      </div>
      <div>
        Please save this QR code to your phone. You need this to get drinks.
      </div>
      <div>
        <QRCode
          value={props.id}
          id="123456"
          includeMargin={props.includeMargin}
        />
        <a onClick={downloadQR}> Download QR </a>
      </div>
    </div>
  )
}

const SignUpForm = props => {
  const { setSignUpMode, setId, setLoading } = props
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  const requestCreatingUser = () => {
    if (!validateField) {
      return
    }

    const requestBody = {
      query: `
            mutation SignUpAttendee($firstName: String!, $lastName: String!, $email: String!, $date: String!) {
                signUpAttendee(signUpAttendeeInput: {firstName: $firstName, lastName: $lastName, email: $email, date: $date}) {
                    _id
                    firstName
                    lastName
                }
            }
        `,
      variables: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        date: new Date().toISOString(),
      },
    }

    // set the loading to prevent loading QR code before receiving any data
    setLoading(true)
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
        const attendee = resData.data.signUpAttendee
        console.log('attendee', attendee)
        setId(attendee._id)
        setLoading(false)
        // to show the QR code
        setSignUpMode(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }

  const validateField = () => {
    if (firstName.trim() === '' || lastName.trim() === '') {
      return false
    }
    const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
    if (!emailValid) {
      return false
    }
    return true
  }

  const handleInputChange = event => {
    const name = event.target.name
    const value = event.target.value
    if (name === 'firstName') {
      setFirstName(value)
    } else if (name === 'lastName') {
      setLastName(value)
    } else if (name === 'email') {
      setEmail(value)
    }
  }

  return (
    <div className={styles.signUpForm}>
      <TextField
        required
        id="outlined-basic"
        name="firstName"
        value={firstName}
        onChange={handleInputChange}
        label="First Name"
      />
      <TextField
        required
        id="outlined-basic"
        name="lastName"
        value={lastName}
        onChange={handleInputChange}
        label="Last Name"
      />
      <TextField
        required
        id="outlined-basic"
        name="email"
        value={email}
        onChange={handleInputChange}
        label="Email address"
      />
      <Button variant="contained" color="primary" onClick={requestCreatingUser}>
        Sign Up
      </Button>
    </div>
  )
}
export default SignUp
