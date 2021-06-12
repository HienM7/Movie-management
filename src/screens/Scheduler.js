import * as React from "react";
import Paper from "@material-ui/core/Paper";
import {
  ViewState,
  EditingState,
  IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  DayView,
  Appointments,
  AppointmentForm,
  AppointmentTooltip,
  ConfirmationDialog,
  DragDropProvider,
  WeekView,
  ViewSwitcher,
  Toolbar,
  DateNavigator,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import axios from "axios";
import moment from "moment";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import classNames from "clsx";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Room from "@material-ui/icons/Room";
import {
  ContactlessOutlined,
  TransferWithinAStationSharp,
} from "@material-ui/icons";

const style = ({ palette }) => ({
  icon: {
    color: palette.action.active,
  },
  textCenter: {
    textAlign: "center",
  },
  firstRoom: {
    background:
      "url(https://js.devexpress.com/Demos/DXHotels/Content/Pictures/Lobby-4.jpg)",
  },
  secondRoom: {
    background:
      "url(https://js.devexpress.com/Demos/DXHotels/Content/Pictures/MeetingRoom-4.jpg)",
  },
  thirdRoom: {
    background:
      "url(https://js.devexpress.com/Demos/DXHotels/Content/Pictures/MeetingRoom-0.jpg)",
  },
  header: {
    height: "260px",
    backgroundSize: "cover",
  },
  commandButton: {
    backgroundColor: "rgba(255,255,255,0.65)",
  },
});

const SHIFT_KEY = 16;

const getClassByLocation = (classes, location) => {
  if (location === "Room 1") {
    console.log(classes.firstRoom);

    return classes.firstRoom;
  }
  if (location === "Room 2") return classes.secondRoom;
  return classes.thirdRoom;
};

// const TextEditor = (props) => {
//   // eslint-disable-next-line react/destructuring-assignment
//   if (props.type === "multilineTextEditor") {
//     return null;
//   }
//   return <AppointmentForm.TextEditor {...props} />;
// };

function BasicLayout({ onFieldChange, appointmentData, ...restProps }) {
  const { movies, roomName } = restProps;

  React.useEffect(() => {
    onFieldChange({
      location: roomName || "Room 1",
    });
  }, []);

  const onMovieChange = (nextValue) => {
    onFieldChange({
      movie: nextValue,
      title: movies.find((movie) => movie.movie_id === nextValue).movie_name,
    });
    onFieldChange({
      endDate: moment(
        +appointmentData.startDate +
          movies.find((movie) => movie.movie_id === nextValue).duration * 60000
      ),
    });
  };
  const onStartDateChange = (nextValue) => {
    if (moment(nextValue).minute() === 0) {
    } else if (moment(nextValue).minute() < 15) {
      nextValue = moment(
        +moment(nextValue) - moment(nextValue).minute() * 60000 + 15 * 60000
      );
    } else if (moment(nextValue).minute() < 30) {
      nextValue = moment(
        +moment(nextValue) - moment(nextValue).minute() * 60000 + 30 * 60000
      );
    } else if (moment(nextValue).minute() < 45) {
      nextValue = moment(
        +moment(nextValue) - moment(nextValue).minute() * 60000 + 45 * 60000
      );
    } else {
      nextValue = moment(
        +moment(nextValue) - moment(nextValue).minute() * 60000 + 60 * 60000
      );
    }
    if (!appointmentData.movie) {
      console.log("check");
      onFieldChange({
        startDate: nextValue,
      });
      return;
    }
    onFieldChange({
      startDate: nextValue,
      endDate: moment(
        +nextValue +
          movies.find((movie) => movie.movie_id === appointmentData.movie)
            .duration *
            60000
      ),
    });
  };

  const onNoteChange = (nextValue) => {
    onFieldChange({
      note: nextValue,
    });
  };

  return (
    <div style={{ width: "80%", margin: "25px auto" }}>
      <AppointmentForm.Label text="Details" type="title" />
      <AppointmentForm.Select
        label="Movie"
        fullWidth
        onValueChange={onMovieChange}
        value={appointmentData.movie}
        availableOptions={movies.map((movie) => ({
          ...movie,
          id: movie.movie_id,
          text: movie.movie_name,
        }))}
      />

      <AppointmentForm.DateEditor
        required
        fullWidth
        onValueChange={onStartDateChange}
        value={appointmentData.startDate}
      />
      <AppointmentForm.TextEditor
        readOnly={true}
        fullWidth
        value={appointmentData.location}
        label="Location"
        variant="filled"
      />
      <AppointmentForm.Label text="More infomation" type="title" />
      <AppointmentForm.TextEditor
        readOnly={true}
        fullWidth
        label="Note"
        variant="outlined"
        type="noteTextEditor"
        multiline
        rows={6}
        onValueChange={onNoteChange}
        value={appointmentData.note}
      />
      {/* <AppointmentForm.BasicLayout
          appointmentData={appointmentData}
          onFieldChange={onFieldChange}
          {...restProps}
        ></AppointmentForm.BasicLayout> */}
    </div>
  );
}

export default class MovieScheduler extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      currentDate: moment().toString(),
      movies: [],
      alertOpen: false,
      isLoading: true,
      room: {},
      isShiftPressed: false,
    };

    this.commitChanges = this.commitChanges.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.currentDateChange = (currentDate) => {
      this.setState({ currentDate });
    };
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }

  onKeyDown(event) {
    if (event.keyCode === SHIFT_KEY) {
      this.setState({ isShiftPressed: true });
    }
  }

  onKeyUp(event) {
    if (event.keyCode === SHIFT_KEY) {
      this.setState({ isShiftPressed: false });
    }
  }

  async componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    let movies, appointments, room;
    try {
      const getMovies = await axios.get(
        "https://fbk-api-gateway.herokuapp.com/movie"
      );
      if (getMovies.status === 200 || getMovies.status === 201) {
        movies = getMovies.data.data;
      } else {
        return;
      }
      const getAppointments = await axios.get(
        `https://fbk-api-gateway.herokuapp.com/screening/by-room?room_id=${urlParams.get(
          "id"
        )}`
      );
      if (getAppointments.status === 200 || getAppointments.status === 201) {
        appointments = getAppointments.data.data;
      } else {
        return;
      }
      const getRoom = await axios.get(
        "https://fbk-api-gateway.herokuapp.com/room"
      );

      if (getRoom.status === 200 || getRoom.status === 201) {
        room = getRoom.data.data.find(
          (room) => (room.room_id === +urlParams.get("id"))
        );
      } else {
        return;
      }

      this.setState({
        data: appointments.map((appointment) => ({
          ...appointment,
          title: appointment.movie.movie_name,
          startDate: moment(appointment.date + " " + appointment.started_at),
          endDate: moment(
            +moment(appointment.date + " " + appointment.started_at) +
              appointment.movie.duration * 60000
          ),
          id: appointment.screening_id,
          movie: appointment.movie.movie_id,
          location: "Screen " + room.room_name,
        })),
        movies: movies.filter(item => item.status !== 1),
        room: {
          roomId: room.room_id,
          roomName: "Screen " + room.room_name,
        },
        isLoading: false,
      });
    } catch (e) {}
  }

  commitChanges({ added, changed, deleted }) {
    const { roomId, roomName } = this.state.room;
    let { data, isShiftPressed } = this.state;
    if (added) {
      if (added.movie && added.startDate && added.endDate) {
        axios
          .post("https://fbk-api-gateway.herokuapp.com/screening/new", {
            movie_id: added.movie,
            date: moment(added.startDate).format("YYYY-MM-DD"),
            started_at: moment(added.startDate).format("HH:mm:ss"),
            room_id: roomId,
          })
          .then((response) => {
            console.log(response);
            if (response.status === 200 || response.status === 201) {
              const screening = response.data.data;

              const startingAddedId = screening.screening_id;
              this.setState({
                data: [
                  ...data,
                  {
                    ...screening,
                    title: screening.movie.movie_name,
                    startDate: moment(
                      screening.date + " " + screening.started_at
                    ),
                    endDate: moment(
                      +moment(screening.date + " " + screening.started_at) +
                        screening.movie.duration * 60000
                    ),
                    id: screening.screening_id,
                    movie: screening.movie.movie_id,
                    location: roomName,
                  },
                ],
              });
              console.log("added");
            }
            console.log("response");
            console.log(response);
          })
          .catch((error) => {
            console.log("Error");
            console.log(error);
          });
      } else {
        this.setState({ alertOpen: true });
      }
    }
    if (changed) {
      if (isShiftPressed) {
        const changedMovie = data.find(
          (movie) => changed[movie.id]
        );
        

        axios
          .post("https://fbk-api-gateway.herokuapp.com/screening/new", {
            movie_id: changedMovie.movie,
            date: moment(changed[changedMovie.id].startDate).format("YYYY-MM-DD"),
            started_at: moment(changed[changedMovie.id].startDate).format("HH:mm:ss"),
            room_id: roomId,
          })
          .then((response) => {
            if (response.status === 200 || response.status === 201) {
              const screening = response.data.data;
              const startingAddedId = screening.screening_id;
              this.setState({
                data: [
                  ...data,
                  {
                    ...screening,
                    title: screening.movie.movie_name,
                    startDate: moment(
                      screening.date + " " + screening.started_at
                    ),
                    endDate: moment(
                      +moment(screening.date + " " + screening.started_at) +
                        screening.movie.duration * 60000
                    ),
                    id: screening.screening_id,
                    movie: screening.movie.movie_id,
                    location: roomName,
                  },
                ],
              });
              console.log("added");
            }
            console.log("response");
            console.log(response);
          })
          .catch((error) => {
            console.log("Error");
            console.log(error);
          });
        // const startingAddedId =
        //   data.length > 0 ? data[data.length - 1].id + 1 : 0;
        // data = [
        //   ...data,
        //   {
        //     ...changedAppointment,
        //     id: startingAddedId,
        //     ...changed[changedAppointment.id]
        //   }
        // ];
      } else {
        
        data.forEach((item) => {
          if (changed[item.id]) {
            axios
              .post(
                "https://fbk-api-gateway.herokuapp.com/screening/update",
                {
                  id: item.id,
                  movie_id: changed[item.id].movie || item.movie,
                  date: moment(changed[item.id].startDate || item.startDate ).format("YYYY-MM-DD"),
                  room_id: roomId,
                  started_at: moment(changed[item.id].startDate || item.startDate ).format("HH:mm:ss"),
                }
              )
              .then((res) => {
                if (res.status === 200 || res.status === 201) {
                  console.log(res);
                  this.setState({
                    data: data.map((movie) =>
                      movie.id === item.id
                        ? {
                            ...movie,
                            ...changed[movie.id],
                          }
                        : movie
                    ),
                  });
                }
              })
              .catch((e) => {
                console.log(e.request.body);
              });
          }
        });
        // this.setState({data: data.map((appointment) =>
        //   changed[appointment.id]
        //     ? { ...appointment, ...changed[appointment.id] }
        //     : appointment
        // )});
        console.log("edit");
      }
    }
    if (deleted !== undefined) {
      axios.post('https://fbk-api-gateway.herokuapp.com/screening/del', {
        id: deleted
      }).then(res => {
        if (res.status === 200 || res.status === 201) {
          this.setState({
            data: data.filter((appointment) => appointment.id !== deleted),
          });
          console.log("delete");
        }
      }).catch(e => {console.log(e)});
    }
  }

  Header = withStyles(style, {
    name: "Header",
  })(({ children, appointmentData, classes, ...restProps }) => (
    <AppointmentTooltip.Header
      {...restProps}
      className={classNames(
        getClassByLocation(classes, appointmentData.location),
        classes.header
      )}
      style={{
        background: `url(${
          this.state.movies.find(
            (movie) => movie.movie_id === appointmentData.movie
          ).poster
        })`,
        backgroundSize: "100% 100%",
        height: 400,

      }}
      appointmentData={appointmentData}
    ></AppointmentTooltip.Header>
  ));

  Content = withStyles(style, { name: "Content" })(
    ({ children, appointmentData, classes, ...restProps }) => (
      <AppointmentTooltip.Content
        {...restProps}
        appointmentData={appointmentData}
        style={{

        }}
      >
        <Grid container alignItems="center">
          <Grid item xs={2} className={classes.textCenter}>
            <Room className={classes.icon} />
          </Grid>
          <Grid item xs={10}>
            <span>{appointmentData.location}</span>
          </Grid>
        </Grid>
      </AppointmentTooltip.Content>
    )
  );

  CommandButton = withStyles(style, {
    name: "CommandButton",
  })(({ classes, ...restProps }) => (
    <AppointmentTooltip.CommandButton
      {...restProps}
      className={classes.commandButton}
    />
  ));

  render() {
    const { currentDate, data } = this.state;
    console.log(this.state);

    if (this.state.isLoading) {
      return (
        <CircularProgress
          style={{ position: "fixed", top: "50%", left: "50%" }}
        />
      );
    }
    return (
      <Paper style={{position: 'fixed', top: 70}}>
        <Scheduler data={data} height={(window.screen.height * 85) / 100}>
          <ViewState
            // defaultCurrentDate="2018-07-25"
            defaultCurrentViewName="Week"
            currentDate={currentDate}
            onCurrentDateChange={this.currentDateChange}
          />
          <EditingState onCommitChanges={this.commitChanges} />
          <IntegratedEditing />
          <DayView startDayHour={9} endDayHour={24} />
          <WeekView startDayHour={9} endDayHour={24} />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <ViewSwitcher />
          <Appointments />
          <AppointmentTooltip
            showOpenButton
            showDeleteButton
            headerComponent={this.Header}
            contentComponent={this.Content}
            commandButtonComponent={this.CommandButton}
            showCloseButton
          />
          <ConfirmationDialog />
          <AppointmentForm
            basicLayoutComponent={(props) => (
              <BasicLayout
                roomName={this.state.room.roomName}
                movies={this.state.movies}
                {...props}
              />
            )}
            // textEditorComponent={TextEditor}
            // messages={messages}
          />
          <DragDropProvider allowDrag={() => true} allowResize={() => false} />
        </Scheduler>
        <Dialog
          open={this.state.alertOpen}
          onClose={() => this.setState({ alertOpen: false })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Something wrong!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Unsuccessful, Please filled all informations before save
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ alertOpen: false })}
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}
