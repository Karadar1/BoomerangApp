import { useState, useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import axios from 'axios'
import { serverUrl } from '../utils/constants'
import { useHistory } from 'react-router-dom'

export default function EventList({ user, search }) {
  const APILimit = isMobile ? 5 : 20

  const [eventList, setEventList] = useState([])
  const [offset, setOffset] = useState(0)
  const [limitReached, setLimitReached] = useState(false)

  const history = useHistory()

  useEffect(async () => {
    await getData()
  }, [])

  const getData = () => {
    return axios
      .get(`${serverUrl}/events/all/${APILimit}/${offset}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
      .then((response) => {
        const data = response.data
        if (data.error) {
          localStorage.clear('token')
          return history.push('/')
        }

        if (
          eventList.length >= data.eventsInDatabase ||
          data.data.length >= data.eventsInDatabase
        )
          setLimitReached(true)

        setOffset(offset + APILimit)
        setEventList(
          eventList.length ? [...eventList, ...data.data] : data.data
        )
      })
  }

  const eventSendInfo = (uid) => {
    return history.push(`/viewEvent/${uid}`)
  }

  const eventsDisplay = () => {
    const newEventList = Object.values(eventList).filter(
      (event) => event.title.toLowerCase().indexOf(search.toLowerCase()) !== -1
    )

    return newEventList.map((event, index) => {
      let newDescription = event.description
      if (event.description.length > 150) {
        newDescription = event.description.substr(0, 150) + ' ...'
      }
      return (
        <div key={event.uid} className="EventsContainer">
          <div className="Event">
            <div className="EventBar">
              <div className="EventTitle">{event.title}</div>
            </div>
            <div className="EventDescription">{newDescription}</div>
            <div
              onClick={() => eventSendInfo(event.uid)}
              class="Button ReadMoreBtn"
            >
              Read more
            </div>
            <div className="EventLocation">
              <a
                rel="noreferrer"
                target="_blank"
                href={`https://www.google.com/maps/search/${event.location}`}
              >
                <div>Location : {` ${event.location}`}</div>
              </a>
              <div className="eventDate">
                Participants : {event.participants.length}
              </div>
              <div className="eventStatus">
                Accepted: {event.accepted.toString()}
              </div>
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <>
      {eventsDisplay()}
      {limitReached ? null : (
        <div className="ButtonWrapper">
          <div className="Button LoadMoreBtn" onClick={() => getData()}>
            Load more
          </div>
        </div>
      )}
    </>
  )
}
