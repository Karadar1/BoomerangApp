import LoginLayout from './components/layouts/LoginLayout';
import PortalLayout from './components/layouts/PortalLayout';
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import HomePortal from './components/HomePortal';
import UserEdit from './components/UserEdit';
import EventAdd from './components/EventAdd';
import EventEdit from './components/EventEdit';
import EventView from './components/EventView';

function App() {
  return (
    <BrowserRouter>
      <Route
        exact
        path='/login'
        render={() => <LoginLayout content={<Login />} />}
      />
      <Route
        exact
        path='/register'
        render={() => <LoginLayout content={<Register />} />}
      />
      <Route
        exact
        path='/'
        render={() => <PortalLayout content={<HomePortal />} />}
      />

      <Route
        exact
        path='/editUser'
        render={() => <PortalLayout content={<UserEdit />} />}
      />

      <Route
        exact
        path='/addEvent'
        render={() => <PortalLayout content={<EventAdd />} />}
      />
      <Route
        exact
        path='/editEvent/:uid?'
        render={() => <PortalLayout content={<EventEdit />} />}
      />
      <Route
        exact
        path='/viewEvent/:uid?'
        render={() => <PortalLayout content={<EventView />} />}
      />

      <Route
        exact
        path='viewUser/:uid?'
        render={() => <PortalLayout content={<EventView />} />}
      />
    </BrowserRouter>
  );
}

export default App;

// localStorage.getItem('token')
// localStorage.setItem('token',value)
// localStorage.clear('token')
// TODO Portal
// TODO Styling
