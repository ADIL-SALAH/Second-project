import Cookies from 'js-cookie'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../../assets/logo 2 ifood 2.png'
import RestoLogo from '../../assets/restaurant-point-logo-vector-ilustration-design-food-icon-cooking-kitchen-fork-menu-dinner-spoon-illustration-cafe-isolated-lunch-156760527 1.png'


function AdminNavbar() {
    const navigate = useNavigate()
    const [active, setActive] = useState('reservation')

    const handleTab = (tab) => {
        setActive(tab)
        if (tab === 'user') {
            navigate('/admin/home')
        }
        else if (tab === 'restaurant') {
            navigate('/admin/restaurant')
        }
        else if (tab === 'menu') {
            navigate('/admin/menuMgt')

        }
        else if (tab === 'banner') {
            navigate('/admin/banner')

        }
        else if (tab === 'order') {
            navigate('/admin/order')

        }
        else if (tab === 'profile') {
            navigate('/admin/profile')
        }
    }

    const logout = () => {
        Cookies.remove('adminToken')
        navigate('/admin')
    }
    return (
        <div className='bg-none h-28 pb-6 px-9'>
            <div className='items-center flex justify-around font-mono font-bold '>
                <img src={Logo} alt="logo" width={100} height={100} />
                {/* <ul className='flex justify-around'> */}
                <li className={active === 'user' ? 'text-red-600 border-b-[3px]' : 'text-blue-600'} onClick={() => handleTab('user')}>UserMgt</li>
                <li className={active === 'restaurant' ? 'text-red-600 border-b-[3px]' : 'text-blue-600'} onClick={() => handleTab('restaurant')}>RestaurantMgt</li>
                <li className={active === 'menu' ? 'text-red-600 border-b-[3px]' : 'text-blue-600'} onClick={() => handleTab('menu')}>Menu mgt</li>
                <li className={active === 'banner' ? 'text-red-600 border-b-[3px]' : 'text-blue-600'} onClick={() => handleTab('banner')}> Banner Mgt</li >
                <li className={active === 'order' ? 'text-red-600 border-b-[3px]' : 'text-blue-600'} onClick={() => handleTab('order')}> Order Mgt</li >
                <li className={active === 'profile' ? 'text-red-600 border-b-[3px]' : 'text-blue-600'} onClick={() => handleTab('profile')}> Profile</li >
                {/* </ul > */}
                <li onClick={logout} className='text-blue-600'>Logout</li>
                {/* <img src={RestoLogo} alt="Restaurant Logo" width={80} height={80} className='mr-5' /> */}
            </div >

        </div >
    )
}

export default AdminNavbar