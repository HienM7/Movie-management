import { useState, useEffect, useRef } from "react";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import NavBar from "../components/NavBar";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Container } from "@material-ui/core";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 110,
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    boxSizing: "border-box",
    padding: "0 50px",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  media: {
    // height: 400,
    width: "100%",
  },
  cart: {
    width: 350,
    // height: ,
    margin: "0 auto",
    // maxWidth: 350
  },
  formControl: {
    // margin: theme.spacing(1),
    width: "100%",
    height: 50,
    paddingBottom: 20,
  },
  status: {
    marginTop: 35,
    marginBottom: 10,
    width: "100%",
    height: 50,
    paddingBottom: 20,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function CreateMovie(props) {
  const classes = useStyles();
  const theme = useTheme();
  // const selectRef = useRef(null);

  const [state, setState] = useState({
    movieName: "",
    duration: "",
    poster: "",
    releaseDate: "",
    description: "",
    trailer: "",
    status: 1,
  });

  const [redirect, setRedirect] = useState(false);
  const [allGenre, setAllGenre] = useState([]);
  const [genreName, setGenreName] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://fbk-api-gateway.herokuapp.com/genre`)
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          setAllGenre(response.data.data);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (null) console.log("");
    //   setAlert("Please enter your username and password!");
    else {
      console.log(allGenre);
      console.log(genreName);
      // console.log({
      //   movie_name: state.movieName,
      //   duration: +state.duration,
      //   poster: state.poster,
      //   release_date: state.releaseDate.split('-').reverse().join('/'),
      //   description: state.description,
      //   trailer: state.trailer,
      //   genre_ids: allGenre.filter(item => genreName.indexOf(item.genre_name) !== -1 ).map(item => item.id)
      // })
      // setAlert("Verifying...please wait");
      var url = "https://fbk-api-gateway.herokuapp.com/movie/new";
      axios
        .post(url, {
          movie_name: state.movieName,
          duration: +state.duration,
          poster: state.poster,
          release_date: state.releaseDate.split("-").reverse().join("/"),
          description: state.description,
          trailer: state.trailer,
          genre_ids: allGenre
            .filter((item) => genreName.indexOf(item.genre_name) !== -1)
            .map((item) => item.id),
          movie_status: +state.status,
        })
        .then((response) => {
          console.log(response.status);
          //console.log(response);
          // props.onReceiveToken(response.data.data.token);
          if (response.status === 200 || response.status === 201) {
            console.log("??");
            setRedirect(true);
          }
          // setAlert("Login Success");
          // setAlertKind("Success")
        })
        .catch((error) => {
          setError("Can not create new movie");
          console.log(error);
          // if(error.response.data&&error.response.data.status===401)
          //   setAlert(error.response.data.message);
        });
    }
  };

  if (loading) {
    return <div></div>;
  }

  if (redirect) {
    return <Redirect to="/" />;
  }
  if (!localStorage.getItem("token")) {
    return <Redirect to="/login" />;
  }

  return (
    <div className={classes.root}>
      <Container className={classes.container}>
        <Typography variant="h3" style={{ margin: 20 }} align="center">
          Create Movie
        </Typography>
        <Grid container spacing={6} style={{ marginTop: 50 }}>
          <Grid xs={12} sm={6} md={6} style={{ paddingTop: 35 }}>
            <Card className={classes.cart}>
              <CardActionArea>
                {/* <CardMedia
                  className={classes.media}
                  image="https://www.cgv.vn/media/catalog/product/cache/1/image/1800x/71252117777b696995f01934522c402d/g/o/godzilla_vs.jpg"
                  title="Contemplative Reptile"
                /> */}
                <img
                  className={classes.media}
                  src={
                    state.poster
                      ? state.poster
                      : "https://i.imgur.com/Z2MYNbj.png/large_movie_poster.png"
                  }
                  alt="Movie Poster"
                />
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
          </Grid>
          <Grid xs={12} sm={6} md={6} style={{ margin: "0 auto" }}>
            <form className={classes.form} onSubmit={handleSubmit}>
              {error && <Alert severity="error">{error}</Alert>}
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
                type="number"
                placeholder="Movie duration in minutes"
                value={state.duration}
                autoComplete="Duration"
                onChange={handleChange}
              />

              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined">
                  Movie Genre
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined"
                  id="demo-simple-select-outlined"
                  multiple
                  required
                  // ref={selectRef}
                  value={genreName}
                  onChange={(e) => {
                    setGenreName(e.target.value);
                  }}
                  input={<Input id="select-multiple-chip" />}
                  renderValue={(selected) => (
                    <div className={classes.chips}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          className={classes.chip}
                        />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {allGenre.map((genre) => (
                    <MenuItem
                      key={genre.genre_name}
                      value={genre.genre_name}
                      style={getStyles(genre.genre_name, genreName, theme)}
                    >
                      {genre.genre_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="outlined" className={classes.status}>
                <InputLabel id="demo-simple-select-outlined-label">
                  Movie status
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={state.status}
                  onChange={handleChange}
                  label="Movie status"
                  name="status"
                >
                  <MenuItem value={1}>No longer showing</MenuItem>
                  <MenuItem value={2}>Now showing</MenuItem>
                  <MenuItem value={3}>Coming soon</MenuItem>
                </Select>
              </FormControl>

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
                Create
              </Button>
            </form>
          </Grid>
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
