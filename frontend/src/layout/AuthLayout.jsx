import { Outlet } from "react-router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"


const AuthLayout = () => {
  return (
    <>
       
       <Outlet/>
       
    </>
  )
}

export default AuthLayout