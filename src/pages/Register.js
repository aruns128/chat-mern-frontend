import React, { useState, useEffect } from 'react'
import Logo from "../assets/logo.svg";
import { useNavigate, Link } from "react-router-dom";
import styled from 'styled-components'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'
import { registerRoute } from '../utils/APIRoutes';




export const Register = () => {
  const navigate = useNavigate();

  const toastOptions = {
    position: 'bottom-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'light'
  }
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error("Password and Confirm password should be same", toastOptions)
      return false
    } else if (username.length < 3) {
      toast.error("Username should be greater than 3 characters", toastOptions)
      return false
    } else if (password.length < 8) {
      toast.error("Password should be greater than 8 characters", toastOptions)
      return false
    } else if (email === "") {
      toast.error("email is required", toastOptions)
      return false
    }
    return true;
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        email, username, password
      })

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }

  }

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  return (<>
    <FormContainer>
      <form onSubmit={(event) => handleSubmit(event)}>
        <div className='brand'>
          <img src={Logo} alt="logo" />
          <h1>Chat</h1>
        </div>
        <input type="text" placeholder='Username' name='username' onChange={(e) => handleChange(e)} />
        <input type="email" placeholder='Email' name='email' onChange={(e) => handleChange(e)} />
        <input type="password" placeholder='Password' name='password' onChange={(e) => handleChange(e)} />
        <input type="password" placeholder='Confirm Password' name='confirmPassword' onChange={(e) => handleChange(e)} />
        <button type='submit'>Create User</button>
        <span>Already having an account ? <Link to="/login">Login</Link></span>
      </form>

    </FormContainer>
    <ToastContainer />
  </>
  )
}

const FormContainer = styled.div`
  height:100vh;
  width:100vw;
  display:flex;
  flex-direction:column;
  justify-content:center;
  gap:1rem;
  align-items:center;
  background-color:#D3E1ED;
  .brand{
    display:flex;
    align-items:center;
    gap:1rem;
    justify-content:center;
    img{
        height:5rem;
    }
    h1{
      color:white;
      text-transform:uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #3C9BEC;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    padding: 1rem;
    border:0.1rem solid #C4EEFD;
    border-radius:0.4rem;
    width:100%;
    font-size: 1rem;
    &:focus{
      border: 0.1rem solid #C4EEFD;
      outline:none;
    }
  }
  button{
    background-color:#C70DF6;
    color:white;
    padding:1rem 2rem;
    border:none;
    font-weight:bold;
    cursor:pointer;
    border-radius:0.4rem;
    font-size:1rem;
    text-transform:uppercase;
    transition: 0.5 ease-in-out;
    &:hover{
      background-color:#07B3F1;
    }
  }
  span{
    color:white;
    text-transform:uppercase;
    a{
      text-decoration:none;
      color:#C70DF6;
      font-weight:bold
    }
  }
`;