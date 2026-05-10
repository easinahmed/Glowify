import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const AdminLayout = () => {
  return (
    <div>
      
      <Outlet />
    
    </div>
  )
}

export default AdminLayout