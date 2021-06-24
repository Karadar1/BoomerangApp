import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { serverUrl } from '../utils/constants'

export default function EventEdit({ user }) {
  const [uid, setUid] = useState('')
  const [event, setEvent] = useState({
    description: '',
    title: '',
  })
  const [eventTitle, setTitle] = useState('')
  const [eventDescription, setDescription] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  let history = useHistory()
  useEffect(async () => {
    if (history && history.location && history.location.pathname) {
      const uid = history.location.pathname.split('/')[2]
      if (uid !== '') {
        await setUid(uid)
      } else {
        return history.push('/')
      }
    } else {
      return history.push('/')
    }

    if (uid !== '') {
      await axios
        .get(`${serverUrl}/events/get/${uid}`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        .then((response) => {
          if (response.data.error) {
            return history.push('/')
          } else {
            console.log(response.data.data)
            return setEvent(response.data.data)
          }
        })
    }
  }, [uid])

  const renderInput = (input_type) => {
    switch (input_type) {
      case 'title': {
        return (
          <input
            defaultValue={event.title}
            onChange={(param) => setTitle(param.target.value)}
            placeholder="Input your username"
            type="text"
          />
        )
      }
      case 'description': {
        return (
          <input
            defaultValue={event.description}
            onChange={(param) => setDescription(param.target.value)}
            placeholder="Enter your text"
            type="text"
          />
        )
      }

      default: {
        return <input type="text" />
      }
    }
  }
  const editEvent = () => {
    const description = eventDescription
    const title = eventTitle
    const dataToBeSent = {
      description,
      title,
    }
    axios
      .post(`${serverUrl}/events/edit/${uid}`, dataToBeSent, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
      .then((response) => {
        console.log(response)
        if (response.data.error) {
          return setErrorMessage(response.data.message)
        } else {
          return history.push('/')
        }
      })
  }

  return (
    <div key={uid} className="Form">
      <p className="Label">Title</p>
      <div className="InputWrapper">{renderInput('title')}</div>
      <p className="Label">Description</p>
      <div className="InputWrapper">{renderInput('description')}</div>
      <div className="Button LogButton" onClick={() => editEvent()}>
        Save Changes
      </div>
    </div>
  )
}
