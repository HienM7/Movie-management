import './App.css';
import SignIn from './components/SignIn';
import ListMovie from './components/ListMovies';
import MovieScheduler from './components/MovieScheduler';
import CreateMovie from './screens/CreateMovie';
import { useState, useEffect} from 'react';
import  UpdateMovie  from './screens/UpdateMovie';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

function App() {

  // const [token, setToken] = useState('');
  

  // useEffect(()=>{
  //   if(localStorage && localStorage.getItem('token'))
  //     setToken(localStorage.getItem('token')));
  // },[token]);


  return (
        <Switch>
          <Route exact path="/movie/create">
            <CreateMovie />
          </Route>
          <Route exact path="/movie/schedule">
            <MovieScheduler />
          </Route>
          <Route exact path="/login">
            <SignIn />
          </Route>
          <Route exact path="/movie/edit">
            <UpdateMovie />
          </Route>
          <Route exact path="/">
            <ListMovie />
          </Route>
          <Route exact path="/movie">
            <ListMovie />
          </Route>
        </Switch>
  );
}

export default App;
