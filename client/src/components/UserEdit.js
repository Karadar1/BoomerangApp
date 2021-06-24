import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../utils/constants'
import { useHistory } from 'react-router-dom'
import _ from 'lodash'

export default function UserEdit({ user }) {
  const [username, setUsername] = useState(user.username)
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState('')
  const [password_verify, setPasswordVerify] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  let history = useHistory()

  const renderInput = (input_type) => {
    switch (input_type) {
      case 'username': {
        return (
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Input your username"
            type="text"
          />
        )
      }
      case 'email': {
        return (
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Input your email"
            type="email"
          />
        )
      }

      case 'password': {
        return (
          <input
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Input your password"
            type="password"
          />
        )
      }
      case 'password_verify': {
        return (
          <input
            onChange={(event) => setPasswordVerify(event.target.value)}
            placeholder="Re-enter your password"
            type="password"
          />
        )
      }
      default: {
        return <input type="text" />
      }
    }
  }
  // useEffect(() => {
  //   if (!_.isEmpty(user)) {
  //     setEmail(user.email)
  //     setUsername(user.username)
  //   }
  // }, [user])

  const editUser = () => {
    if (password !== password_verify && password !== '') {
      return setErrorMessage('The passwords do not match!')
    }
    let dataToBeSent = {}
    if (password !== '') {
      dataToBeSent = {
        username,
        email,
        password,
        isBusiness: user.isBusiness,
      }
    } else
      dataToBeSent = {
        username,
        email,
        isBusiness: user.isBusiness,
      }

    axios
      .post(`${serverUrl}/user/edit`, dataToBeSent, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
      .then((response) => {
        if (response.data.error) {
          return setErrorMessage(response.data.message)
        } else {
          return history.push('/')
        }
      })
  }

  return (
    <div className="Form">
      <p className="Label">Username</p>
      <div className="InputWrapper">{renderInput('username')}</div>
      <p className="Label">Email</p>
      <div className="InputWrapper">{renderInput('email')}</div>
      <p className="Label">Password</p>
      <div className="InputWrapper">{renderInput('password')}</div>
      <div className="InputWrapper InputWrapperSpacer">
        {renderInput('password_verify')}
      </div>

      <br />
      <div className="LogButton Button" onClick={() => editUser()}>
        Save
      </div>
      <br />

      {errorMessage ?? null}
    </div>
  )
}
