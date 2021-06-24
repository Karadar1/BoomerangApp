import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { serverUrl } from '../utils/constants';
import axios from 'axios';
import _ from 'lodash';

export default function EventView({ user }) {
  let history = useHistory();
  const [uid, setUid] = useState('');
  const [event, setEvent] = useState({});
  const [rate, setRate] = useState(5);
  const [review, setReview] = useState('');

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

    if (uid !== '') {
      axios
        .get(`${serverUrl}/events/get/${uid}`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        .then((response) => {
          if (response.data.error) {
            return history.push('/');
          } else {
            return setEvent(response.data.data);
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
    if (event.participants.length === 0) return false;
    let newIsUserParticipating = event.participants.some(
      (eachParticipant) => eachParticipant.uid === user.uid
    );
    return newIsUserParticipating;
  };

  const canParticipate = () => {
    if (user.isBusiness) return false;
    return true;
  };

  const userAlreadyReviewd = () => {
    if (_.isEmpty(event)) return;
    return event.already_reviewed
      .filter((id) => user.uid === id)
      .includes(user.uid);
  };

  const canReview = () => {
    if (user.isBusiness || userAlreadyReviewd()) return false;
    return true;
  };

  const eventSendInfo = () => {
    history.push(`/editEvent/${uid}`);
  };

  const sendParticitipation = async () => {
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

  const sendReview = async () => {
    const reviewData = {
      rate,
      review,
      user,
      event_uid: event.uid,
    };
    await axios
      .post(`${serverUrl}/events/${uid}/reviews`, reviewData, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
      .then((response) => {
        if (response.data.error) {
          return window.alert(response.data.message);
        } else {
          setEvent(response.data.data);
        }
      });
  };

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
          {canParticipate() ? (
            alreadyParticipate() ? (
              <div
                className='RoundButton RoundButtonEvent'
                onClick={() => sendParticitipation()}
              >
                Cancel participation
              </div>
            ) : (
              <div
                className='RoundButton RoundButtonEvent'
                onClick={() => sendParticitipation()}
              >
                Participate
              </div>
            )
          ) : null}
        </>
      )}
      <div className='headings'>Important Info</div>
      <div className='EventLocation'>
        <a
          rel='noreferrer'
          target='_blank'
          href={`https://www.google.com/maps/search/${event.location}`}
        >
          <div>Location : {` ${event.location}`}</div>
        </a>
        <div className='eventDate'>Time: {event.timeStamp}</div>
        <div className='eventDate'>Date: {event.date}</div>

        {/* fix the score algorithm */}
        {/* {event.score !== 0 && (
          <div className='eventDate'>Score: {event.score}</div>
        )} */}
      </div>

      {/* Review Form */}
      {/* {canReview() && (
        <div className='reviewForm'>
          <div>
            <label htmlFor='rating' className='bold'>
              Rating:
            </label>
            <input
              onChange={(event) => {
                console.log(event.target.value);
                setRate(event.target.value);
              }}
              type='range'
              value={rate}
              min='1'
              max='5'
              range='rating'
            />
            <span>{rate}</span>
          </div>

          <div>
            <label htmlFor='body' className='bold'>
              Review:
            </label>
            <div className='InputWrapper'>
              <input
                onChange={(event) => setReview(event.target.value)}
                type='text'
                name='body'
                id=''
              />
            </div>
          </div>
          <div
            className='RoundButton RoundButtonEvent Right '
            onClick={() => sendReview()}
          >
            Submit
          </div>
        </div>
      )} */}
      {/* //Review Section */}

      {/* <div className='headings'>Review Section</div> */}
      {/* {!_.isEmpty(event) &&
        event.reviews.map((review) => (
          <div key={review.uid} className='reviewSection'>
            <div className='reviewDiv '>Review: {review.body}</div>
            <div className='reviewDiv'>Rating: {review.rating}</div>
            <div className='reviewDiv'>username: {review.from.username}</div>
            
            <br />
          </div>
        ))} */}
    </div>
  );
}
