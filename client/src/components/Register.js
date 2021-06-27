import React, { useState } from 'react';

import axios from 'axios';
import { interestsArray } from '../utils/constants';

import { serverUrl } from '../utils/constants';
import { useHistory } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_verify, setPasswordVerify] = useState('');
  const [isBusiness, setBusiness] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [interests, setInterests] = useState(['']);
  let history = useHistory();

  const handleInterests = (event) => {
    const index = interests.indexOf(event.target.name);
    console.log(index);
    if (index === -1) {
      setInterests((prev) => [...prev, event.target.name]);
    } else {
      let newInterests = [...interests];
      newInterests.splice(index, 1);
      setInterests(newInterests);
    }
  };

  const renderIntersts = () =>
    interestsArray.map((interest) => (
      <>
        <input
          type='checkbox'
          onChange={handleInterests}
          checked={interests.includes(interest.value)}
          name={interest.value}
        />
        <>{interest.label}</>
      </>
    ));

  // for (let interest of interestsArray) {
  //   return (
  // <>
  //   <input
  //     type='checkbox'
  //     checked={interests.includes(interest.value)}
  //     id={interest.value}
  //   />
  //   <>{interest.label}</>
  // </>
  //   );
  // }

  const renderInput = (input_type) => {
    switch (input_type) {
      case 'username': {
        return (
          <input
            onChange={(event) => setUsername(event.target.value)}
            placeholder='Input your username'
            type='text'
          />
        );
      }
      case 'email': {
        return (
          <input
            onChange={(event) => setEmail(event.target.value)}
            placeholder='Input your email'
            type='email'
          />
        );
      }
      case 'isBusiness': {
        return (
          <input
            onChange={(event) => setBusiness(event.target.checked)}
            type='checkbox'
          />
        );
      }
      case 'password': {
        return (
          <input
            onChange={(event) => setPassword(event.target.value)}
            placeholder='Input your password'
            type='password'
          />
        );
      }
      case 'password_verify': {
        return (
          <input
            onChange={(event) => setPasswordVerify(event.target.value)}
            placeholder='Re-enter your password'
            type='password'
          />
        );
      }

      default: {
        return <input type='text' />;
      }
    }
  };

  const signupUser = () => {
    if (password !== password_verify) {
      return setErrorMessage('The passwords do not match!');
    }
    setErrorMessage('');

    const userDataToBeSent = {
      username,
      email,
      password,
      isBusiness,
      interests,
    };

    axios
      .post(`${serverUrl}/user/signup`, userDataToBeSent)
      .then((response) => {
        if (response.data.error) {
          return setErrorMessage(response.data.message);
        }
        localStorage.setItem('token', response.data.token);
        return history.push('/');
      });
  };

  return (
    <div>
      <p className='Label'>Username</p>
      <div className='InputWrapper'>{renderInput('username')}</div>
      <p className='Label'>Email</p>
      <div className='InputWrapper'>{renderInput('email')}</div>
      <p className='Label'>Password</p>
      <div className='InputWrapper'>{renderInput('password')}</div>
      <div className='InputWrapper InputWrapperSpacer'>
        {renderInput('password_verify')}
      </div>
      <p className='Label'>Interests</p>
      <div className='InputWrapper'>{renderIntersts()}</div>
      <br />
      <div className='InputWrapper Label'>
        <p className='Label'>User Type</p>
        {renderInput('isBusiness')} Organization account
      </div>

      <br />
      <div className='LogButton Button' onClick={() => signupUser()}>
        Register
      </div>
      <br />
      <p className='LabelSmall'>
        Have an account?
        <a className='Link Account' href='/login'>
          Login now
        </a>
      </p>

      <div className='ErrorMessage'>{errorMessage ?? null}</div>
    </div>
  );
}
