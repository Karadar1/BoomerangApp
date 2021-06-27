import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { serverUrl } from '../utils/constants';
import axios from 'axios';
import _ from 'lodash';




export const AdminDashboard = () => {

  const orgApprove = async (uid) => {
    await axios.get(`${serverUrl}/orgs/approve/${uid}`, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    })
    .then((response) =>{
      return response;
    })
  }
  
  const orgDeny = async (uid) => {
    await axios.delete(`${serverUrl}/orgs/deny/${uid}`, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    })
    .then((response) =>{
      return response;
    })
  }

  const [orgs, setOrgs] = useState([]);
  useEffect(async () => {
    await getData()
  }, [])
  const getData = () => {
    return axios
      .get(`${serverUrl}/orgs/get`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      })
      .then((response) => {
        const data = response.data.data
        return setOrgs(data);
      })
  }
  console.log(orgs);
  return orgs.map((event, index) => {
    return (
      <div key={event.uid} className="EventsContainer">
        <div className="Event">
          <div className="EventBar">
            <div className="EventTitle">{event.username}</div>
          </div>
          <div className='ReadMoreBtn Button' onClick={() => orgApprove(event.uid)}>
                  Approve
          </div>
          <div className='ReadMoreBtn Button' onClick={() => orgDeny(event.uid)}>
                  Deny
          </div>
          </div>
          </div>
    )
  })
};