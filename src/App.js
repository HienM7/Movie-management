import './App.css';
import SignIn from './components/SignIn';
import ListMovie from './components/ListMovies';
import CreateMovie from './screens/CreateMovie';
import { useContext} from 'react';
import  UpdateMovie  from './screens/UpdateMovie';
import { AuthContext } from './contexts/AuthContext';
import MovieScheduler from './screens/Scheduler';
import ListRoom from './screens/ListRoom';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Genre from './screens/Genre'

function App() {

  const { authInfo, setAuthInfo } = useContext(AuthContext);

  // useEffect(()=>{
  //   if(localStorage && localStorage.getItem('token'))
  //     setToken(localStorage.getItem('token')));
  // },[token]);

  return (
        <Switch>
          <Route exact path="/movie/create">
           { !authInfo.isLogin ? <Redirect to='/login'/> : <CreateMovie />}
          </Route>
          <Route exact path="/movie/schedule">
            { !authInfo.isLogin ? <Redirect to='/login'/> : <MovieScheduler />}
          </Route>
          <Route exact path="/movie/rooms">
            { !authInfo.isLogin ? <Redirect to='/login'/> : <ListRoom />}
          </Route>
          <Route exact path="/login">
            <SignIn />
          </Route>
          <Route exact path="/movie/edit">
            { !authInfo.isLogin ? <Redirect to='/login'/> :  <UpdateMovie />}
          </Route>
          <Route exact path="/">
            { !authInfo.isLogin ? <Redirect to='/login'/> :  <ListMovie />}
          </Route>
          <Route exact path="/movie">
            { !authInfo.isLogin ? <Redirect to='/login'/> :   <ListMovie />}
          </Route>
          <Route exact path="/genres">
            { !authInfo.isLogin ? <Redirect to='/login'/> :   <Genre />}
          </Route>
        </Switch>
  );
}

export default App;
