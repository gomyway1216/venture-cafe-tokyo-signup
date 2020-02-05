import React, { Component } from 'react'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import AuthPage from './pages/Auth'
import BookingsPage from './pages/Bookings'
import EventsPage from './pages/Events'
import MainNavigation from './components/Navigation/MainNavigation'
import AuthContext from './context/auth-context'
import CheckIn from './pages/CheckIn'
import SignUp from './pages/SignUp'

import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
    this.state = {
      token: loginInfo ? loginInfo.token : null,
      userId: loginInfo ? loginInfo.token : null,
    }
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId })
    localStorage.setItem(
      'loginInfo',
      JSON.stringify({ token: token, userId: userId })
    )
  }

  logout = () => {
    this.setState({ token: null, userId: null })
    localStorage.removeItem('loginInfo')
  }

  render() {
    // console.log("this is URL", process.env.REACT_APP_URL);
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.userId,
              login: this.login,
              logout: this.logout,
            }}
          >
            <MainNavigation />
            <main className="main-content">
              <Switch>
                <Route path="/" component={SignUp} />
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default App
