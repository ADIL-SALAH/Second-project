import React, { useEffect, useState } from 'react'
import userAxios from '../../../../axios/userAxios'
import { SimpleRegistrationForm } from './form'
import { ToastContainer, toast } from 'react-toastify'
import LoadingPage from '../../../loading'
import { useNavigate } from 'react-router-dom'
import MyOrders from './MyOrders'
import { useDispatch } from 'react-redux'
import { clientLogin, updateClientPhoto } from '../../../../redux/client'

function UserProfile() {
    const [userDetails, setUserDetails] = useState([])
    const [reload, setReload] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [userLocation, setUserLocation] = useState({})
    const [edit, setEdit] = useState(false)
    const [showPhoto, setShowPhoto] = useState(true)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        userAxios.get('/userProfile').then((res) => {
            setUserDetails(res.data.userDetails)
        }).catch((err) => {
            console.log(err)
        })
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            console.error("Geolocation is not available.");
        }
    }, [reload])

    const saveImage = (event) => {
        // const photo = event.target.files
        setIsLoading(true)
        const formData = new FormData()
        formData.append('file', event.target.files[0])
        userAxios.post('/addPhoto', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if (res.data.success) {
                toast.success('Photo saved')
                dispatch(updateClientPhoto({ image: res.data.photo }))
                setShowPhoto(!showPhoto)
                setReload(!reload)
            }
        }).catch((err) => {
            console.log(err)
        }).finally(() => setIsLoading(false))

    }

    return (

        <div className='bg-slate-100 w-screen h-screen flex flex-col justify-center'>
            <ToastContainer />
            {isLoading ? <LoadingPage type={"bars"} color={"gray"} /> :
                (<div className="max-w-4xl flex items-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-0  ">

                    <div id="profile" className="w-full lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-75 mx-6 lg:mx-0">


                        <div className="p-2 md:p-8 text-center lg:text-left">
                            {userDetails[0]?.proPic ? <div className="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center" style={{
                                backgroundImage: `url(${userDetails[0]?.proPic})`
                            }}></div> : <div className="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center bg-slate-300" >
                                <div className='flex flex-col justify-center w-full h-full cursor-pointer '>
                                    <input type="file" id='sm-file-input' className='hidden ' />
                                    <label htmlFor="sm-file-input">add photo</label>
                                </div>
                            </div>}

                            <h1 className="text-3xl font-bold pt-8 lg:pt-0">{userDetails[0]?.name}</h1>
                            <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"></div>
                            {edit ? <p className="pt-2 text-base flex items-center justify-center lg:justify-start">{userDetails[0]?.username}</p> : <input type='text' defaultValue={userDetails[0]?.username} />}
                            <p className="pt-2 text-base flex items-center justify-center lg:justify-start">{userDetails[0]?.phone}</p>
                            <p className="pt-2 text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start">
                                <svg className="h-4 fill-current text-green-700 pr-4" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" /></svg>Your Location - longitude:{userLocation?.longitude?.toFixed(2)}, latitude:{userLocation?.latitude?.toFixed(2)}</p>
                            <div className="pt-12 pb-8">

                            </div>

                            <div className="mt-6 pb-16 lg:pb-0 w-4/5 lg:w-full mx-auto flex flex-wrap items-center justify-between">
                                <button className='bg-green-800 text-white rounded-full text-xs px-3 shadow-sm py-2' onClick={() => navigate('/myOrders')}>My Orders</button>
                                {/* <button className='bg-green-800 text-white rounded-full text-xs px-3 shadow-sm py-2' >Change Password</button> */}
                                <button className={`${showPhoto ? 'bg-green-800' : ' bg-red-800'} text-white rounded-full text-xs px-3 shadow-sm py-2`} onClick={() => setShowPhoto(!showPhoto)}>Edit Photo</button>
                                <button className={`${edit ? 'bg-red-400' : 'bg-green-800 '}text-white rounded-full text-xs px-3 shadow-sm py-2`} onClick={() => setEdit(!edit)}>{edit}Edit Profile</button>
                            </div>


                        </div>

                    </div>


                    <div className="w-full lg:w-2/5 ">
                        {userDetails[0]?.proPic && showPhoto ? (
                            <div className="rounded-none lg:rounded-lg shadow-2xl bg-slate-400 hidden lg:block w-full lg:w-5/5">
                                <label htmlFor="fileInput1" className="cursor-pointer text-white hover:text-gray-300 ">
                                </label>
                                <img
                                    src={userDetails[0]?.proPic}

                                    className="rounded-none lg:rounded-lg shadow-2xl hidden lg:block w-72 h-96 "
                                    alt={userDetails[0]?.proPic}
                                    onDoubleClick={() => setShowPhoto(!showPhoto)}
                                />


                            </div>
                        ) : (
                            <div className="rounded-none lg:rounded-lg shadow-2xl bg-slate-400 hidden lg:block w-full lg:w-5/5">
                                <div className="h-96 w-96 flex flex-col justify-center items-center">
                                    <label
                                        htmlFor="fileInput"
                                        className="cursor-pointer text-white hover:text-gray-300 "
                                    >
                                        Click to add photo
                                    </label>
                                    <input
                                        type="file"
                                        id="fileInput"
                                        className="hidden"
                                        onChange={saveImage}

                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>)
            }
        </div>

    )
}

export default UserProfile