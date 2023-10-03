import React, { useEffect, useState } from 'react'
import RestoLogin from './restoLogin'
import RestoSignup from './restoSignup'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

function adminsignupAndLogin(props) {

    const navigate = useNavigate()
    useEffect(() => {
        if (Cookies.get('restoToken')) {
            navigate('/resto/home')
        }

    }, [])
    return (
        <div>
            {props.login ? <RestoLogin /> : <RestoSignup />}
        </div>

    )
}

export default adminsignupAndLogin