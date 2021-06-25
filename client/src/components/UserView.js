import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { serverUrl } from '../utils/constants';
import axios from 'axios';
import _ from 'lodash';

export const UserView = () => {
  const history = useHistory();
  console.log(history);
  const [uid, setUid] = useState('');
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (history && history.location && history.location.pathname) {
      const uid = history.location.pathname.split('/')[2];
      if (uid !== '') {
        setUid(uid);
        axios
          .get(`${serverUrl}/user/get/${uid}`, {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          })
          .then((response) => {
            if (response.data.error) {
              return history.push('/');
            } else {
              return setUserData(response.data.data);
            }
          });
      } else {
        return history.push('/');
      }
    } else {
      return history.push('/');
    }
  }, [uid]);
  return <div>User</div>;
};
