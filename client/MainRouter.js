import React, { Component } from 'react'
import {Route, Switch} from 'react-router-dom'

import Home from './core/Home'
import Menu from './core/Menu'
import Users from './user/Users'
import Signup from './user/Signup'
import Profile from './user/Profile'
import EditProfile from './user/EditProfile'
import SignIn from './auth/SignIn'
import PrivateRoute from './auth/PrivateRoute'
import NewMedia from './media/NewMedia'
import EditMedia from './media/EditMedia'
import PlayMedia from './media/PlayMedia'

const MainRouter = ({data}) => {
    return (<div>
        <Menu/>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/users" component={Users}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/signin" component={SignIn}/>
          <PrivateRoute path="/user/edit/:userId" component={EditProfile}/>
          <Route path="/user/:userId" component={Profile}/>
  
          <PrivateRoute path="/media/new" component={NewMedia}/>
          <PrivateRoute path="/media/edit/:mediaId" component={EditMedia}/>
          <Route path="/media/:mediaId" render={(props) => (
              <PlayMedia {...props} data={data} />
          )} />
        </Switch>
      </div>)
  }
  

export default MainRouter