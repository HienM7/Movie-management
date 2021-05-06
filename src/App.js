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
    <Router>
      <div>
        {/* <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav> */}

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/movie/create">
            <CreateMovie />
          </Route>
          <Route exact path="/movie">
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
        </Switch>
      </div>
    </Router>
  );
}

export default App;
