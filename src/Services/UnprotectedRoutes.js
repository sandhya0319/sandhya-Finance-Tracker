import React from 'react'
import { Outlet,Navigate } from 'react-router-dom'

const UnprotectedRoutes = () => {
 const auth=localStorage.getItem("loggedintoken");
 return auth?<Navigate to="/viewdata" />:<Outlet />
}

export default UnprotectedRoutes
