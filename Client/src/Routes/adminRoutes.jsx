import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import AdminLogin from '../pages/adminPages/adminLogin'
import UserMgt from '../pages/adminPages/userMgt'
import AdminNavbar from '../pages/adminPages/AdminNavbar'
import RestoMgt from '../pages/adminPages/RestoMgt'



function AdminRoutes() {
    const location = useLocation()
    return (
        <div>
            {location.pathname != '/admin' ? <AdminNavbar /> : ''}
            <Routes>
                <Route path='/' element={<AdminLogin />} />
                <Route path='/home' element={<UserMgt />} />
                <Route path='/restaurant' element={<RestoMgt />} />
            </Routes>
        </div>
    )
}

export default AdminRoutes