import React from "react";
import "../../App.css";

var Name;
var Surname;
var Location;

class Profile extends React.Component {

    // Profile Form

    render() {

        // Set Name from Database
        Name = "Meister";
        Surname = "Yoda";
        Location = "Space";


        return(

            <div style={profileForm}>

                <img src="./images/profilePic.png"  style={profileImg}/>
            
                <div id="Bio">
                    <p> {Name} <br/> 
                        {Surname}
                    </p>
                    <p>
                       From: {Location}
                    </p>
                </div>
            </div>
        );
    }
}

const profileForm = {
    position: "fixed",
    height: "600px",
    width: "600px",
    top: "20%",
    left: "10%",
    fontFamily: "Libre Baskerville , serif",
    padding: "20px",
    fontSize: "large",
    
  };

const  profileImg = {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "red"
  };

export default Profile;