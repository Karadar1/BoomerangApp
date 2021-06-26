import React, { useState } from 'react'

import axios from 'axios'

import { serverUrl } from '../utils/constants'
import { useHistory } from 'react-router-dom'

import '../styling/App.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  let history = useHistory()

  const renderInput = (isPassword = false) => {
    if (isPassword) {
      return (
        <input
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Input your password"
          type="password"
        />
      )
    }
    return (
      <input
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Input your email"
        type="text"
      />
    )
  }

  const loginUser = () => {
    if (email === '' || password === '')
      return setErrorMessage('un field e gol')

    setErrorMessage('')

    const userDataToBeSent = { email, password }

    axios
      .post(`${serverUrl}/user/signin`, userDataToBeSent)
      .then((response) => {
        if (response.data.error) {
          return setErrorMessage(response.data.message)
        }
        localStorage.setItem('token', response.data.token)
        return history.push('/')
      })
  }

  return (
    <div className='loginBox'>
      <p className="Label">Email</p>
      <div className="InputWrapper">{renderInput()}</div>
      <p className="Label">Password</p>
      <div className="InputWrapper">{renderInput(true)}</div>
      <br />
      <div className="LogButton Button" onClick={() => loginUser()}>
        login
      </div>
      <br />
      <p className="LabelSmall">
        Not a member?
        <a className="Link Account" href="/register">
          Register now
        </a>
      </p>
      <div className="ErrorMessage">{errorMessage ?? null}</div>
    </div>
  )
}
