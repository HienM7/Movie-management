import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from "axios";
import { useState, useContext } from "react";
import { Redirect } from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext"; 



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn(props) {

  const { authInfo, setAuthInfo } = useContext(AuthContext);

  const [state,setState]=useState({
    username: "",
    password: "",
  });
  const [alert,setAlert]=useState("");

  const [alertKind, setAlertKind]=useState('error')
  
  const handleChange=(event)=>{
    const { name, value }=event.target;
    setState( prevState => ({
      ...prevState,
      [name] : value
    }));
    setAlert("");
  };

  const handleSubmit=(event) => {
    event.preventDefault();
    if(state.username===""||state.password==="") 
      setAlert("Please enter your username and password!");
    else{
      setAlertKind("Success");
      setAlert("Verifying...please wait");
      var url="https://myplsapp.herokuapp.com/auth/login";
      axios.post(url,state)
        .then(response => {
          //console.log(response);
          // props.onReceiveToken(response.data.data.token);
          localStorage.setItem('token', response.data.data.token);  
          setAlert("Login Success");
          setAlertKind("Success");
          setAuthInfo({
            ...authInfo,
            isLogin: true
          });
        })
        .catch(error => {
          console.log(error);
          if(error.response.data&&error.response.data.status===401)
            setAlertKind("");
            setAlert(error.response.data.message);
        });
    }
  }

  const classes = useStyles();
  if(authInfo.isLogin) {
    return <Redirect to='/'/>
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {alert!==""?<Alert severity={alertKind}>{alert}</Alert>:''}

        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={state.username}
            autoComplete="username"
            onChange={handleChange}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={handleChange}
            autoComplete="current-password"
            value={state.password}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
        </form>
      </div>
    </Container>
  );
}
