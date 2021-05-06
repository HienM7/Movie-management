import { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import NavBar from '../components/NavBar';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Container } from '@material-ui/core';
import axios from 'axios';
import  { Link, Redirect, useLocation} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';



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
  media: {
    // height: 400,
    width: 200,
  },
  cart: {
    width: 200,
    height: 300,
    margin: '0 auto',
  }
}));

export default function UpdateMovie() {

  const classes = useStyles();

  const useQuery = () => new URLSearchParams(useLocation().search);
  let query = useQuery();
  console.log(query.get('id'));
  // const [token, setToken] = useState('');
  const [state,setState]=useState({
    movieName: "",
    duration: "",
    poster: "",
    releaseDate: "",
    description: "",
    trailer: ""
  });
  

  // useEffect(()=>{
  //   if(localStorage && localStorage.getItem('token'))
  //     setToken(localStorage.getItem('token')));
  // },[token]);

  const [redirect, setRedirect] = useState(false);

  useEffect(()=>{
    axios.get(`https://app-movie-genre-service.herokuapp.com/movie/?id=${query.get('id')}`) 
    .then(response => {
        if (response.status===200 || response.status === 201) {
          console.log({
            movieName: response.data.data[0].movie_name,
            duration: response.data.data[0].duration,
            poster: response.data.data[0].poster,
            releaseDate: response.data.data[0].release_date,
            description: response.data.data[0].description,
            trailer: response.data.data[0].trailer

          })
          setState( prevState => ({
            movieName: response.data.data[0].movie_name,
            duration: response.data.data[0].duration,
            poster: response.data.data[0].poster,
            releaseDate: response.data.data[0].release_date,
            description: response.data.data[0].description,
            trailer: response.data.data[0].trailer
          }));
        }
      })
      .catch(err => console.log(err));
  },[]);


  const handleChange=(event)=>{
    const { name, value }=event.target;
    console.log(name, value);
    setState( prevState => ({
      ...prevState,
      [name] : value
    }));
  };

  const handleSubmit=(event)=>{
    event.preventDefault();
    if(null)
      console.log('');
    //   setAlert("Please enter your username and password!");
    else{
      console.log({
        id: +query.get('id'),
        movie_name: state.movieName,
        duration: +state.duration,
        poster: state.poster,
        release_date: state.releaseDate.split('-').join('/'),
        description: state.description,
        trailer: state.trailer
      })
      // setAlert("Verifying...please wait");
      var url="https://app-movie-genre-service.herokuapp.com/movie/update";
      axios.post(url,{
        id: +query.get('id'),
        movie_name: state.movieName,
        duration: +state.duration,
        poster: state.poster,
        release_date: state.releaseDate.split('-').join('/'),
        description: state.description,
        trailer: state.trailer,
        genre_ids: [4,9]
      })
        .then(response => {
            console.log(response.status);

          //console.log(response);
          // props.onReceiveToken(response.data.data.token);
          if (response.status === 200 || response.status === 201) {
            console.log('??')
            setRedirect(true);
          }
          // setAlert("Login Success");
          // setAlertKind("Success")    
        })
        .catch(error => {
          console.log(error);
          // if(error.response.data&&error.response.data.status===401)
          //   setAlert(error.response.data.message);
        });
    }
  }

  if (redirect) {
    return <Redirect to="/"/>
  }
  if (!localStorage.getItem('token')) {
    return <Redirect to="/login"/>
  }

  return (
    <div className={classes.root}>
      <NavBar />
      <Container className={classes.container}>
        <Typography variant="h3" style={{margin: 20}}>
          Update Movie
        </Typography>
          <Card className={classes.cart}>
            <CardActionArea>
              {
                /* <CardMedia
                  className={classes.media}
                  image="https://www.cgv.vn/media/catalog/product/cache/1/image/1800x/71252117777b696995f01934522c402d/g/o/godzilla_vs.jpg"
                  title="Contemplative Reptile"
                /> */
              }
              <img className={classes.media} src={ state.poster ? state.poster : "https://i.imgur.com/Z2MYNbj.png/large_movie_poster.png" } alt="Movie Poster"/>
              {/* <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {movie.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Genre: {movie.genre_name.join(', ')}<br/>
                  Release date: {movie.release_date}<br/>
                  Duration: {movie.duration} minutes<br/>
                </Typography>
              </CardContent> */}
            </CardActionArea>
          </Card>
        <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="movie_name"
            label="Movie Name"
            name="movieName"
            value={state.movieName}
            autoComplete="movie_name"
            onChange={handleChange}
          />

        <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="duration"
            label="Duration"
            name="duration"
            value={state.duration}
            autoComplete="Duration"
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="poster"
            label="Poster link"
            name="poster"
            value={state.poster}
            autoComplete="poster"
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            type="date"
            required
            fullWidth
            id="release_date"
            // label="Release Date"
            name="releaseDate"
            value={state.releaseDate}
            autoComplete="release_date"
            onChange={handleChange}
          />
          {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date picker inline"
              value={state.releaseDate}
              onChange={handleChange}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider> */}
{/* 
          <TextField
            id="date"
            label="Birthday"
            type="date"
            defaultValue="2017-05-24"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          /> */}

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="description"
            label="Description"
            name="description"
            value={state.description}
            autoComplete="description"
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="trailer"
            label="Trailer"
            name="trailer"
            value={state.trailer}
            autoComplete="Trailer"
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Update
          </Button>
        </form>

          
        <Grid container spacing={6}>
        </Grid>
      </Container>
    </div>
  );

}





// https://app-movie-genre-service.herokuapp.com/movie/new
// body: {
    // "movie_name": "Godzilla vs Kong",
    // "duration": 113,
    // "poster": "https://www.cgv.vn/media/catalog/product/cache/1/image/1800x/71252117777b696995f01934522c402d/g/o/godzilla_vs.jpg",
    // "release_date": "24/03/2021",
    // "description": beginning of the mystery that lies deep within the core of the Earth.",
    // "trailer": "https://www.youtube-nocookie.com/embed/odM92ap8_c0"
// }