import React, { useState, useEffect } from "react";
import { TextField, Button } from "@material-ui/core";
import { QRCode } from "react-qr-svg";
import styles from "./SignUp.module.css";
import { useApi } from "../hooks/useApi";
import * as userSignupApi from "../api/userSignUp";
import Spinner from "../components/Spinner/Spinner";

const SignUp = () => {
  const [signUpMode, setSignUpMode] = useState(true);
  const [loading, setLoading] = useState(false);
  // id passed by backend
  const [id, setUserID] = useState("");

  return (
    <>
      {signUpMode && (
        <SignUpForm
          setSignUpMode={setSignUpMode}
          setUserID={setUserID}
          setLoading={setLoading}
        />
      )}
      {!signUpMode && !loading && <QRCodeScreen id={id} includeMargin={true} />}
    </>
  );
};

const QRCodeScreen = props => {
  return (
    <div className={styles.qrPage}>
      <div className={styles.qrDescription}>
        <div>
          このQRコードをスクリーンショットしてください。ドリンクを注文する際に必要となります。
        </div>
        <div>
          Please take a screenshot of this QR code on your phone. We use this to
          check-in at the bar.
        </div>
      </div>
      <div>
        <QRCode value={props.id} id="123456" style={{ maxWidth: 256 }} />
      </div>
    </div>
  );
};

const SignUpForm = props => {
  const { setSignUpMode, setUserID, setLoading } = props;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const {
    isFetching: isFetchingSignUpUser,
    response: signedUpUserResponse,
    makeFetch: fetchSignUpUser
  } = useApi(userSignupApi.userSignUp);

  useEffect(() => {
    if (!signedUpUserResponse) {
      return;
    }

    const { id } = signedUpUserResponse.data;
    setUserID(id);
  }, [signedUpUserResponse]);

  const signUpUser = () => {
    if (!validateField) {
      return;
    }

    fetchSignUpUser({ firstName, lastName, email });
    setSignUpMode(false);
  };

  const validateField = () => {
    if (firstName.trim() === "" || lastName.trim() === "") {
      return false;
    }
    const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    if (!emailValid) {
      return false;
    }
    return true;
  };

  const handleInputChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "firstName") {
      setFirstName(value);
    } else if (name === "lastName") {
      setLastName(value);
    } else if (name === "email") {
      setEmail(value);
    }
  };

  return (
    <div className={styles.signUpForm}>
      <TextField
        required
        id="outlined-basic"
        name="firstName"
        value={firstName}
        onChange={handleInputChange}
        label="First Name"
      />
      <TextField
        required
        id="outlined-basic"
        name="lastName"
        value={lastName}
        onChange={handleInputChange}
        label="Last Name"
      />
      <TextField
        required
        id="outlined-basic"
        name="email"
        value={email}
        onChange={handleInputChange}
        label="Email address"
      />
      <Button variant="contained" color="primary" onClick={signUpUser}>
        Sign Up
      </Button>
    </div>
  );
};
export default SignUp;
