import * as Yup from "yup";

export const signUpSchema = Yup.object({
  name: Yup.string().min(3).max(20).required(<p style={{ color: "red" , fontSize:"90" , marginTop:"-22px" }}>Please enter your name</p>),
  email: Yup.string().email().required(<p style={{ color: "red" ,  marginTop:"-22px" }}>Please enter your email</p>),
  password: Yup.string().min(6).required(<p style={{ color: "red" ,  marginTop:"-22px" }}>Please enter your password</p>),
  confirmPassword: Yup.string().min(6).required(<p type= "password" style={{ color: "red" ,  marginTop:"-22px" }}>Please confirm your password</p>).oneOf([Yup.ref("password"), null], <span style={{ color: "red" }}>Passwords must match</span>),
});
