import React, { useState, useEffect } from "react";
import { Card, TextField, Button, Grid, Snackbar } from "@mui/material";
import Navbar from "../component/navbar";
import FormControl from "@mui/material/FormControl";
import { db, storage } from "../firebase/firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Helmet } from "react-helmet";

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

  const [successMessage, setSuccessMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (currentUser) {
      const uid = currentUser.uid;
      const userRef = doc(db, "users", uid);
      getDoc(userRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            userData.phoneNumber = userData.phoneNumber;
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
  }, [currentUser]);

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setSelectedImage(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    }
  };

  const handleCancel = () => {
    setSelectedImage(null);
    setPreviewImage("");
  };

  const handleFormSubmit = async () => {
    const uid = currentUser.uid;
    const userRef = doc(db, "users", uid);

    try {
      if (selectedImage) {
        console.log("Uploading image...");
        const storageRef = ref(storage, `profile_images/${uid}/${uid}`);
        const snapshot = await uploadBytes(storageRef, selectedImage);
        const imageUrl = await getDownloadURL(snapshot.ref);

        console.log("Image uploaded. URL:", imageUrl);
        await updateDoc(userRef, {
          displayName: userData.displayName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          photoURL: imageUrl,
        });

        console.log("Data successfully updated!");
        setSuccessMessage("Data successfully updated!");
        setUserData({ ...userData, photoURL: imageUrl });
        setSelectedImage(null);
        setPreviewImage("");
      } else {
        await updateDoc(userRef, {
          displayName: userData.displayName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          photoURL: userData.photoURL || "",
        });
        console.log("Data successfully updated!");
        setSuccessMessage("Data successfully updated!");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Profile page</title>
      </Helmet>
      <div className="container">
        <Navbar />
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <Grid item xs={12} sm={6} md={4} xxl={3}>
            <Card style={{ padding: "50px" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={previewImage || userData.photoURL}
                  alt="User Profile"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCancel}
                disabled={!selectedImage}
              >
                Cancel
              </Button>
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
                  <div>
                    <input
                      type="file"
                      id="imageInput"
                      accept="image/*"
                      style={{ marginBottom: "10px" }}
                      onChange={handleImageChange}
                    />
                  </div>
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
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={!!successMessage}
          autoHideDuration={4000}
          onClose={() => setSuccessMessage("")}
          message={successMessage}
        />
      </div>
    </>
  );
};

export default Profile;
