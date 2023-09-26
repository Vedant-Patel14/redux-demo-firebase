import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authenticate } from "../redux/reducers/authSlice";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { app } from "../firebase/firebase";
import { Button } from "@mui/material";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import { Helmet } from "react-helmet";

const useStyles = makeStyles(() => ({
  App: {
    fontFamily: "sans-serif",
    textAlign: "center",
    height: "100vh",
    width: "100%",
  },
  loginForm: {
    width: "calc(340px - 50px)",
    border: "solid 1px #f9f9f9",
    margin: "auto",
    padding: "20px 15px",
    background: "#b88bf72f",
    marginTop: "50px",
    textAlign: "left",
    borderRadius: "10px",
  },
  formTitle: {
    color: "#000000",
    marginTop: "0",
    marginBottom: "15px",
    textAlign: "center",
  },
  formControl: {
    marginBottom: "15px",
    fontSize: "15px",
    width: "100%",
  },
  formControlInput: {
    width: "100%",
    fontSize: "15px",
    height: "20px",
    padding: "0px 2px",
  },
  "login-btn": {
    height: "27px",
    padding: "3px 10px 5px 6px",
    marginTop: "12px",
  },
  "button-container": {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const Login = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const users = useSelector((state) => state.registration.users);
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  console.log("auth", auth);

  const userRef = async (uid, email, displayName, photoURL, phoneNumber) => {
    const userDocRef = doc(firestore, "users", uid);
    try {
      const userDocSnapshot = await getDoc(userDocRef);
      if (!userDocSnapshot.exists()) {
        const result = await setDoc(userDocRef, {
          uid: uid,
          email: email,
          displayName: displayName,
          photoURL: photoURL,
          phoneNumber: phoneNumber,
        });
        console.log("Document added successfully:", result);
      } else {
        console.log(
          "User document with UID",
          uid,
          "already exists. Skipping document creation."
        );
      }
    } catch (error) {
      console.log("Error adding/checking user document:", error);
    }
  };

  const signinUser = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch(authenticate({ user }));
        userRef(
          user.uid,
          user.email,
          user.displayName,
          user.photoURL,
          user.phoneNumber
        );
        console.log("Sign in success");
        navigate("/");
      })
      .catch((error) => {
        console.log("Sign in error:", error);
      });
  };

  const signinWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    signInWithPopup(auth, googleProvider)
      .then((userCredential) => {
        const googleUser = userCredential.user;
        dispatch(authenticate({ user: googleUser }));
        userRef(
          googleUser.uid,
          googleUser.email,
          googleUser.displayName,
          googleUser.photoURL,
          googleUser.phoneNumber
        );
        console.log("googleUser", googleUser);
        console.log("Google Sign in success");
        navigate("/");
      })
      .catch((error) => {
        console.log("Google Sign in error:", error);
      });
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <>
      <Helmet>
        <title>Login page</title>
      </Helmet>
      <div className={classes.App}>
        <div className={classes.loginForm}>
          <h4 className={classes.formTitle}>Login</h4>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={classes.formControl}
            />
            <input
              type="password"
              placeholder="Enter password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={classes.formControlInput}
            />
            <div className={classes["button-container"]}>
              <Button
                variant="contained"
                className={classes["login-btn"]}
                onClick={signinUser}
                style={{ marginTop: "11px" }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                style={{ marginTop: "12px", height: "26px" }}
                onClick={handleHome}
              >
                Home
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                onClick={signinWithGoogle}
                style={{ width: "100%", marginTop: "10px", height: "30px" }}
              >
                Sign In With Google
              </Button>
            </div>
            <p style={{ marginTop: "12px", fontSize: "17px" }}>
              Don't have an account? <a href="/registration">Register here</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
