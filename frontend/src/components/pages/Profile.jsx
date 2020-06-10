import React from "react";
import "../../App.css";

let username;
let followerAmount;
let name;
let surname;
let location;
let lastStop;
let nextStop;
let bio;

class Profile extends React.Component {

    // Profile Form

    render() {

        // Set Name from Database
        username = "mafacka6969";
        followerAmount = 1;
        name = "Meister";
        surname = "Yoda";
        location = "Space";
        lastStop = "4te Dimension";
        nextStop = "Mos Eisley Cantina";
        bio = "Stark in dir die Macht ist, ich spüre."


        return(
            // Container for profile description
            <table style={profileForm}>

                <tr>
                    <td style={topLeftStyle} id="top-left">
                        <img src="./images/profilePic.png"  style={profileImg}/>
                    
                       
                            <p style={usernameStyle}> {username} </p>
                            <p> {followerAmount} {followerAmount == 1 ? 'Follower' : 'Followers'} </p>
                    
                    </td>
                

                    <td style={topRightStyle} id="top-right">
                        <p style={usernameStyle}>{name} {surname}</p>
                        <p>currently in <i>{location}</i></p>
                        <p>last stop <i>{lastStop}</i></p>
                        <p>next stop <i>{nextStop}</i></p>
                        <p></p>
                        <p><i>"{bio}"</i></p>
                    </td>
                </tr>
                <hr></hr>
                <tr>
                    <td style={downStyle}>
                        <p>CHRONIC</p>
                        <p>TRIPS</p>
                    </td>
                    <td style={downStyle}>
                        Geile Blogs und so
                    </td>
                </tr>
            </table>
        );
    }
}

const profileForm = {
    left: "20%",
    fontFamily: "Arial , serif",
    padding: "50px",
    fontSize: 14,
    position: "absolute",
    marginTop: 120
  };

const topLeftStyle = {
    width: "25%",
    padding: "50px",
    marginTop: "250px"
  };
  
const topRightStyle = {
    width: "75%",
    padding: "50px"
};

const  profileImg = {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "red"
  };

  const usernameStyle = {
      fontWeight: 666
  };

  const downStyle = {
        padding: "50px"
  };

export default Profile;