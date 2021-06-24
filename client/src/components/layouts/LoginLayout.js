import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import logo from '../../assets/logo.svg'
import '../../styling/App.css'

// broken
export default function LoginLayout({ content }) {
  let history = useHistory()
  useEffect(() => {
    if (localStorage.getItem('token')) {
      return history.push('/')
    }
  }, [])

  return (
    <div className="LoginLayout">
      <div className="LogoWrapper">
        <img src={logo} alt={logo} className="Logo" />
      </div>
      <div className="Form">{content}</div>
    </div>
  )
}
