import React, { useEffect, useState } from 'react'
import Logo from '../../../assets/logo 2 ifood 2.png'
import Box from '../../userPages/signup and login/box'
import Login from '../../login/components/loginForm'
import Signup from '../../Signup/components/regForm'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

function SignupAndLogin(props) {
    const navigate = useNavigate()
    useEffect(() => {
        if (Cookies.get('token')) {
            navigate('/')
        }

    }, [])
    return (
        <>
            <div className='bg-[#ffff] h-screen w-screen  absolute '>
                <img className='absolute mr-0 right-28 top-10 md:right-28 md:top-10' src={Logo} width={100} alt="i-food logo" />
                {props.login ? <Login /> : <Signup />}
            </div>
        </ >
    )
}

export default SignupAndLogin