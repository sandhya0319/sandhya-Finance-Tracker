import React, { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const RegisterPage = () => {
  const navigate = useNavigate();
  const [inputValues, setInput] = useState({
    username: "",
    email: "",
    password: "",
  })
  //console.log("inputttt",inputValues)
  // const handleChange=(event)=>{
  //   console.log(event);
  //   setInput({...inputValues,[event.target.name]:event.target.value});
  // }
  const handleSubmit = (e) => {
    // console.log("fff", e);
    e.preventDefault();
    if (inputValues.username == "") {
      alert("Please enter Username");
    }
    else if (inputValues.email == "") {
      alert("Please enter Email");
    }
    else if (inputValues.password == "") {
      alert("Please enter password");
    }
    else {
      const existsusers = JSON.parse(localStorage.getItem("users")) || [];
      existsusers.push(inputValues)
      localStorage.setItem("users", JSON.stringify(existsusers));
      // console.log("innmm", inputValues);
      navigate("/login");
    }
  };

  return (
    <div className='container'>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div class="form-group row">
          <label class="col-sm-2 col-form-label">Username</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" name="username" value={inputValues.username} onChange={(e) => setInput({ ...inputValues, [e.target.name]: e.target.value, })} />
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-2 col-form-label">Email</label>
          <div class="col-sm-10">
            <input type="email" class="form-control" name="email" value={inputValues.email} onChange={(e) => setInput({ ...inputValues, [e.target.name]: e.target.value, })} />
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-2 col-form-label">Password</label>
          <div class="col-sm-10">
            <input type="password" class="form-control" name="password" value={inputValues.password} onChange={(e) => setInput({ ...inputValues, [e.target.name]: e.target.value, })} />
          </div>
        </div>
        <div class="form-group row">
          <div class="col-sm-10">
            <button type="submit" class="btn btn-primary">Sign up</button>
            <div>
            <p>Already have an account? 
                <Link to="/login" className='alink'>login</Link>
            </p>
            </div>
          </div>
        </div>
      </form>

    </div>
  )
}

export default RegisterPage