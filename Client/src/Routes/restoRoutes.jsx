import React from 'react'
import RestoNavbar from '../pages/restoPages/home/components/restoNavbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import RestoSignupAndLogin from '../pages/restoPages/signup and login/restoSignupAndLogin'
import RestoHome from '../pages/restoPages/home/restoHome'
import MenuMgt from '../pages/restoPages/menuMgt/menuMgt'
import Addmenu from '../pages/restoPages/menuMgt/addmenu'
import CategoryMgt from '../pages/restoPages/categoryMgt/categoryMgt'
import RestoProfile from '../pages/restoPages/restoProfile/restoProfile'
import OrderMgt from '../pages/restoPages/orderMgt/orderMgt'
import ChatRoom from '../pages/restoPages/ChatRoom/ChatRoom'
import ChatComponent from '../socket'

const RestoLayout = () => {
    const currRoute = useLocation()
    return (
        <>
            {currRoute.pathname != '/resto' && currRoute.pathname != '/resto/signup' ? <RestoNavbar /> : ''}
            <Routes>
                <Route path='/' element={<RestoSignupAndLogin login />} />
                <Route path='/signup' element={<RestoSignupAndLogin />} />
                <Route path='/home' element={<RestoHome />} />
                <Route path='/menuMgt' element={<MenuMgt />} />
                <Route path='/categoryMgt' element={<CategoryMgt />} />
                <Route path='/restoProfile' element={<RestoProfile />} />
                <Route path='/orderMgt' element={<OrderMgt />} />
                <Route path='/chatRoom' element={<ChatComponent />} />
            </Routes>
        </>
    )
}

export default RestoLayout
