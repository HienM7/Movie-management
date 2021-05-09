import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Container } from '@material-ui/core';
import { useEffect, useState } from 'react';
import axios from 'axios';
import  { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import  {  Redirect } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

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
 }
 
}));

export default function SearchAppBar() {
  const classes = useStyles();
  const [listRoom,setList]=useState();

  
  useEffect(()=>{
    axios.get("https://app-screening-service.herokuapp.com/room") 
    .then(response => {
        if (response.status === 200 || response.status === 201) 
        setList(response.data.data);

      })
      .catch(err => console.log(err));
      
  },[]);
  
  return (
    <div className={classes.root}>
      <Container className={classes.container}>
        <Grid container spacing={6}>
        {listRoom && (
          listRoom.map((room, index) => <Grid key={index} item xs={12} sm={6} md={3}>


          <Link to={`/movie/schedule/?id=${room.room_id}`} className={classes.link}>
            <Card className={classes.root}>
              <CardActionArea>
                {
                //  index && <div></div>
                }
                <img className={classes.media} src={"https://channel.mediacdn.vn/thumb_w/640/2019/7/29/photo-4-1564396581026113796908.jpg"} alt="Room Poster"/>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2" align="center">
                    {"Screen " + room.room_name}
                  </Typography>
                  {/* <Typography variant="body2" color="textSecondary" component="p">
                    Genre: {movie.genre_name.join(', ')}<br/>
                    Release date: {movie.release_date}<br/>
                    Duration: {movie.duration} minutes<br/>
                  </Typography> */}
                </CardContent>
              </CardActionArea>
              {/* <CardActions>
                <Button size="small" color="primary">
                  Share
                </Button>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions> */}
            </Card>
          </Link> 
          </Grid>)
          )
        }
        </Grid>
      </Container>
    </div>
  );
}

