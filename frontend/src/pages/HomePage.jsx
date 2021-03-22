import React, { Component } from "react";
import HomeContent from "../components/HomeContent/homeContent";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setStatus,
  setLogging,
  setRegistering,
  setUserEmail,
  setLogin_dialog,
  setRegister_dialog
} from "../actions/HomePage";
import logo from "../resources/logo.png";
import { AppBar, Toolbar, Button, Typography, Paper, ListItemText } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import EmailIcon from '@material-ui/icons/Email';
import { VpnKey, Person } from '@material-ui/icons';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import axios from "axios";
import moment from "moment";
import { Formik } from "formik";
import * as yup from "yup";
import Popover from '@material-ui/core/Popover';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { API_ROOT_POST, LOGIN_ADDRESS } from "../data/urls";
import CreateListingButton from "../components/CreateListing/CreateListingButton";

import "../styles/HomePage.css"

class HomePage extends Component {
  state = {
    anchorEl: null,
    menuOpen: false,
    registerMessage: false,
    registerSuccess: false,
    loginSuccess: false,
    loginMessage: false,
    loginError: false
  }

  componentDidMount() {
    this.props.setRegistering(false)
    this.props.setLogging(false)
    this.props.setRegister_dialog(false)
    this.props.setLogin_dialog(false)
  }

  render() {
    return (
      <div
        className="homePage"
      >
        <AppBar
          id="homePage_Header"
          position="sticky"
        >
          <Toolbar>

            {/* this is our rentr logo */}
            <img
              id="logo"
              src={logo}
              alt="Rentr Logo"
            />

            {/* this is used to add the space between the logo and sign in button */}
            <Typography
              type="title"
              color="inherit"
              style={{
                flex: 1
              }}
            />
            {!this.props.cookies.get("status")
              ?
              (
                <React.Fragment>
                  <Button
                    className="homePage_Header_Login"
                    id="homePage_Header_Login"
                    variant="contained"
                    onClick={() => {
                      this.props.setLogin_dialog(true)
                      this.props.setRegister_dialog(false)
                    }}
                  >
                    Log In
                  </Button>

                  {this.handleShowLogInDialog()}
                  {this.handleShowRegisterDialog()}
                </React.Fragment>
              )
              :
              this.handleShowLoggedIn()
            }
            <Button
              onClick = {()=>{console.log(this.props.cookies.get("status"))}}
            >
              Click
            </Button>
          </Toolbar>

        </AppBar>
        <HomeContent />
      </div>
    )
  }

  handleShowLogInDialog = () => {
    return (
      <Dialog
        disableBackdropClick
        id="loginDialog"
        open={this.props.loginDialogOpen}
        onClose={() => {
          this.resetDialogsStatus()
        }}
        style={{
          margin: "auto",
          width: "500px"
        }}
      >
        {this.handleLoginMessage()}
        <DialogTitle className="homeDialog-title">
          Login
          <IconButton
            className="homeDialog-title-closeButton"
            disabled = {this.props.logging}
            onClick={() => {
              this.resetDialogsStatus()
            }}
          >
            <CloseIcon/>
          </IconButton>
        </DialogTitle>

        <DialogContent className="homeDialog-Content">
          <Formik
            initialValues={{ loginEmail: "", loginPassword: "" }}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(false)
              this.props.setLogging(true)
              axios({
                method: "post",
                url: LOGIN_ADDRESS,
                data: {
                  "email": values.loginEmail.trim(),
                  "password": values.loginPassword.trim()
                }
              })
              .then(response =>{
                if (response.data 
                  && response.data.message
                  && response.data.message === "Login successful."){
                  // then we're logged in successfully
                  this.setState({
                    loginMessage: true,
                    loginSuccess: true,
                    loginError: false
                  })
                  setTimeout(() => {
                    this.resetDialogsStatus()
                    this.props.setStatus({
                      status: true,
                      token: response.data.token
                    })
                    this.props.setLogging(false)
                  }, 5000);
                }
                else{
                  this.props.setStatus({
                    status: false
                  })
                  this.setState({
                    loginMessage: true,
                    loginSuccess: false,
                    loginError: false
                  })
                  this.props.setLogging(false)
                }
              })
              .catch(error =>{
                console.log(error)
                this.props.setStatus({
                  status: false
                })
                this.setState({
                  loginMessage: true,
                  loginSuccess: false,
                  loginError: true
                })
                this.props.setLogging(false)
              })
            }}
            validationSchema={yup.object().shape({
              loginEmail: yup
                .string('Enter your email')
                .email('Enter a valid email')
                .required('Email is required'),
              loginPassword: yup
                .string('Enter your password')
                .required('Password is required'),
            })}
          >
            {props => {
              const {
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit
              } = props;
              return (
                <form onSubmit={handleSubmit}>
                  <div className="homeDialog-textContent">

                    <div className="homeDialog-textFieldIcon"><EmailIcon /></div>
                    <TextField
                      variant="outlined"
                      margin="dense"
                      id="loginEmail"
                      name="loginEmail"
                      className="emailField"
                      label="sample@email.com"
                      type="email"
                      value={values.loginEmail}
                      disabled = {this.props.logging}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.loginEmail && Boolean(errors.loginEmail)}
                      helperText={touched.loginEmail && errors.loginEmail}
                    />

                  </div>

                  <div className="homeDialog-textContent">

                    <div className="homeDialog-textFieldIcon"><VpnKey /></div>

                    <TextField
                      variant="outlined"
                      margin="dense"
                      id="loginPassword"
                      name="loginPassword"
                      className="passwordField"
                      label="password"
                      type="password"
                      value={values.loginPassword}
                      disabled = {this.props.logging}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.loginPassword && Boolean(errors.loginPassword)}
                      helperText={touched.loginPassword && errors.loginPassword}
                    />

                  </div>

                  <DialogActions className="homeDialog-Actions">
                    <Button
                      className={
                        this.props.logging
                          ? "homeDialog-inProgressButton"
                          : "homeDialog-normalButton"
                      }
                      type="submit"
                      disabled = {this.props.logging}
                    >
                      {this.props.logging ? "Logging In" : "Login"}
                    </Button>
                    <div style={{ flex: '1 0 0' }} />
                    <Button
                      onClick={this.handleClickRegister}
                      className={
                        this.props.logging
                          ? "homeDialog-inProgressNewUserButton"
                          : "homeDialog-newUserButton"
                      }
                      disabled = {this.props.logging}
                    >
                      <div>
                        Don't have an account?
                        <br />
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 600
                          }}
                        >
                          Register!
                        </div>
                      </div>
                    </Button>
                  </DialogActions>

                </form>
              )
            }}
          </Formik>
        </DialogContent>

      </Dialog>
    )
  }

  handleShowRegisterDialog = () => {
    return (
      <Dialog
        open={this.props.registerDialogOpen}
        disableBackdropClick
        onClose={() => {
          this.resetDialogsStatus()
        }}
        style={{
          margin: "auto",
          width: "500px"
        }}
      >
        {this.handleRegisterMessage()}
        <DialogTitle className="homeDialog-title">
          Register
          <IconButton
            className="homeDialog-title-closeButton"
            disabled={this.props.registering}
            onClick={() => {
              this.resetDialogsStatus()
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          className="homeDialog-Content"
        >
          <Formik
            initialValues={{ registerEmail: "", registerPassword: "", registerPassword_confirmed: "" }}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true)
              this.props.setRegistering(true)
              console.log(this.props.registering)
              const url = String(API_ROOT_POST).concat("user/registration");
              let content = {
                email: String(values.registerEmail),
                password: String(values.registerPassword)
              }
              axios.post(url, content)
                .then(response => {
                  // If the account is registered successfully
                  if (response.data && response.data.userId) {
                    this.setState({
                      registerSuccess: true,
                      registerMessage: true
                    })
                    setTimeout(() => {
                      this.resetDialogsStatus()
                      this.props.setRegistering(false)
                    }, 5000);
                  }
                  // If the account is registered NOT successfully
                  else {
                    this.setState({
                      registerSuccess: false,
                      registerMessage: true
                    })
                    this.props.setRegistering(false)
                  }
                  this.props.setStatus({
                    status: false
                  })
                })
                // If the account is registered NOT successfully
                .catch(error => {
                  this.props.setStatus({
                    status: false
                  })
                  this.setState({
                    registerMessage: true,
                    registerSuccess: false
                  })
                  this.props.setRegistering(false)
                  console.log(error)
                })
            }}
            validationSchema={yup.object().shape({
              registerEmail: yup
                .string('Enter your email')
                .email('Enter a valid email')
                .required('Email is required'),
              registerPassword: yup
                .string('Enter your password')
                .required('Password is required'),
              registerPassword_confirmed: yup
                .string('Enter your password')
                .required('Password is required')
                .test(
                  "match",
                  "Passwords do not match", // your error message
                  function () {
                    return this.parent.registerPassword === this.parent.registerPassword_confirmed;
                  }
                )
            })}
          >
            {props => {
              const {
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit
              } = props;
              return (
                <form onSubmit={handleSubmit}>
                  <div className="homeDialog-textContent">

                    <div className="homeDialog-textFieldIcon"><EmailIcon /></div>
                    <TextField
                      variant="outlined"
                      margin="dense"
                      id="registerEmail"
                      name="registerEmail"
                      className="emailField"
                      label="sample@email.com"
                      type="email"
                      value={values.registerEmail}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.registerEmail && Boolean(errors.registerEmail)}
                      helperText={touched.registerEmail && errors.registerEmail}
                    />

                  </div>

                  <div className="homeDialog-textContent">

                    <div className="homeDialog-textFieldIcon"><VpnKey /></div>
                    <TextField
                      variant="outlined"
                      margin="dense"
                      id="registerPassword"
                      name="registerPassword"
                      className="passwordField"
                      label="password"
                      type="password"
                      value={values.registerPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.registerPassword && Boolean(errors.registerPassword)}
                      helperText={touched.registerPassword && errors.registerPassword}
                    />

                  </div>

                  <div className="homeDialog-textContent">

                    <div className="homeDialog-textFieldIcon"><VpnKey /></div>
                    <TextField
                      variant="outlined"
                      margin="dense"
                      id="registerPassword_confirmed"
                      name="registerPassword_confirmed"
                      className="confirmed_passwordField"
                      label="re-enter password"
                      type="password"
                      value={values.registerPassword_confirmed}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.registerPassword_confirmed && Boolean(errors.registerPassword_confirmed)}
                      helperText={touched.registerPassword_confirmed && errors.registerPassword_confirmed}
                    />

                  </div>



                  <DialogActions
                    className="homeDialog-Actions"
                  >
                    <Button
                      className={
                        this.props.registering
                          ? "homeDialog-inProgressButton"
                          : "homeDialog-normalButton"
                      }
                      type="submit"
                      disabled={this.props.registering}
                    >
                      {this.props.registering ? 'Registering' : 'Register'}
                    </Button>

                    <div style={{ flex: '1 0 0' }} />

                    <Button
                      className={
                        this.props.registering
                          ? "homeDialog-inProgressButton"
                          : "homeDialog-normalButton"
                      }
                      onClick={this.handleClickCancel}
                      disabled={this.props.registering}
                    >
                      cancel
                    </Button>

                  </DialogActions>
                </form>
              )
            }}
          </Formik>
        </DialogContent>
      </Dialog>
    )
  }

  handleShowLoggedIn = () => {
    const open = Boolean(this.state.anchorEl);
    return (
      <React.Fragment>
        <CreateListingButton />
        <Button
          onClick={(event) => this.handleOpenPopover(event)}
          style={{
            color: "white"
          }}
        >
          <Person
            fontSize="large"
            style={{
              paddingRight: 10
            }}
          />
          {this.handleGreeting()}
        </Button>

        <Popover
          open={open}
          anchorEl={this.state.anchorEl}
          onClose={this.handleClosePopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <ClickAwayListener onClickAway={this.handleClosePopover}>
            <Paper>
              <MenuList>
                {/* This is for the logout function */}
                <MenuItem onClick={this.handleProfile}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>

                <MenuItem onClick={this.handleLogout}>
                  <ListItemIcon>
                    <ExitToAppIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Log Out</ListItemText>
                </MenuItem>
              </MenuList>
            </Paper>
          </ClickAwayListener>
        </Popover>
      </React.Fragment>
    )
  }

  handleProfile = () =>{

  }

  handleLoginMessage = () => {
    let alertMessage ;
    if (this.state.loginSuccess){
      alertMessage = (
        <MuiAlert elevation={6} variant="filled" onClose={this.handleCloseLoginSnackBar} severity="success">
          Welcome home, you will be taken back to home page shortly.
        </MuiAlert>
      )
    }
    else if (!this.state.loginSuccess && !this.state.loginError){
      alertMessage = (
        <MuiAlert elevation={6} variant="filled" onClose={this.handleCloseLoginSnackBar} severity="error">
          Incorrect email and password combination is entered
        </MuiAlert>
      )
    }
    else if (!this.state.loginSuccess && this.state.loginError){
      alertMessage = (
        <MuiAlert elevation={6} variant="filled" onClose={this.handleCloseLoginSnackBar} severity="warning">
          This email have not been registered yet
        </MuiAlert>
      )
    }
    return (
      <Snackbar
        open={this.state.loginMessage} 
        autoHideDuration={6000} 
        onClose={this.handleCloseLoginSnackBar}
      >
        {alertMessage}
      </Snackbar>
    )
  }

  handleCloseLoginSnackBar = (event, reason) => {
    if (reason === "clickaway")
      return
    this.setState({
      loginMessage: false
    })
  }

  handleRegisterMessage = () => {
    return (
      <Snackbar open={this.state.registerMessage} autoHideDuration={6000} onClose={this.handleCloseRegisterSnackBar}>
        {this.state.registerSuccess
          ? (
            <MuiAlert elevation={6} variant="filled" onClose={this.handleCloseRegisterSnackBar} severity="success">
              Your account is registered successfully, you'll be taken back to homePage shortly.
            </MuiAlert>
          )
          :
          (
            <MuiAlert elevation={6} variant="filled" onClose={this.handleCloseRegisterSnackBar} severity="error">
              Account with current email has already been registered
            </MuiAlert>
          )
        }
      </Snackbar>
    )
  }

  handleCloseRegisterSnackBar = (event, reason) => {
    if (reason === "clickaway")
      return
    this.setState({
      registerMessage: false
    })
  }

  handleLogout = () => {
    this.setState({
      anchorEl: null
    })
    this.props.setStatus({
      status: false
    })
    this.resetDialogsStatus()
  }

  handleOpenPopover = (event) => {
    this.setState({
      anchorEl: event.currentTarget
    })
  }

  handleClosePopover = () => {
    this.setState({
      anchorEl: null
    })
  }

  handleGreeting = () => {
    let currMoment = new moment().format("HH");

    const afternoon = 12;
    const evening = 18;

    let greeting = "";

    if (currMoment >= afternoon && currMoment <= evening) {
      greeting = "Good afternoon"
    }
    else if (currMoment >= evening) {
      greeting = "Good evening"
    }
    else {
      greeting = "Good morning"
    }
    return greeting
  }

  handleClickRegister = () => {
    this.props.setLogin_dialog(false);
    this.props.setRegister_dialog(true);
  }

  handleClickCancel = () => {
    this.resetDialogsStatus();
  }

  resetDialogsStatus = () => {
    this.props.setLogin_dialog(false);
    this.props.setRegister_dialog(false);
    this.setState({
      menuOpen: false,
      registerMessage: false,
      registerSuccess: false,
      loginSuccess: false,
      loginMessage: false,
      loginError: false
    })
  }

}

//REDUX
const mapStateToProps = state => {
  return {
    userEmail: state.homeContent.userEmail,
    logging: state.homeContent.logging,
    registering: state.homeContent.registering,
    loginDialogOpen: state.homeContent.loginDialogOpen,
    registerDialogOpen: state.homeContent.registerDialogOpen,
    status: state.homeContent.status,
    cookies: state.homeContent.cookies,
  };
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setStatus,
    setLogging,
    setRegistering,
    setUserEmail,
    setLogin_dialog,
    setRegister_dialog
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(HomePage);
