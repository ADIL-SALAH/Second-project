import Cookies from 'js-cookie'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function RestoHome() {
    const navigate = useNavigate()
    useEffect(() => {
        if (!Cookies.get('restoToken')) {
            navigate('/resto')
        }
    }, [])
    const restoName = useSelector((state) => state.resto.restoName)


    return (
        <>

            <div className='h-screen bg-black p-10'>
                <h1 className='text-red-600 font-mono font-bold text-3xl text-center'>{restoName}</h1>
            </div>
        </>
    )
}

export default RestoHome