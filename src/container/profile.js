import React, { useState, useEffect } from "react";
import { Card, TextField, Button, Grid } from "@mui/material";
import Navbar from "../component/navbar";
import FormControl from "@mui/material/FormControl";
import { db } from "../firebase/firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";

const Profile = () => {
  const defaultImageUrl =
    "https://cdn-icons-png.flaticon.com/512/6596/6596121.png";

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    uid: "",
    photoURL: "",
  });
  const { currentUser } = getAuth();

  useEffect(() => {
    if (currentUser) {
      const uid = currentUser.uid;

      const userRef = doc(db, "users", uid);

      getDoc(userRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            userData.phoneNumber = userData.phoneNumber || "no number" ;
            userData.photoURL = userData.photoURL || defaultImageUrl;
            setUserData(userData);
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
        });
    }
  }, []);

  const handleFormSubmit = async () => {
    const uid = currentUser.uid;
    const userRef = doc(db, "users", uid);
    try {
      await updateDoc(userRef, {
        displayName: userData.displayName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
      });
      console.log("Data successfully updated!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Grid item xs={12} sm={6} md={4} xxl={3}>
          <Card style={{ padding: "50px" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={userData.photoURL}
                alt="User Profile"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                }}
              />
            </div>
            <div>
              <FormControl
                variant="outlined"
                sx={{
                  marginTop: 2,
                  marginBottom: 2,
                  border: "2px solid black",
                  padding: "25px",
                }}
              >
                <p style={{ padding: 0, margin: 0 }}>Name:</p>
                <TextField
                  id="name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={userData.displayName}
                  sx={{ marginBottom: 2 }}
                  onChange={(e) =>
                    setUserData({ ...userData, displayName: e.target.value })
                  }
                />
                <p style={{ padding: 0, margin: 0 }}>Email:</p>
                <TextField
                  id="email"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={userData.email}
                  sx={{ marginBottom: 2 }}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                />
                <p style={{ padding: 0, margin: 0 }}>PhoneNumber:</p>
                <TextField
                  id="phoneNumber"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={userData.phoneNumber}
                  sx={{ marginBottom: 2 }}
                  onChange={(e) =>
                    setUserData({ ...userData, phoneNumber: e.target.value })
                  }
                />
                <p style={{ padding: 0, margin: 0 }}>uid:</p>
                <TextField
                  id="uid"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={userData.uid}
                  sx={{ marginBottom: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFormSubmit}
                >
                  Submit
                </Button>
              </FormControl>
            </div>
          </Card>
        </Grid>
      </div>
    </div>
  );
};

export default Profile;
