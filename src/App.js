import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import MainNavigation from './components/Navigation/MainNavigation'
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
          <MainNavigation />
          <main className="main-content">
            <Switch>
              <Route path="/" component={SignUp} />
            </Switch>
          </main>
        </React.Fragment>
      </BrowserRouter>
    )
  }
}

export default App
