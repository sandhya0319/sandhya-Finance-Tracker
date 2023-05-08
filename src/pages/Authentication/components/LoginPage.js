import React, { useState } from 'react'
import { Routes, Route, Link, json } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


const LoginPage = () => {
  const navigate = useNavigate();
  const [inputValues, setInput] = useState({
    email: "",
    password: "",
  })


  // const existsusers = JSON.parse(localStorage.getItem("users")) || [];
  // existsusers.push(inputValues)
  // localStorage.setItem("users", JSON.stringify(existsusers));


  
 
  const handleLogin = (e) => {
    const token = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString(36).substr(0, 10);
    // generateToken()
    //alltoken.push(token)
    e.preventDefault();
    const loginValues = JSON.parse(localStorage.getItem("users"));
    if (inputValues.email == "" && inputValues.password == "") {
      alert("Please enter email and password");
    }
    else {

      let user = loginValues.find(elem => elem.email == inputValues.email && elem.password == inputValues.password);
      if (user) {

        // const existingtokens=JSON.parse(localStorage.getItem("loggedintoken")) || [];
        // existingtokens.push(token);
        // console.log("tkkkk",existingtokens);
        //localStorage.setItem("users",JSON.stringify(loginValues))
        localStorage.setItem("loggedintoken",  JSON.stringify(token));
        alert(`Welcome ${user.username}!`);
        navigate("/viewdata");
      } else {
        alert("Wrong email or password.");
      }
    }
  };

  return (
    <div className='container'>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
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
            <button type="submit" class="btn btn-primary">Sign in</button>
            <div>
            <p>Don't have an account? 
                <Link to="/register" className='alink'>Register</Link>
            </p>
            </div>
          </div>
        </div>
      </form>

    </div>
  )
}

export default LoginPage