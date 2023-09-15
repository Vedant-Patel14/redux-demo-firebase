import React, {  useState } from "react";
import { makeStyles } from "@mui/styles";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/reducers/registrationSlice";
import { useFormik } from "formik";
import { signUpSchema } from "../schemas";
import {getAuth , createUserWithEmailAndPassword , GoogleAuthProvider , signInWithPopup} from "firebase/auth";
import {app } from "../firebase/firebase";
import { Button } from "@mui/material";

const useStyles = makeStyles(() => ({
  app: {
    fontFamily: "sans-serif",
    textAlign: "center",
    height: "100vh",
    width: "100%",
  },
  registration: {
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
    border: "none",
    fontSize: "15px",
    height: "20px",
    padding: "0px 4px",
  },
  loginBtn: {
    height: "26px",
    padding: "3px 10px 5px 6px",
    marginTop: "12px",
  },
}));

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
const Registration = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [registrationError, setRegistrationError] = useState(null);

  const auth = getAuth(app)
  const googleProvider = new GoogleAuthProvider();

  const signupUser = async () => {
    try {
      const {  email, password } = values;
       const response = await createUserWithEmailAndPassword(auth, email, password);
       console.log(response)
      navigate("/login");
    } catch (error) {
      console.error(error);
      setRegistrationError(error.message);
    }
  };

  const signupWithGoggle = () => {
    signInWithPopup(auth , googleProvider)
  }


  const users = useSelector((state) => state.registration.users); 

  const formik = useFormik({
    initialValues,
    validationSchema: signUpSchema,
    onSubmit: (values) => {
      const newUser = {
        username: values.name,
        password: values.password,
        email: values.email ,
        confirmPassword: values.confirmPassword,
      };

      const userExists = users.some((user) => user.email === newUser.email);

      if (userExists) {
        alert("This email is already registered.");
      } else {
        try {
          dispatch(registerUser(newUser));
          navigate("/login");
        } catch (error) {
          console.log(error);
        }
      }
    },
  });
  const { values, handleChange, handleBlur, handleSubmit, errors, touched } = formik;

  const handlehome = () => {
    navigate("/");
  };
  console.log(errors);
  console.log(values);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={classes.app}>
          <div className={classes.registration}>
            <h4 className={classes.formTitle}>Registration</h4>
            <div>
              <input
                className={classes.formControl}
                type="text"
                name="name"
                placeholder="Name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.name && touched.name ? <p>{errors.name}</p> : null}
              <input
                className={classes.formControl}
                type="text"
                id="email"
                placeholder="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && touched.email ? <p>{errors.email}</p> : null}
              <input
                className={classes.formControl}
                type="password"
                placeholder="Enter Password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.password && touched.password ? (
                <p>{errors.password}</p>
              ) : null}
              <input
                className={classes.formControl}
                type="password"
                placeholder="Enter ConfirmPassword"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.confirmPassword && touched.confirmPassword ? (
                <p>{errors.confirmPassword}</p>
              ) : null}
            </div>
            {registrationError && (
              <p style={{ color: "red", marginTop: "-7px" }}>
                {registrationError}
              </p>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "-5px",
              }}
            >
              <Button variant="contained" style={{marginTop:"11px"}}  className={classes.loginBtn} onClick={signupUser}>Register</Button>
              <Button
                variant="contained" 
                style={{ marginTop: "12px", height: "26px" }}
                onClick={handlehome}
              >
                Home
              </Button>
            </div>
            <div>
              <Button variant="contained" onClick={signupWithGoggle} style={{width:"100%" , marginTop:"10px" ,  height:"30px"}}>Sign Up With Goggle</Button>
            </div>
            <p>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>  
      </form>
    </>
  );
};

export default Registration;