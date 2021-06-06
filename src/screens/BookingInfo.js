import { useState, useEffect } from "react";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import SeatPicker from "react-seat-picker";

const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get("code");

const makeRows = (function () {
  let i = 1;
  return [...Array(10)].map((item) =>
    [...Array(10)].map((item, index) => ({ id: i++, number: index + 1 }))
  );
})();

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 150,
  },
  container: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: 20,
  },
  bookingInfo: {
    display: "flex",
    "& div:nth-child(1)": {
      flexGrow: 2,
      padding: 10,
      marginRight: 20,
    },
    "& div:nth-child(2)": {
      flexGrow: 1,
      padding: 10,
    },
  },
  seat: {
    padding: 20,
    marginTop: 20,
    '& > div > div': {
      margin: '0 auto',
    },
    '& h3': {
      textAlign: 'center',
      marginBottom: 30
    }
  }
}));

export default function () {
  const classes = useStyles();
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingResponse = await axios.get(
          `https://fbk-api-gateway.herokuapp.com/bookings/by-code/${myParam}`
        );
        if (bookingResponse.status === 200) {
          const [movie, user, screening] = await Promise.all([
            axios.get(
              `https://fbk-api-gateway.herokuapp.com/movie?id=${bookingResponse.data.data.movieId}`
            ),
            axios.get(
              `https://myplsapp.herokuapp.com/rest-account/accounts/${bookingResponse.data.data.userId}`
            ),
            axios.get(
              `https://fbk-api-gateway.herokuapp.com/screening/by-id?screening_id=${bookingResponse.data.data.tickets[0].screeningId}`
            ),
          ]);

          if (
            movie.status === 200 &&
            user.status === 200 &&
            screening.status === 200
          ) {
            for (const seat of bookingResponse.data.data.tickets.map((item) =>
              getSeat(+item.seatNumber)
            )) {
              makeRows[getIndexSeat(seat[0]) - 1][+seat.slice(1) - 1] = {
                ...makeRows[getIndexSeat(seat[0]) - 1][+seat.slice(1) - 1],
                isSelected: true,
              };
            }
            setRows(makeRows);
            setState({
              bookingId: bookingResponse.data.data.id,
              username: user.data.data.username,
              email: user.data.data.userDto.email,
              total: bookingResponse.data.data.amount,
              setCount: bookingResponse.data.data.tickets.length,
              movieName: movie.data.data[0].movie_name,
              duration: movie.data.data[0].duration,
              start:
                screening.data.data.date + " " + screening.data.data.timeslot,
              room: screening.data.data.room,
            });
            setLoading(false);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  const addSeatCallback = ({ row, number, id }, addCb) => {};

  const getSeat = (number) => {
    return number % 10 === 0
      ? String.fromCharCode(Math.floor(number / 10) + 64) + 10
      : String.fromCharCode(Math.floor(number / 10) + 65) + (number % 10);
  };

  const getIndexSeat = (row) => {
    switch (row) {
      case "A":
        return 1;
      case "B":
        return 2;
      case "C":
        return 3;
      case "D":
        return 4;
      case "E":
        return 5;
      case "F":
        return 6;
      case "G":
        return 7;
      case "H":
        return 8;
      case "I":
        return 9;
      case "J":
        return 10;
      default:
        break;
    }
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.container}>
        <h1>Booking Info</h1>
        <div className={classes.bookingInfo}>
          <Paper>
            Booking Id: {state.bookingId} <br />
            User name: {state.username} <br />
            User email: {state.email} <br />
            Total charge:{" "}
            {state.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
            <br />
            Seat count: {state.setCount}
          </Paper>
          <Paper>
            Movie name: {state.movieName} <br />
            Room: {state.room} <br />
            Start time: {state.start} <br />
            Duration: {state.duration}
          </Paper>
        </div>
        <div className={classes.seat}>
          <h3>Seat details</h3>
          <SeatPicker
            addSeatCallback={addSeatCallback}
            rows={rows}
            maxReservableSeats={100}
            alpha
            visible
            selectedByDefault
            loading={loading}
            tooltipProps={{ multiline: true }}
          />
        </div>
      </Paper>
    </div>
  );
}
