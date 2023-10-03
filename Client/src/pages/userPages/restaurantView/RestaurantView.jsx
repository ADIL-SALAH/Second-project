import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import userAxios from '../../../../axios/userAxios'
import MapComponent from './map';
import ChatComponent from '../../../socket';
import { FaThumbsUp } from 'react-icons/fa';
import Corousel from './corousel';





function RestaurantView() {



    const { phone, objId } = useSelector((state) => state.client)
    const navigate = useNavigate()
    const uselocation = useLocation()
    const queryParams = new URLSearchParams(uselocation.search)
    const restoId = queryParams.get('restoId')
    const [restoDetail, setRestoDetails] = useState()
    const [reload, setReload] = useState(true)
    const [chatRoomId, setChatRoomId] = useState('')






    useEffect(() => {
        userAxios.get(`/restaurantView?restoId=${restoId}`).then((res) => {
            setRestoDetails(res?.data?.restoDetails)
        }).catch((err) => {
            console.log(err)
        })


    }, [reload])





    const like = () => {
        userAxios.put(`/like?restoPhone=${restoDetail?.phone}`)
            .then((res) => {
                console.log('liked/unliked the restaurant')
                setReload(!reload)
            })
            .catch((err) => console.log(err))

    }
    return (
        <>
            <div className='p-10 bg-red-800 w-screen h-screen   '>

                <div className='flex justify-around mb-10 bg-opacity-20'>
                    <div className='flex justify-center w-full'>
                        <h1 className=' flex justify-center text-2xl font-semibold text-white'>{restoDetail?.resto_name}</h1>
                    </div>
                    <img src={restoDetail?.logo} width={60} alt="logo" className='bg-opacity-20 rounded-full' />
                </div>
                <div className=' grid grid-cols-4 '>
                    <div className='md:col-span-2 col-span-4 ' >
                        <Corousel restoDetail={restoDetail} />

                    </div>

                    <div className='text-right  md:col-span-2 col-span-4 flex items-center gap-10 h-72 ' >
                        <div className='flex flex-col justify-center items-center '>
                            <p className='md:text-2xl text-xl text-center text-white md:w-1/2  '>The people who give you their food,give you their heart. - Cesar Chavez </p>
                            <div className='flex justify-around  mt-4 '>
                                <button className='bg-indigo-500 hover:bg-indigo-600 px-5 py-2 text-white rounded-lg ' onClick={() => navigate(`/menuList?restoId=${restoDetail?._id}`)}>Restaurant Menu</button>
                                <span className={`${restoDetail?.likes.some((user) => user.userPhone == phone) ? 'text-blue-400' : 'text-white'} ml-8  hover:cursor-pointer flex space-x-5 `} onClick={like}>
                                    <FaThumbsUp className='text-2xl' />
                                    <small className='text-lg text-white'>{restoDetail?.likesCount}</small>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div >
            <div className='flex md:flex-row py-5 flex-col md:h-screen h-full bg-gray-800 items-center '>
                <div className='w-full md:w-2/3 opacity-70'>
                    <h1 className='text-3xl font-bold text-gray-400 text-center'>LOCATE US HERE: </h1>
                    <MapComponent location={restoDetail?.location} />
                </div>
                <div className='w-full md:w-1/3 opacity-70'>
                    <h1 className='text-3xl font-bold text-gray-400 text-center'>CHAT WITH US HERE:</h1>
                    <ChatComponent user={'user'} restoId={restoId} userId={objId} />
                </div>
            </div>
        </>
    )
}

export default RestaurantView