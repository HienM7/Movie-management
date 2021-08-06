import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import NavBar from './NavBar';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Container } from '@material-ui/core';
import Movie  from './Movie';
import { useEffect, useState } from 'react';
import axios from 'axios';
import  { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import  { Redirect } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';


const useStyles = makeStyles((theme) => ({
 container: {
   marginTop: 110,
   position: "relative"
 },
 buttonCreate: {
   marginBottom: 30
 }, 
 flex: {
   display: "flex",
   position: "absolute",
   top: 0,
   right: 0
 },
 link: {
   textDecoration: "none",
 },
 pagination: {
   display: 'flex',
   justifyContent: 'center',
   margin: '50px auto'
 }
}));

export default function SearchAppBar() {
  const classes = useStyles();
  const [list,setList]=useState();

  

  
  useEffect(()=>{
    let mounted=true;
    axios.get("https://fbk-api-gateway.herokuapp.com/movie") 
    .then(response => {
        if (mounted) setList(response.data.data);
      })
      .catch(err => console.log(err));

      return ()=>{mounted=false;}
  },[]);

  return (
    <div className={classes.root}>
      <Container className={classes.container}>
        <div>
          <Link to={`/movie/create`} className={classes.link}>
            <Button variant="contained" className={classes.buttonCreate} color="primary">
              Create Movie
            </Button>
          </Link>
        {/* <div className={classes.flex}>
          <TextField id="outlined-basic" style={{padding: 0}} label="Search" variant="outlined" />
          <Button variant="contained" color="primary">
            Search
          </Button>
        </div> */}
          
        </div>
        <Grid container spacing={6}>
        {list && (
          list.reverse().map((movie, index) => <Grid key={index} item xs={12} sm={6} md={3}>
            <Movie movie={movie} />
          </Grid>)
          )
        }
        </Grid>
        <div className={classes.pagination}>
          <Pagination count={1} variant="outlined" color="primary" showFirstButton showLastButton />
        </div>
      </Container>
    </div>
  );
}


{/* map((movie,index)=>
              (<div key={index} className="col pb-5">
                <div className="card ">
                  <Link to={`/movie/${movie.movie_id}`}>
                    <img className="card-img-top" src={movie.poster} alt="Movie Poster"/>
                  </Link>    
                  <div className="card-body bg-silver">
                    <h4 className="card-title">{movie.name}</h4>
                    <div className="card-text">
                      <h6>Genre: <small>{movie.genre_name.join(", ")}</small></h6>
                      <h6>Release date: <small>{movie.release_date}</small></h6>
                      <h6>Duration: <small>{movie.duration} minutes</small></h6>
                    </div>
                    <button className="btn btn-danger mt-2 w-100"><b>BOOKING</b></button> 
                  </div>
                </div>    
              </div>))}
          </div>) */}