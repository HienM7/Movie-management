import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import LocalMoviesIcon from '@material-ui/icons/LocalMovies';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import  { Link, Redirect } from 'react-router-dom';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  navLinks: {
    display: 'flex'
  },
  link: {
    textDecoration: 'none',
    color: 'white',
  }
}));


export default function NavBar(props) {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setAuth(false);
    }
  }, []);
  


  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const doLogout = () => {
    setAnchorEl(null);
    localStorage.removeItem('token');
    setAuth(false);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Link to={'/'} className={classes.link}>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <LocalMoviesIcon />
            </IconButton>
          </Link>
          <Typography variant="h6" className={classes.title}>
            Movie Management
          </Typography>
          <Link to={'/movie/schedule'} className={classes.link}>
                <Button color="inherit">Movie Scheduler</Button>
          </Link>
          
          <Link to={'/movie'} className={classes.link}>
            <Button color="inherit">List Movie</Button>
          </Link>

          <Link to={'/movie'} className={classes.link}>
            <Button color="inherit">Movies Genre</Button>
          </Link>
          {/* <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
            <AccountCircleIcon />
            </IconButton> */}

          {/* <List component="nav" aria-labelledby="main navigation" className={classes.navLinks}>
            {navLinks.map(({ title, path }) => (
              <a href={path} key={title}>
                <ListItem button>
                  <ListItemText primary={title} />
                </ListItem>
              </a>
            ))}
          </List> */}
          {!auth? (
            <Link to={'/login'} className={classes.link}>
              <Button color="inherit">Login</Button>
            </Link>
          ) : (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={doLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}




        </Toolbar>
      </AppBar>
    </div>
  );
}
