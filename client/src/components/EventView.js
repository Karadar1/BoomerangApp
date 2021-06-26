import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { serverUrl } from '../utils/constants';
import axios from 'axios';
import _ from 'lodash';
import participateIcon from '../assets/icons/support.svg';
import leaveIcon from '../assets/icons/logout.svg';

export default function EventView({ user }) {
  let history = useHistory();
  const [uid, setUid] = useState('');
  const [event, setEvent] = useState({});

  useEffect(() => {
    if (history && history.location && history.location.pathname) {
      const uid = history.location.pathname.split('/')[2];
      if (uid !== '') {
        setUid(uid);
      } else {
        return history.push('/');
      }
    } else {
      return history.push('/');
    }
  }, []);

  useEffect(async () => {
    if (uid !== '') {
      await axios
        .get(`${serverUrl}/events/get/${uid}`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        .then((response) => {
          if (response.data.error) {
            return history.push('/');
          } else {
            return setEvent(response.data.response);
          }
        });
    }
  }, [uid]);

  const hasAdminRights = () => {
    if (user.uid === event.authorUid) return true;
    return false;
  };

  const eventDelete = async () => {
    await axios
      .delete(`${serverUrl}/events/delete/${uid}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
      .then((response) => {
        if (response.data.error) {
          return window.alert(response.data.message);
        } else {
          return history.push('/');
        }
      });
  };
  //TODO complete logic
  const alreadyParticipate = () => {
    if (event?.participants.length === 0) return false;
    let newIsUserParticipating = event.participants.some(
      (eachParticipant) => eachParticipant.uid === user.uid
    );
    return newIsUserParticipating;
  };

  const canParticipate = () => {
    if (user.isBusiness) return false;
    return true;
  };
  console.log(event);
  const eventSendInfo = () => {
    history.push(`/editEvent/${uid}`);
  };
  const sendParticitipation = async (event) => {
    event.preventDefault();
    await axios
      .post(
        `${serverUrl}/events/participate/${uid}`,
        { participate: !alreadyParticipate() },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          return window.alert(response.data.message);
        } else {
          setEvent(response.data.data);
        }
      });
  };
  const viewUser = () => {
    history.push(`/viewUser/${event.authorUid}`);
  };
  if (uid === '' || _.isEmpty(event)) return false;
  return (
    <div className='Event EventView' id={event.uid} key={event.uid}>
      <div className='EventBar'>
        <div className='EventTitle'>{event.title}</div>
      </div>

      <div className='EventDescription'>{event.description}</div>
      {!_.isEmpty(event) && (
        <>
          {hasAdminRights() ? (
            <>
              <div
                className='ReadMoreBtn Button'
                onClick={() => eventSendInfo()}
              >
                Edit
              </div>
              <div className='ReadMoreBtn Button' onClick={() => eventDelete()}>
                Delete
              </div>
            </>
          ) : null}
        </>
      )}
      <div className='EventMidSection'>
        <div className='EventInfo'>
          <div className='eventDate' onClick={() => viewUser()}>
            Auhtor: {event.author}
          </div>
          <a
            rel='noreferrer'
            target='_blank'
            href={`https://www.google.com/maps/search/${event.location}`}
          >
            <div>Location : {` ${event.location}`}</div>
          </a>
          <div className='eventDate'>Time: {event.timeStamp}</div>
          <div className='eventDate'>Date: {event.date}</div>
        </div>

        {canParticipate() ? (
          alreadyParticipate() ? (
            <div onClick={sendParticitipation} className='iconDiv'>
              <img src={leaveIcon} alt='leave' className='participateIcon' />
              <h4>Leave</h4>
            </div>
          ) : (
            <div onClick={sendParticitipation} className='iconDiv'>
              <img
                src={participateIcon}
                alt='participate'
                className='participateIcon'
              />
              <h4>Join</h4>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
