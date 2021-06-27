import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { serverUrl } from '../utils/constants';
import axios from 'axios';
import _ from 'lodash';
import participateIcon from '../assets/icons/support.svg';
import leaveIcon from '../assets/icons/logout.svg';
import EventForm from './EventForm';
import DeleteIcon from '../assets/icons/delete.svg'
import EditIcon from '../assets/icons/edit.svg'
import Add from '../assets/icons/plus.svg'


export default function EventView({ user }) {
  let history = useHistory();
  const [uid, setUid] = useState('');
  const [event, setEvent] = useState({});
  const [addTaskStatus, setAddTaskStatus] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [addTaskId, setAddTaskId] = useState(-1);
  const [subProject, setSubProject] = useState({});
  const [eventForm, setEventForm] = useState(false)





  const getData = useCallback(() => {
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
          console.log(response.data.response);
          return setEvent(response.data.response);
        }
      });
  }, [history, uid]);

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
  }, [history]);

  useEffect(() => {
    if (uid !== '') {
      getData();
    }
  }, [getData, history, uid]);

 
  const hasAdminRights = () => {
    if (user.uid === event.authorUid) return true;
    return false;
  };

  const isUserAdmin = () => {
    if(user.accountType === "admin") return true;
    return false;
  }

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

  const alreadyParticipate = () => {
    
    if (event?.participants.length === 0) return false;
    let newIsUserParticipating = event.participants.some(
      (eachParticipant) => eachParticipant.uid === user.uid
    );
    console.log("FCYTVUBIOJUUYCGUVBHIJOIHGVUH", newIsUserParticipating)
    return newIsUserParticipating;
  };

  const canParticipate = () => {
    if (user.accountType) return false;
    return true;
  };

  const eventSendInfo = () => {
    history.push(`/editEvent/${uid}`);
  };

  const sendParticipation = async (event) => {
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
       window.location.reload();
          //setEvent(response.data.response);
        console.log(response);
      });
  };

  const viewUser = () => {
    history.push(`/viewUser/${event.authorUid}`);
  };

  const handleSubProject = (event, name) => {
    let newSubProject = { ...subProject };
    newSubProject[name] = event.target.value;

    setSubProject(newSubProject);
  };

  const addSubProject = () => {
    axios
      .post(
        `${serverUrl}/subevents/add/${uid}`,
        { ...event, ...subProject },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          return history.push('/');
        } else {
          setEventForm(false);
          return getData() ;
        }
      });
  };

  const addTask = () => {
    axios
      .post(
        `${serverUrl}/tasks/add/${addTaskId}`,
        { ...event, title: taskName },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          return history.push('/');
        } else {
          setAddTaskId(-1);
          setAddTaskStatus(false);
          setTaskName('');
          return getData();
        }
      });
  };

  const renderTasks = (task) => (
    <div key={task.uid} className='Event'>
      <div className='EventTitle'>Task</div>
      <div className='eventDescription'>Description: {task.description}</div>
      <div className='eventDate'>Title: {task.title}</div>
      <div className='eventDate'>Time: {task.timeStamp}</div>
      <div className='eventDate'>Date: {task.date}</div>
    </div>
  );

  const renderEvent = (type, event) => (
    
    <div key={event.uid} className={(type === "event") ? "EventInfo" : "Event"}>
      {(type !== "event") ? (
      <div className="EventTitle" >Subproject</div>

      ):null}
      <div className='eventAuthor' onClick={() => viewUser()}>
        Author: {event.author}
      </div>
      {hasAdminRights() && !addTaskStatus ? (
        <button
          onClick={() => {
            setAddTaskStatus(true);
            setAddTaskId(event.uid);
          }}
        >
          add task
        </button>
      ) : null}
      <a
        rel='noreferrer'
        target='_blank'
        href={`https://www.google.com/maps/search/${event.location}`}
      >
        <div>Location : {` ${event.location}`}</div>
      </a>
      <div className="eventDescription">Description: {event.description}</div>
      <div className='eventDate'>Time: {event.timeStamp}</div>
      <div className='eventDate'>Date: {event.date}</div>
      {event.tasks.map((task) => renderTasks(task))}
    </div>
  );

  if (uid === '' || _.isEmpty(event)) return false;

  return (
    <div>
            {!_.isEmpty(event) && (
        <>
          {hasAdminRights() ? (
            <div>
              <div className='alterIcons'>
              <div className='iconDiv'
                onClick={() => eventSendInfo()}
              >
                <img src={EditIcon} alt="" className='alterEvent' />
                
              </div>
              <div className='iconDiv'
                onClick={(e) => eventDelete()}
              >
                <img src={DeleteIcon} alt="" className='alterEvent' />
              </div>
                <div className='addButton' onClick={()=>setEventForm(true)}>Create Sub-event<img src={Add} alt="" className='alterEvent'/></div>
              </div>
              <div>
                {eventForm && (<h1>add subevent</h1>,
                <EventForm callback={(data) => addSubProject(data)}/>)}
                
              </div>
            </div>
          ) : null}
        </>
      )}
    <div className='Event' id={event.uid} key={event.uid}>

      {addTaskStatus ? (
        <div>
          taskTitle
          <input onChange={(e) => setTaskName(e.target.value)} />
          <button onClick={addTask}>add task</button>
          <button
            onClick={() => {
              setAddTaskId(-1);
              setAddTaskStatus(false);
              setTaskName('');
            }}
          >
            x
          </button>
        </div>
      ) : null}
      
      <div className='EventBar'>
        <div className='EventTitle'>{event.title}</div>
      </div>

      <div className='EventMidSection'>
        {renderEvent("event", event)}

        {canParticipate() ? (
          alreadyParticipate() ? (
            <div onClick={sendParticipation} className='iconDiv'>
              <img src={leaveIcon} alt='leave' className='participateIcon' />
              <h4>Leave</h4>
            </div>
          ) : (
            <div onClick={sendParticipation} className='iconDiv'>
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
    {event.subprojects.length
      ? event.subprojects.map((subproject) => renderEvent("subproject", subproject))
      : null}
      </div>
  );
}