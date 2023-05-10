import React, { useState } from 'react'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { Routes, Route, Link, json } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


const LoginPage = () => {
  const navigate = useNavigate();
  // const [inputValues, setInput] = useState({
  //   email: "",
  //   password: "",
  // })

 const schema=yup.object().shape({
    email:yup.string().email().required("email is required"),
    password:yup.string().required("password is required").min(4).max(8)
  });
 
  const {register,handleSubmit,formState:{errors}} = useForm({
    resolver:yupResolver(schema)

  });

  const onSubmit = (data) => {
   // console.log("sssssss",data);
   
    const token = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString(36).substr(0, 10);
   
    const loginValues = JSON.parse(localStorage.getItem("users"));
    

      let user = loginValues.find(elem => elem.email == data.email && elem.password == data.password);
      if (user) {
        localStorage.setItem("loggedintoken",  JSON.stringify(token));
        alert(`Welcome ${user.username}!`);
     navigate("/viewdata");
      } else {
        alert("Wrong email or password.");
      }
  };

  return (
    <div className='container'>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div class="form-group row">
          <label class="col-sm-2 col-form-label">Email</label>
          <div class="col-sm-10">
            <input type="email" class="form-control" name="email" {...register("email")} />
            <p>{errors.email?.message}</p>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-2 col-form-label">Password</label>
          <div class="col-sm-10">
            <input type="password" class="form-control" name="password" {...register("password")} />
            <p>{errors.password?.message}</p>
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