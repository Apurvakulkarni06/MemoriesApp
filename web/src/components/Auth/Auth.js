import React, { useState } from "react";
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";
import { GoogleLogin } from "react-google-login";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Input from "./Input";
import Icon from "./icon";
import useStyles from "./styles";

import { signIn, signUp } from '../../actions/auth';

const initValues = { firstName: '', lastName: '', email:'', password:'', confirmPassword:''}

function Auth() {
  const classes = useStyles();
  const googleClientId = process.env.REACT_APP_GOOGLE_ID || "";

  const history = useHistory();

  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initValues)

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(formData)

    if(isSignup){
      //login the user
      dispatch(signUp(formData, history))
    }
    else{
      // register the user
      dispatch(signIn(formData, history))
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  };
  const handleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const switchMode = () => {
    setIsSignup((prevIsSignUp) => !prevIsSignUp);
    handleShowPassword();
  };

  const googleSuccess = async (res) =>{

    // console.log("google sign in is successful,", res);
    const result = res?.profileObj;
    const token = res?.tokenId;

    try{
      dispatch({ type:"AUTH", data: { result, token }});
      history.push('/');
    }
    catch(error){
      console.error(error);
    }
    
  }
  const googleFailure= () =>{
    console.log("Google sign in was unsuccessful, Please try again later")
  }
  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">{isSignup ? "Sign Up" : "Sign In"}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}

            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              handleShowPassword={handleShowPassword}
              type={showPassword ? "text" : "password"}
            />

            {isSignup && (
              <Input
                name="confirmPassword"
                label="Repeat Password"
                handleChange={handleChange}
                type="password"
              />
            )}
          </Grid>
         
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </Button>
          <GoogleLogin
            clientId={googleClientId}
            render={(renderProps) => (
              <Button
                className={classes.googleButton}
                color="primary"
                fullWidth
                onClick={renderProps.onClick}
                // disabled={renderProps.disabled}
                startIcon={<Icon />}
                variant="contained"
              >Google Sign In</Button>
            )}

            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
          />
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default Auth;
