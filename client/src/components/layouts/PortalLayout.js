import React, {
  useState,
  useEffect,
  useImperativeHandle,
  useReducer,
} from 'react'
import axios from 'axios'
import { serverUrl } from '../../utils/constants'
import { useHistory } from 'react-router-dom'
import _ from 'lodash'
import '../../styling/App.css'

export default function PortalLayout({ content }) {
  const [user, setUser] = useState({})
  const [search, setSearch] = useState('')
  let history = useHistory()

  const logout = () => {
    localStorage.clear('token')
    return history.push('/login')
  }

  const sendToEdit = () => {
    return history.push('/editUser')
  }
  const sendToHome = () => {
    return history.push('/')
  }
  const sendToAdd = () => {
    return history.push('/addEvent')
  }

  useEffect(async () => {
    if (!localStorage.getItem('token')) {
      return history.push('/login')
    }
    if (_.isEmpty(user)) {
      await axios
        .get(`${serverUrl}/user/get`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        .then((response) => {
          if (response.data.data.accountType == "admin") {
            //return history.push('/adminDashboard')
          }
          return setUser(response.data.data)
        })
        .catch((err) => {
          localStorage.removeItem('token')
          return history.push('/login')
        })
    }
  }, [])

  return (
    <div className="Wrapper">
      {!_.isEmpty(user) && (
        <>
          <div className="Navbar">
            <div className="Left">
              <div className="RoundButton" onClick={() => sendToHome()}>
                <i className="fas fa-home"></i>
              </div>
              <div className="RoundButton" onClick={() => sendToAdd()}>
                <i className="fas fa-plus"></i>
              </div>
              <div className="InputWrapper InputWrapperSpacer Center">
                <input
                  placeholder="Search"
                  type="text"
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>
            <div className="Right">
              <div className="UserBar">
                <p className="LabelSmall">
                  Welcome,{' '}
                  <p className="UserName" onClick={() => sendToEdit()}>
                    {user.username}
                  </p>
                  !
                </p>
                <div className="Button LogoutBtn" onClick={() => logout()}>
                  Logout
                </div>
              </div>
            </div>
          </div>
          <div className="Container">
            {React.cloneElement(content, { user, search })}
          </div>
        </>
      )}
    </div>
  )
}
//

// TODO
//jwt decode-sub
//take uid
//make api call
//store data locally
