import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Container } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Pagination from "@material-ui/lab/Pagination";

const useStyles = makeStyles({
  paper: {
    marginTop: 12,
  },
  table: {
    // minWidth: 650,
    // width:
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    margin: "50px auto",
  },
  buttonCreate: {
    marginTop: 25,
  },
  root: {
    // textAlign: "center",
    width: 525,
  },
});

function createData(genre_name, id) {
  return { genre_name, id };
}

const rows = [
  // ???
  createData("Frozen yoghurt", 1),
  createData("Ice cream sandwich", 2),
  createData("Eclair", 3),
  createData("Cupcake", 4),
  createData("Gingerbread", 5),
];

export default function Genre() {
  const classes = useStyles();
  const [allGenre, setAllGenre] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [genreName, setGenreName] = useState("");
  const [genreId, setGenreId] = useState();
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

  const handleCreateOpen = () => {
    setCreateOpen(true);
    setGenreName("");
  };

  const handleCreateClose = () => {
    setCreateOpen(false);
  };

  const handleEditOpen = (row) => {
    setEditOpen(true);
    setGenreName(row.genre_name);
    setGenreId(row.id);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleCreateGenre = async () => {
    try {
      const newGenre = await axios.post(
        "https://fbk-api-gateway.herokuapp.com/genre/new",
        {
          genre_name: genreName,
        }
      );
      if (newGenre.status === 200 || newGenre.status === 201) {
        setAllGenre([...allGenre, newGenre.data.data]);
        setCreateOpen(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleEditGenre = async () => {
    try {
      const editGenre = await axios.post(
        "https://fbk-api-gateway.herokuapp.com/genre/update",
        {
          genre_name: genreName,
          id: genreId,
        }
      );

      if (editGenre.status === 200 || editGenre.status === 201) {
        setAllGenre(
          allGenre.map((genre) =>
            genre.id === genreId
              ? { genre_name: genreName, id: genreId }
              : genre
          )
        );
        setEditOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <Container container className={classes.root}>
      <Button
        variant="contained"
        onClick={handleCreateOpen}
        className={classes.buttonCreate}
        color="primary"
      >
        Create new genre
      </Button>
      <TableContainer component={Paper} className={classes.paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="" style={{ paddingLeft: 40 }}>
                Name
              </TableCell>
              <TableCell align="right" style={{ paddingRight: 40 }}>
                Actions&nbsp;
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allGenre.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell
                  component="th"
                  scope="row"
                  style={{ paddingLeft: 40 }}
                >
                  {row.genre_name}
                </TableCell>
                <TableCell align="right" style={{ paddingRight: 40 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleEditOpen(row)}
                    className={classes.buttonCreate}
                    color="primary"
                    style={{ paddingRight: 25, paddingLeft: 25 }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={classes.pagination}>
        <Pagination
          count={1}
          variant="outlined"
          color="primary"
          showFirstButton
          showLastButton
        />
      </div>
      <div>
        <Dialog
          open={createOpen}
          onClose={handleCreateClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create Genre</DialogTitle>
          <DialogContent style={{ width: 500 }}>
            <DialogContentText>
              Type genre name to create movie genre
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Genre Name"
              value={genreName}
              onChange={(e) => setGenreName(e.target.value)}
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCreateClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleCreateGenre} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
        <Dialog
          open={editOpen}
          onClose={handleEditClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit Genre</DialogTitle>
          <DialogContent style={{ width: 500 }}>
            <DialogContentText>
              Type genre name to edit movie genre
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Genre Name"
              value={genreName}
              onChange={(e) => setGenreName(e.target.value)}
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleEditGenre} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Container>
  );
}
