import React from 'react'
import { Outlet,Navigate } from 'react-router-dom'

const ProtectedRoutes = () => {
  const auth=localStorage.getItem("loggedintoken");
  // const data=localStorage.getItem("formDataList");
  return auth?<Outlet />:<Navigate to={"/login"} />;
  // if(auth)
  // {
  //   <Outlet/>
  // }
  // else{
  //   <Navigate to={"/login"} />;
  // }
  // if(data)
  // {
  //   <Outlet/>
  // }
  // else{
  //   <Navigate to={"/viewdata"} />;
  // }

};

export default ProtectedRoutes
