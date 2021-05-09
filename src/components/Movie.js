import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import  { Link, Redirect } from 'react-router-dom';



const useStyles = makeStyles({
  root: {
    // maxWidth: 3s45,
  },

  media: {
    // height: 400,
    width: '100%',
  },
  link: {
    textDecoration: 'none',

  }

});

export default function Movie(props) {
  const classes = useStyles();
  const { movie, index } = props;

  return (
    <Link to={`/movie/edit/?id=${movie.movie_id}`} className={classes.link}>
      <Card className={classes.root}>
        <CardActionArea>
          {
          //  index && <div></div>
          }
          <img className={classes.media} src={movie.poster} alt="Movie Poster"/>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {movie.movie_name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Genre: {movie.genre_name.join(', ')}<br/>
              Release date: {movie.release_date}<br/>
              Duration: {movie.duration} minutes<br/>
            </Typography>
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
  );
}
