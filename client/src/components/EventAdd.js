import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { serverUrl } from '../utils/constants'

export default function EventAdd({ user }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [timeStamp, setTimeStamp] = useState('')
  const [image, setImage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  let history = useHistory()

  const renderInput = (input_type) => {
    switch (input_type) {
      case 'title': {
        return (
          <input
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Set the title"
            type="text"
          />
        )
      }
      case 'description': {
        return (
          <input
            onChange={(event) => setDescription(event.target.value)}
            type="text"
            placeholder="Add a description"
          />
        )
      }
      case 'location': {
        return (
          <input
            onChange={(event) => setLocation(event.target.value)}
            type="text"
            placeholder="Add a location"
          />
        )
      }
      case 'date': {
        return (
          <input
            onChange={(event) => setDate(event.target.value)}
            type="date"
            placeholder="Add a date"
          />
        )
      }
      case 'time': {
        return (
          <input
            onChange={(event) => setTimeStamp(event.target.value)}
            type="time"
            placeholder="Add a time"
          />
        )
      }

      default: {
        return <input type="text" />
      }
    }
  }

  const addEvent = () => {
    const dataToBeSent = {
      title,
      description,
      timeStamp,
      location,
      date,
    }

    axios
      .post(`${serverUrl}/events/add`, dataToBeSent, {
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
      <p className="Label">Title</p>
      <div className="InputWrapper">{renderInput('title')}</div>
      <p className="Label">Description</p>
      <div className="InputWrapper">{renderInput('description')}</div>
      <p className="Label">Location</p>
      <div className="InputWrapper">{renderInput('location')}</div>
      <p className="Label">Date</p>
      <div className="InputWrapper">{renderInput('date')}</div>
      <p className="Label">Time</p>
      <div className="InputWrapper">{renderInput('time')}</div>
      <br />
      <div className="LogButton Button" onClick={() => addEvent()}>
        Add event
      </div>
      <br />
      {errorMessage ?? null}
    </div>
  )
}
