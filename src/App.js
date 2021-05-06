import './App.css';
import SignIn from './components/SignIn';
import ListMovie from './components/ListMovies';
import MovieScheduler from './components/MovieScheduler';
import CreateMovie from './screens/CreateMovie';
import { useState, useEffect} from 'react';

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
          <Route path="/create">
            <CreateMovie />
          </Route>
          <Route path="/movie">
            <MovieScheduler />
          </Route>
          <Route path="/login">
            <SignIn />
          </Route>
          <Route path="/">
            <ListMovie />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
