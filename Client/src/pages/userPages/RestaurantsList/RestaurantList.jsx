import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import userAxios from '../../../../axios/userAxios'
import { ToastContainer, toast } from 'react-toastify'

import { useDispatch, useSelector } from 'react-redux'
import { updateClientRestoId, updateClientState } from '../../../../redux/client'
import { FaThumbsUp } from 'react-icons/fa';

function RestaurantList() {
    const { phone } = useSelector((state) => state.client)
    const navigate = useNavigate()
    const [restoList, setRestoList] = useState([])
    const [reload, setReload] = useState(true)
    const [restoDetails, setDetails] = useState()
    const dispatch = useDispatch()
    useEffect(() => {
        userAxios.get('/restos')
            .then((res) => {
                setRestoList(res.data.restoList)
            })
            .catch((err) => {
                console.log(err)
                toast.error(err)
            })
    }, [reload])
    const like = (restoPhone) => {
        userAxios.put(`/like?restoPhone=${restoPhone}`)
            .then((res) => {
                setReload(!reload),
                    console.log('like and unlike restaurant')
            })
            .catch((err) => console.log(err))


    }
    useEffect(() => {
        console.log(restoDetails, 'Resto details updated');
    }, [restoDetails]);

    const restaurantView = async (restoId) => {
        try {
            dispatch(updateClientState({ state: 'restoView' }))
            dispatch(updateClientRestoId({ restoId: restoId }))

            navigate(`/restaurantView?restoId=${restoId}`)


        } catch (error) {
            console.log(error)
        }
    }
    const likeees = restoList.filter((resto) => resto.likes.find((obj) => obj.userPhone == phone))
    return (

        <div className='bg-slate-900 pt-10 h-full'>
            <div className='bg-slate-900'>
                <h1 className='text-center text-white font-semibold text-3xl'>Restaurant List</h1>
            </div>
            <div className='w-screen h-full grid grid-cols-4 mt-20 '>
                {restoList.map((resto, index) => {
                    return (
                        <div className="bg-white bg-opacity-20 h-96 md:col-span-1 col-span-4 hover:text-white shadow-2xl hover:shadow-none cursor-pointer  rounded-3xl flex flex-col items-center justify-center transition-all duration-500 ease-in-out m-10" >
                            <div className="relative mt-2 mx-2 ">
                                <div className="h-56 rounded-2xl overflow-hidden p-5" onClick={() => restaurantView(resto._id)}>
                                    <img src={resto.logo} className="object-cover w-60 h-56 " alt={index} />
                                </div>
                                <div className="absolute bottom-0 left-0 -mb-4 ml-3 flex flex-row ">
                                    <div
                                        onClick={() => like(resto.phone)}
                                        className={`h-10 w-16 ml-2 flex items-center justify-center font-medium rounded-2xl shadow-xl transform-gpu translate-y-0 hover:-translate-y-1 transition-all duration-300 ease-in-out 
                                            ${resto.likes.some((user) => user.userPhone == phone)
                                                ? 'bg-red-600  text-white '
                                                : 'bg-slate-400  text-red-600'
                                            }`}
                                    >
                                        <FaThumbsUp />
                                        <span className={`${resto.likes.some((user) => user.userPhone == phone) ? 'text-white text-xs ml-2' : "text-black ml-2  text-xs"}`}>{resto.likesCount}</span>
                                    </div>


                                </div>
                            </div>
                            <div className='p-10 pl-5 pb-6 w-full px-4 hover:text-white'>
                                <h1 className=' font-medium leading-none text-base tracking-wider text-white '>{resto.resto_name}</h1>
                                <h1 className=' font-medium leading-none text-base tracking-wider text-white mt-3 '>Call us: {resto.phone}</h1>
                            </div>
                        </div>


                    )
                })}
            </div >
            <ToastContainer />
        </div>
    )
}

export default RestaurantList