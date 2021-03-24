import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setPersonalDialogStatus,
  setPersonalListingArray
} from "../../actions/Profile";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Snackbar,
  ListItemText,
  ListItemIcon,
  Paper,
  Tooltip,
  Typography,
  Divider
} from "@material-ui/core"
import MuiAlert from '@material-ui/lab/Alert';

import CloseIcon from '@material-ui/icons/Close';
import BathtubIcon from '@material-ui/icons/Bathtub';
import HotelIcon from '@material-ui/icons/Hotel';
import LocalLaundryServiceIcon from '@material-ui/icons/LocalLaundryService';
import PetsIcon from '@material-ui/icons/Pets';
import ApartmentIcon from '@material-ui/icons/Apartment';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LocalParkingIcon from '@material-ui/icons/LocalParking';

import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import {RefreshLoader} from "../RefreshLoader";
import {API_ROOT_GET} from "../../data/urls";

import "../../styles/HomePage.css"
import "../../styles/Profile.css"



class Profile extends Component {

  componentDidMount (){
    this.resetDialogStatus()
  }

  componentWillUnmount(){
    this.resetDialogStatus()
  }

  render(){
    return(
      <div className = "profileIcon-dialog">
        <MenuItem onClick = {()=>{
          this.props.setPersonalDialogStatus(true)
          this.fetchListings()
        }}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        <Dialog
          open = {this.props.dialogStatus}
          onClose = {this.resetDialogStatus}
          maxWidth = "lg"
        >
          <DialogTitle className="profile-title">
            My Listings
            <IconButton
              className="profile-title-closeButton"
              onClick={this.resetDialogStatus}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {
              this.props.profileListingArray && this.props.profileListingArray.length !== 0
              ?
                this.props.profileListingArray.map((listingDetail, index) =>{
                  return (
                    <Paper
                      key = {index}
                      elevation = {3}
                      style = {{
                        width: "100%",
                        minWidth: 600,
                        height: 150,
                        marginTop: 16,
                        marginBottom: 16
                      }}
                      className = "individualListingContent"
                    >
                      <span className = "listingImageArea">
                        {this.checkImageValid(listingDetail.images[0])
                          ?
                            <img
                              style = {{
                                width: "100%",
                                height: "100%"
                              }}
                              src={listingDetail.images[0]}
                              alt="apartment"
                            />
                          :
                            <ApartmentIcon
                              style = {{
                                width: "100%",
                                height: "100%",
                                color: "lightgray"
                              }}
                              alt="apartment"
                            />
                        }
                      </span>
                      <div className = "listingTextAndIcon">
                        <span className = "listingHeader">
                        
                          {/* This is for the listing title area */}
                          <span className = "listingTitle">
                            {listingDetail.title}
                          </span>

                          <Typography
                            type="title"
                            color="inherit" 
                            style={{
                              flex: 1 
                            }}
                          />
                    
                          {/* This is for the listing icon area */}
                          <span className = "listingIconGroup">
                            {/* number of washrooms*/}
                            <span className = "listingIconNumber">
                              {listingDetail.num_bathroom}
                              <Tooltip title = "Washroom">
                                <BathtubIcon className = "listingIcon" fontSize = "large"/>
                              </Tooltip>
                            </span>

                            {/* Number of bedrooms */}
                            <span className = "listingIconNumber">
                              {listingDetail.num_bedroom}
                              <Tooltip title = "Bedroom">
                                <HotelIcon className = "listingIcon" fontSize = "large"/>
                              </Tooltip>
                            </span>
                            
                            {/* Number of laundry rooms */}
                            <span className = "listingIconNumber">
                              {
                                listingDetail.is_laundry_available
                                ?
                                <Tooltip title = "Laundry Room is available">
                                  <LocalLaundryServiceIcon 
                                    style = {{color: "green"}}
                                    className = "listingIcon" 
                                    fontSize = "large"
                                  />
                                </Tooltip>
                                :
                                <Tooltip title = "Laundry Room not available">
                                  <LocalLaundryServiceIcon
                                    style = {{color: "grey"}}
                                    className = "listingIcon" 
                                    fontSize = "large"
                                  />
                                </Tooltip>
                              }
                            </span>
                            
                            {/* Indicate whether pets allowed or not */}
                            <span>
                              {
                                listingDetail.is_pet_allowed 
                                ? 
                                <Tooltip title = "Pet allowed">
                                  <PetsIcon
                                    style = {{color: "green"}}
                                    className = "listingIconNumber"
                                  />
                                </Tooltip>
                                :
                                <Tooltip title = "Pet NOT allowed">
                                  <PetsIcon
                                    style = {{color: "grey"}}
                                    className = "listingIconNumber"
                                  />
                                </Tooltip>
                              }
                            </span>
                            
                            {/* Indicate whether parking included or not */}
                            <span>
                              {
                                listingDetail.is_parking_available 
                                ? 
                                <Tooltip title = "Parking is included">
                                  <LocalParkingIcon
                                    style = {{color: "green"}}
                                    className = "listingIconNumber"
                                  />
                                </Tooltip>
                                :
                                <Tooltip title = "Parking NOT included">
                                  <LocalParkingIcon
                                    style = {{color: "grey"}}
                                    className = "listingIconNumber"
                                  />
                                </Tooltip>
                              }
                            </span>

                          </span>
                          
                          <Divider orientation="vertical" flexItem />

                          <div
                            className = "listingPrice"
                          >
                            ${this.checkPrice(listingDetail.price)}
                          </div>

                        </span>

                        <Divider/>

                        <div className = "listingDescription">
                          {listingDetail.description}
                        </div>

                      </div>
                      <Divider orientation="vertical" flexItem />
                      <div className = "removeListingButton">
                        <Tooltip title = "Remove listing from your account">
                          <IconButton
                            className="profile-title-closeButton"
                            onClick={(e)=>{
                              this.removeListing(e, index)
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </Paper>
                  )
                })
              :
                <Paper
                  elevation = {3}
                  style = {{
                    width: "auto",
                    minWidth: 600,
                    height: 150,
                    marginTop: 16,
                    marginBottom: 16
                  }}
                >
                  <RefreshLoader area = "fetchPersonalList"/>
                </Paper>
            }
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  removeListing = (event, index) =>{
    const url = ""
    const content = {
      
    }
    // axios.post(url, content)
    // .then(response =>{
    //   if (response.status === 200){

    //   }
    //   else{

    //   }
    // })
    // .catch(error =>{
    //   console.log(error)
    // })
  }

  checkPrice = (priceString) =>{
    let newPrice = ""
    if (String(priceString).trim().length >= 7){
      newPrice = parseInt(priceString) / 1000000
      newPrice = String(newPrice).concat("M")
    }
    else if (String(priceString).trim().length >= 5){
      newPrice = parseInt(priceString) / 1000
      newPrice = String(newPrice).concat("K")
    }
    else{
      newPrice = priceString
    }
    return newPrice
  }

  checkImageValid = (imgString) =>{
    let standard = new RegExp("^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$")
    let newString;
    if (String(imgString).includes("data:image/jpeg;base64,")){
      newString = String(imgString).replace("data:image/jpeg;base64,", "")
    }
    else if (String(imgString).includes("data:image/gif;base64,")){
      newString = String(imgString).replace("data:image/gif;base64,", "")
    }
    else if (String(imgString).includes("data:image/png;base64,")){
      newString = String(imgString).replace("data:image/png;base64,", "")
    }
    else{
      return false
    }
    return standard.test(newString)
  }

  fetchListings = () =>{
    // this function should return all the listings associated with a user
    // axios.get()
    // .then(response=>{
      
    // })
    const url = String(API_ROOT_GET).concat("listing")
    trackPromise(
      axios.get(url)
      .then(response =>{
        this.props.setPersonalListingArray(response.data)
      })
    , "fetchPersonalList")
  }

  resetDialogStatus = () =>{
    this.props.setPersonalDialogStatus(false)
    this.props.setPersonalListingArray([])
  }
}

//REDUX
const mapStateToProps = state => {
  return {
    dialogStatus: state.profile.dialogStatus,
    profileListingArray: state.profile.profileListingArray,
    cookies: state.homeContent.cookies,
  };
};

const matchDispatchToProps = dispatch => {
  return bindActionCreators({
    setPersonalDialogStatus,
    setPersonalListingArray
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Profile);