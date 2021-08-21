import React from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Container } from "@material-ui/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Redirect } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 30,
    position: "relative",
  },
  buttonCreate: {
    marginBottom: 30,
  },
  flex: {
    display: "flex",
    position: "absolute",
    top: 0,
    right: 0,
  },
  link: {
    textDecoration: "none",
  },
}));

export default function SearchAppBar() {
  const classes = useStyles();
  const [listRoom, setList] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://fbk-api-gateway.herokuapp.com/room")
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          setList(response.data.data);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const roomImages = [
    "https://alonhatro.com/assets/data/res/up-tin/galaxy-tan-binh.png",
    "http://kntvietnam.com/upload/images/du-an/Galaxy/tb%2012.jpg",
    "https://chonthuonghieu.com/wp-content/uploads/listing-uploads/gallery/2021/02/GALAXYHP1.jpg",
    "https://rapchieuphim.com/photos/2/galaxy/galaxy-kinh-duong-vuong-2.png",
  ];

  if (loading) {
    return <div></div>;
  }

  return (
    <div className={classes.root}>
      <Container className={classes.container}>
        <Grid container spacing={6}>
          {listRoom &&
            listRoom.map((room, index) => (
              <Grid key={index} item xs={12} sm={6} md={3}>
                <Link
                  to={`/movie/schedule/?id=${room.room_id}`}
                  className={classes.link}
                >
                  <Card className={classes.root}>
                    <CardActionArea>
                      {
                        //  index && <div></div>
                      }
                      <img
                        className={classes.media}
                        src={roomImages[index]}
                        alt="Room Poster"
                        style={{ width: 700, height: 425 }}
                      />
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="h2"
                          align="center"
                        >
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
              </Grid>
            ))}
        </Grid>
      </Container>
    </div>
  );
}
