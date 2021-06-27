import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { serverUrl } from '../utils/constants';

export default function EventForm({ callback }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [timeStamp, setTimeStamp] = useState('');
  const [image, setImage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  let history = useHistory();

  const renderInput = (input_type) => {
    switch (input_type) {
      case 'title': {
        return (
          <input
            onChange={(event) => setTitle(event.target.value)}
            placeholder='Set the title'
            type='text'
          />
        );
      }
      case 'description': {
        return (
          <input
            onChange={(event) => setDescription(event.target.value)}
            type='text'
            placeholder='Add a description'
          />
        );
      }
      case 'location': {
        return (
          <input
            onChange={(event) => setLocation(event.target.value)}
            type='text'
            placeholder='Add a location'
          />
        );
      }
      case 'date': {
        return (
          <input
            onChange={(event) => setDate(event.target.value)}
            type='date'
            placeholder='Add a date'
          />
        );
      }
      case 'time': {
        return (
          <input
            onChange={(event) => setTimeStamp(event.target.value)}
            type='time'
            placeholder='Add a time'
          />
        );
      }

      default: {
        return <input type='text' />;
      }
    }
  };

  return (
    <div>
      <p>Title</p>
      <div>{renderInput('title')}</div>
      <p>Description</p>
      <div>{renderInput('description')}</div>
      <p>Location</p>
      <div>{renderInput('location')}</div>
      <p>Date</p>
      <div>{renderInput('date')}</div>
      <p>Time</p>
      <div>{renderInput('time')}</div>
      <br />
      <div className="addButton"
        onClick={() =>
          callback({
            title,
            description,
            timeStamp,
            location,
            date,
          })
        }
      >
        Add event
      </div>
      <br />
      {errorMessage ?? null}
    </div>
  );
}
