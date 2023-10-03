import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
// import Login from '../pages/login/login'
// import Signup from '../pages/signup/signup'
import Homepage from '../pages/userPages/Home/homepage'
import SignupAndLogin from '../pages/userPages/signup and login/signupAndLogin'
import Navbar from '../pages/userPages/Home/components/navbar'
import RestaurantList from '../pages/userPages/RestaurantsList/RestaurantList'
import UserProfile from '../pages/userPages/userProfile/UserProfile'
import RestaurantView from '../pages/userPages/restaurantView/RestaurantView'
import MenuList from '../pages/userPages/menuList/MenuList'
import MyOrders from '../pages/userPages/userProfile/MyOrders'
import Cart from '../pages/userPages/cart/cart'
import CheckOut from '../pages/userPages/menuList/checkOut'
import OrderSuccess from '../pages/userPages/menuList/OrderSuccess'


function User() {
    const location = useLocation()
    return (
        <div>
            {location.pathname != '/login' && location.pathname != '/signup' ? <Navbar /> : ''}
            <Routes>
                < Route path='/login' element={< SignupAndLogin login />} />
                < Route path='/signup' element={< SignupAndLogin />} />
                < Route path='/' element={< Homepage />} />
                < Route path='/restos' element={< RestaurantList />} />
                < Route path='/userProfile' element={< UserProfile />} />
                < Route path='/restaurantView' element={< RestaurantView />} />
                <Route path='/menuList' element={<MenuList />} />
                <Route path='/myOrders' element={<MyOrders />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/checkOut' element={<CheckOut />} />
                <Route path='/orderSuccess' element={<OrderSuccess />} />
            </Routes >
        </div>
    )
}

export default User