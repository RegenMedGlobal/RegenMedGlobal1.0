import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import { TextField, Button, Snackbar, MenuItem } from "@mui/material";
import zxcvbn from "zxcvbn";
import { EDGE_URL } from "../config";
import axios from 'axios';
import { resetPassword } from "./insertNewUser";
import { AuthContext } from '../AuthContext';



const FormContainer = styled.div`
  width: 100%;
  max-width: 600px; /* Set the maximum width for the form */
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  text-align: center; /* Add this line to center the form */

  @media screen and (max-width: 768px) {
    padding: 20px; /* Adjust padding for mobile devices */
  }
`;

const StyledControllerContainer = styled.div`
  margin-bottom: 1rem;

  /* Added styles for positioning */
  position: relative;
  z-index: 0;

  /* Added styles for dropdown container */
  .country-dropdown-container {
    position: relative;
    z-index: 9999;
  }

  /* Added styles for dropdown menu */
  .react-dropdown-select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 99999;
    margin-top: 4px;
  }
`;


const CodeValidator = () => {

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const {
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { errors },
        getValues,
        reset,
    } = useForm({
        defaultValues: {

        },
    });


    const password = watch("password");

    const getPasswordStrength = () => {
        if (!password) {
            return "";
        }

        const { score } = zxcvbn(password);
        const strengthLabels = [
            "Very Weak",
            "Weak",
            "Fair",
            "Strong",
            "Very Strong",
        ];

        return strengthLabels[score];
    };

    const isPasswordStrongEnough = () => {
        const { score } = zxcvbn(password);
        return score >= 2; // Minimum score of 2 corresponds to "Fair" strength
    };

   

    const [isVerified, setIsVerified] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [otp, setOtp] = useState("");
    const [isResetted, setIsResetted] = useState(false)

    const location = useLocation()
    
    const [isFresh, setIsFresh] = useState(false);

    const onSubmit = async (data, event) => {
        // Prevent the default form submission
        event.preventDefault();

        console.log("ID", id)

        let response = await resetPassword({password: data.password}, id)
        if(response) {
            reset(); // Reset the form fields
            setIsResetted(true)
            // toast.success();
            const resp = {
                userId: id
            };
            login({ userData: JSON.stringify(resp), id });
            // Redirect to the user's profile page
            const userData = { ...resp, loggedIn: true };
            navigate(`/profile/${id}`, { state: userData });
            
        }

    }

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        setIsFresh(params.get('new'))
    }, [])

    console.log(isFresh)

    const pathname = location.pathname;
    const match = pathname.match(/\/CodeValidator\/(\d+)/);
    let id = null;
    if (match) {
        id = match[1];
        console.log(id);
    }

    const verify_otp = async () => {
        setIsFresh(false);
        console.log("otp", otp)

        const data = {
            "id": id,
            "otp": otp
        };

        // Make the POST request to the API
        const response = await axios.post(EDGE_URL + "/validate-code", data);
        const responseData = response.data;
        console.log("Response ", responseData)
        if (responseData.status) {
            setIsVerified(true)
            setErrorMessage("")
        } else {
            setErrorMessage(responseData.message)
        }
    }



    return (
        <>
            <div className="form-custom">
                <img className="bottom-vector" src="images/hero-bg.png" alt="" />
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="form-all register-form code-validater-only">
                                <FormContainer>
                                    <ToastContainer
                                        position="top-center"
                                        autoClose={5000}
                                        hideProgressBar={false}
                                        newestOnTop={false}
                                        closeOnClick
                                        rtl={false}
                                        pauseOnFocusLoss
                                        draggable
                                        pauseOnHover
                                    />

                                    <form onSubmit={(e) => handleSubmit(onSubmit)(e)}>

                                        {isFresh && <strong className="green">Verification code has been sent. Please check your email.</strong>}
                                        <p className="red-error"><strong>{errorMessage}</strong></p>

                                        
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="mar-15">
                                                {!isVerified && !isResetted && (
                                                    <>
                                                    <StyledControllerContainer>
                                                        <label className="label-contact">Verification Code</label>
                                                        <Controller
                                                            name="otp"
                                                            control={control}
                                                            defaultValue=""
                                                            rules={{ required: "Verification code is required" }}
                                                            render={({ field }) => (
                                                                <TextField

                                                                    variant="outlined"
                                                                    style={{ width: "25rem" }}
                                                                    error={Boolean(errors.otp)}
                                                                    helperText={
                                                                        errors.otp ? errors.otp.message : ""
                                                                    }
                                                                    {...field}
                                                                    onChange={(e) => {
                                                                        field.onChange(e);
                                                                        setOtp(e.target.value)
                                                                        console.log("OTP Value:", e.target.value);
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                    </StyledControllerContainer>

                                                    <div className="another-div">

                                                        <button type="button" onClick={verify_otp} className="Send-message">Verify</button>
                                                    </div>
                                                    </>)}


                                                    {isVerified && !isResetted && (
                                                        <>
                                                        <h4 className="green"><strong>Account Verified! Please set password.</strong></h4>
                                                            <div className="row">
                                                                <div className="col-lg-12">
                                                                    <div className="mar-15">

                                                                        <StyledControllerContainer>
                                                                            <label className="label-contact">Password</label>
                                                                            <Controller
                                                                                name="password"
                                                                                control={control}
                                                                                defaultValue=""
                                                                                rules={{
                                                                                    required: "Password is required",
                                                                                    validate: {
                                                                                        strongEnough: (value) =>
                                                                                            isPasswordStrongEnough(value) ||
                                                                                            'Password must be at least "Fair" strength',
                                                                                    },
                                                                                }}
                                                                                render={({ field }) => (
                                                                                    <TextField
                                                                                        variant="outlined"
                                                                                        style={{ width: "25rem" }}
                                                                                        error={Boolean(errors.password)}
                                                                                        helperText={errors.password ? errors.password.message : ""}
                                                                                        {...field}
                                                                                        type="password"
                                                                                        onChange={(e) => {
                                                                                            field.onChange(e);
                                                                                            console.log("Password values:", e.target.value);
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            />
                                                                            <p style={{ marginTop: "20px" }}>Password Strength: {getPasswordStrength()}</p>
                                                                        </StyledControllerContainer>

                                                                    </div>
                                                                </div>
                                                            </div>


                                                            <div className="row">
                                                                <div className="col-lg-12">
                                                                    <div className="mar-15">

                                                                        <StyledControllerContainer>
                                                                            <label className="label-contact">Confirm Password</label>
                                                                            <Controller
                                                                                name="confirmPassword"
                                                                                control={control}
                                                                                defaultValue=""
                                                                                rules={{
                                                                                    required: "Confirm Password is required",
                                                                                    validate: (value) =>
                                                                                        value === getValues("password") ||
                                                                                        "Password and Confirm Password must match",
                                                                                }}
                                                                                render={({ field }) => (
                                                                                    <TextField
                                                                                        variant="outlined"
                                                                                        style={{ width: "25rem" }}
                                                                                        fullWidth
                                                                                        error={Boolean(errors.confirmPassword)}
                                                                                        helperText={
                                                                                            errors.confirmPassword ? errors.confirmPassword.message : ""
                                                                                        }
                                                                                        {...field}
                                                                                        type="password"
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </StyledControllerContainer>


                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="another-div">
                                                                <button type="submit" className="Send-message">Reset</button>
                                                            </div>
                                                        </>
                                                    )}

                                                    {isVerified && isResetted && (
                                                        <h4 className="green"><strong>"Registration Successful. Thank you for signing up!"</strong></h4>
                                                    )}

                                                </div>
                                            </div>
                                        </div>

                                    </form>


                                </FormContainer>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CodeValidator;