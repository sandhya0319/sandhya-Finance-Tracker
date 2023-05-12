import React from 'react'
import { Outlet,Navigate } from 'react-router-dom'

export const ProtectedRoutes = () => {
  const auth=localStorage.getItem("loggedintoken");
  return auth?<Outlet />:<Navigate to={"/login"} />;

};
export const UnprotectedRoutes = () => {
  const auth=localStorage.getItem("loggedintoken");
  return auth?<Navigate to="/viewdata" />:<Outlet />
 }


