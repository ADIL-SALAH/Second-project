import React, { useEffect, useRef, useState } from 'react'
import restoAxios from '../../../../axios/restoAxios'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faHeart } from '@fortawesome/free-solid-svg-icons';
// import { AiFillHeart, BsChatSquareFill } from 'react-icons/ai';
import '@fortawesome/fontawesome-svg-core/styles.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import LoadingPage from '../../../loading';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


function RestoProfile() {
    const { restoName, phone } = useSelector((state) => state.resto)
    const [restoDetails, setDetails] = useState(null)
    const [proImg, setProImg] = useState('')
    const [photos, setPhotos] = useState({ img1: '', img2: '', img3: '', img4: '', img5: '', img6: '' })
    const [reload, setReload] = useState(true)
    const [location, setLocation] = useState('')
    const [state, setState] = useState('')
    // const [location, setLocation] = useState('')
    const [isLoading, setIsLoading] = useState('')
    const placeInput = useRef(null)
    const cityInput = useRef(null)
    const districtInput = useRef(null)
    const stateInput = useRef(null)
    const countryInput = useRef(null)
    const longitudeInput = useRef(null)
    const latitudeInput = useRef(null)
    // const imageRef1 = useRef(null)
    // const imageRef2 = useRef(null)
    // const imageRef3 = useRef(null)
    // const imageRef4 = useRef(null)
    // const imageRef5 = useRef(null)
    // const imageRef6 = useRef(null)

    useEffect(() => {
        restoAxios.get('/restoProfile')
            .then((res) => {
                setDetails(res.data.restoDetails)
                setProImg(res.data.restoDetails.logo)
            }).catch((err) => {
                console.log(err)
            })
    }, [reload, isLoading])

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setProImg(URL.createObjectURL(event.target.files[0]));
        }
        const formData = new FormData();
        formData.append('file', event.target.files[0]); // Use the actual variable name where you have the image file

        restoAxios.post('/updateLogo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set the correct content type for FormData
            }
        }).then((res) => {
            console.log(res)
            setReload(!reload)
        }).catch((err) => {
            console.log(err)
        })
    }


    const getLocation = () => {
        // navigator.geolocation.getCurrentPosition((pos) => {
        //     setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        // })
        axios.get('https://ipapi.co/json/').then((res) => {
            setLocation(res.data)
            setReload(!reload)
        }).catch((err) => {
            console.log(err)
        })
        setReload(!reload)
    }
    const saveAddress = () => {
        const inputValue = {
            place: placeInput.current.value,
            city: cityInput.current.value,
            district: districtInput.current.value,
            state: stateInput.current.value,
            country: countryInput.current.value,
            longitude: longitudeInput.current.value,
            latitude: latitudeInput.current.value,
        }

        restoAxios.post('/saveAddress', { inputValue: inputValue }).then((res) => {
            toast.success('address updated')
            setReload(!reload)
            setState('')
        }).catch((err) => {
            console.log(err)
        })
    }


    const photosHandle = (event, imageRef) => {
        setIsLoading(imageRef)
        toast.info('This may take a while, please wait')
        if (event.target.files && event.target.files[0]) {
            const fileUrl = URL.createObjectURL(event.target.files[0])

            // setPhotos({ ...photos, [imageRef]: fileUrl });
            const formData = new FormData();
            formData.append('file', event.target.files[0]);

            restoAxios.post('/addPhotos', formData).then((res) => {
                if (res.data.success) {
                    toast.success('photo updated successfully')
                    setReload(!reload)
                    setIsLoading('')

                } else {
                    toast.error('Please delete any photos to upload more')
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    const deletePhoto = (photo) => {
        restoAxios.delete('/deletePhoto', { data: { photo: photo } }).then((res) => {
            toast.success('photo successfully deleted')
            setReload(!reload)
        }).catch((err) => {
            toast.error('photo failed to delete')
        })
    }
    return (

        <div className='p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-20'>
            <ToastContainer />
            <div className='flex flex-col sm:flex-row justify-between items-center'>
                <div className='mb-4 sm:mb-0'>
                    <h1 className='text-xl font-bold'>{restoName}</h1>
                </div>
                <div className=' w-46 h-28'>
                    <label className='relative cursor-pointer text-center'>
                        <img src={proImg} alt='' width={150} />

                        <input
                            type='file'
                            name='logo'
                            className='absolute inset-0 opacity-0 cursor-pointer w-full h-full'
                            onChange={onImageChange}

                        />
                        {proImg ? "" : <label htmlFor="" className='text-white text-center'><small className='cursor-pointer hover:text-green-500'>click here to <br /> add photo</small></label>}
                    </label>
                </div>
                <div className='flex space-x-3 justify-center'>
                    <FontAwesomeIcon icon={faHeart} className='text-2xl text-red-600' />
                    <span>{restoDetails?.likesCount}</span>
                </div>
            </div>
            <div className='mt-4 sm:mt-6 md:mt-8 lg:mt-10 xl:mt-12'>
                <h1>RestoName: {restoName}</h1>
                <h1>Contact us: {phone}</h1>
                <div className='flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-5'>
                    <div className='bg-slate-200 sm:w-1/2 h-80 text-center p-4 sm:p-5 mt-4 sm:mt-0'>
                        <div>
                            {/* <h1>Permanent Address</h1> */}
                        </div>
                        <div className=' '>
                            {restoDetails?.address && state != 'edit' ? (
                                <div className='space-y-4 text-sm p-10'>
                                    <div className='space-y-4 flex justify-center text-sm '>
                                        <div className='space-y-4 w-2/3 '>
                                            <div className=' space-x-10 flex justify-between '>
                                                <p className='font-semibold'>Place:</p>
                                                <small>{restoDetails?.address.place}</small>
                                            </div>
                                            <div className=' space-x-10 flex justify-between'>
                                                <p className='font-semibold'>City:</p>
                                                <small>{restoDetails?.address.city}</small>
                                            </div>
                                            <div className=' space-x-10 flex justify-between'>
                                                <p className='font-semibold'>District:</p>
                                                <small>{restoDetails?.address.district}</small>                                            </div>
                                            <div className=' space-x-10 flex justify-between'>
                                                <p className='font-semibold'>State:</p>
                                                <small>{restoDetails?.address.state}</small>
                                            </div>
                                            <div className=' space-x-10 flex justify-between'>
                                                <p className='font-semibold'>Country:</p>
                                                <small>{restoDetails?.address.country}</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-end '>
                                        <button onClick={() => setState('edit')} className='text-xs text-blue-600'>Edit</button>
                                    </div>
                                </div>

                            ) : (

                                <div className='space-y-4 text-xs'>
                                    <h1 className='text-center text-lg'>{state === 'edit' ? 'Edit Address' : 'Add Address'}</h1>
                                    <div className='space-y-4 text-xs flex justify-center'>
                                        <div className='space-y-2 text-xs w-2/3 '>
                                            <div className=' space-x-10 flex justify-between '>
                                                <label htmlFor="">place</label>
                                                <input type="text" className='p-1 text-xs w-40' defaultValue={location ? location.city : restoDetails?.address?.place ? restoDetails.address.place : ''} ref={placeInput} />
                                            </div>
                                            <div className=' space-x-10 flex justify-between'>
                                                <label htmlFor="">City</label>
                                                <input type="text" className='p-1 text-xs w-40' defaultValue={location ? location.city : restoDetails?.address?.city ? restoDetails.address.city : ''} ref={cityInput} />
                                            </div>
                                            <div className=' space-x-10 flex justify-between'>
                                                <label htmlFor="">District</label>
                                                <input type="text" className='p-1 text-xs w-40' defaultValue={location ? location.city : restoDetails?.address?.place ? restoDetails.address.place : ''} ref={districtInput} />
                                            </div>
                                            <div className=' space-x-10 flex justify-between'>
                                                <label htmlFor="">State</label>
                                                <input type="text" className='p-1 text-xs w-40' defaultValue={location ? location.region : restoDetails?.address?.state ? restoDetails.address.state : ''} ref={stateInput} />
                                            </div>
                                            <div className=' space-x-10 flex justify-between'>
                                                <label htmlFor="">Country</label>
                                                <input type="text" className='p-1 text-xs w-40' defaultValue={location ? location.country_name : restoDetails?.address?.country ? restoDetails.address.country : ''} ref={countryInput} />
                                            </div>
                                            <div className=' space-x-4 flex justify-between text-xs'>
                                                <small className='flex justify-between space-x-5 md:w-sm sm:max-w-xs lg:sm'>
                                                    <label htmlFor="">longitude</label>
                                                    <input type="text" className='p-1 text-xs w-40' disabled value={location ? location.longitude : restoDetails?.location?.longitude ? restoDetails.location.longitude : ''} ref={longitudeInput} />
                                                    <label htmlFor="">Latitude</label>
                                                    <input type="text" className='p-1 text-xs w-40' disabled value={location ? location.latitude : restoDetails?.location?.latitude ? restoDetails.location.latitude : ''} ref={latitudeInput} />
                                                </small>
                                            </div>

                                        </div>
                                    </div>
                                    <div className='flex justify-between'>
                                        {state === 'edit' ? <button onClick={() => setState('')}>back</button> : ""}
                                        <button className='text-gray-600 text-md hover:text-gray-500' onClick={getLocation} title='use my location for using you current location'>use my location</button>
                                        {location ? <small className='text-red-600 text-left'>*Use my location maynot be accurate,Ensure it</small> : ''}
                                        <button className='text-green-600 text-md hover:text-green-800 ' onClick={saveAddress} >Save</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='bg-slate-200 sm:w-1/2  text-center p-4 sm:p-5 mt-4 sm:mt-0 space-y-5 max-h-80 '>
                        <h1 className='font-semibold '>Photos</h1>
                        <div className='flex justify-around'>
                            <div className='space-y-3'>
                                {restoDetails?.photos[0] ? isLoading == "img1" ? <LoadingPage /> : <div className='group text-center relative '>
                                    <FontAwesomeIcon icon={faTimes} className='text-red-700 hidden group-hover:block text-center cursor-pointer ' onClick={() => deletePhoto(restoDetails.photos[0])} />
                                    <img src={restoDetails.photos[0]} alt='' width={150} className='object-cover max-h-28 min-h-28  ' />
                                </div> : <>
                                    <input type='file' id='fileInput' className='text-xs hidden' onChange={(e) => { photosHandle(e, 'img1') }} />
                                    <label for="fileInput" className="px-2 py-1 text-xs bg-yellow-500 text-white rounded cursor-pointer">Add New</label>
                                </>}

                                {restoDetails?.photos[1] ? isLoading == "img2" ? <LoadingPage /> : <div className='group text-center relative  '>
                                    <FontAwesomeIcon icon={faTimes} className='text-red-700 hidden group-hover:block text-center cursor-pointer' onClick={() => deletePhoto(restoDetails.photos[1])} />
                                    <img src={restoDetails.photos[1]} alt='' width={150} className='object-cover max-h-24 min-h-28  ' />
                                </div> : restoDetails?.photos[0] ? (<><input type='file' id='fileInput' className='text-xs hidden' onChange={(e) => photosHandle(e, 'img2')} /><label for="fileInput" className="px-2 py-1 text-xs bg-yellow-500 text-white rounded cursor-pointer">Add New</label></>) : ''}
                            </div>
                            <div className='space-y-3'>
                                {restoDetails?.photos[2] ? isLoading == "img3" ? <LoadingPage /> : <div className='group text-center relative  '>
                                    <FontAwesomeIcon icon={faTimes} className='text-red-700 hidden group-hover:block text-center cursor-pointer  hover:opacity-80 hover:text-lg' onClick={() => deletePhoto(restoDetails.photos[2])} />
                                    <img src={restoDetails.photos[2]} alt='' width={150} className='object-cover max-h-24 min-h-28 ' />
                                </div> : restoDetails?.photos[1] ? (<><input type='file' id='fileInput' className='text-xs hidden' onChange={(e) => photosHandle(e, 'img3')} /><label for="fileInput" className="px-2 py-1 text-xs bg-yellow-500 text-white rounded cursor-pointer">Add New</label></>) : ''}

                                {restoDetails?.photos[3] ? isLoading == "img4" ? <LoadingPage /> : <div className='group text-center relative  '>
                                    <FontAwesomeIcon icon={faTimes} className='text-red-700 hidden group-hover:block text-center cursor-pointer' onClick={() => deletePhoto(restoDetails.photos[3])} />
                                    <img src={restoDetails.photos[3]} alt='' width={150} className='object-cover max-h-24 min-h-28  ' />
                                </div> : restoDetails?.photos[2] ? (<><input type='file' id='fileInput' className='text-xs hidden' onChange={(e) => photosHandle(e, 'img4')} /><label for="fileInput" className="px-2 py-1 text-xs bg-yellow-500 text-white rounded cursor-pointer">Add New</label></>) : ""}
                            </div>
                            <div className='space-y-3'>
                                {restoDetails?.photos[4] ? isLoading == "img5" ? <LoadingPage /> : <div className='group text-center relative  '>
                                    <FontAwesomeIcon icon={faTimes} className='text-red-700 hidden group-hover:block text-center cursor-pointer' onClick={() => deletePhoto(restoDetails.photos[4])} />
                                    <img src={restoDetails.photos[4]} alt='' width={150} className='object-cover max-h-24 min-h-28  ' />
                                </div> : restoDetails?.photos[3] ? (<><input type='file' id='fileInput' className='text-xs hidden' onChange={(e) => photosHandle(e, 'img5')} /><label for="fileInput" className="px-2 py-1 text-xs bg-yellow-500 text-white rounded cursor-pointer">Add New</label></>) : ''}

                                {restoDetails?.photos[5] ? isLoading == "img6" ? <LoadingPage /> : <div className='group text-center relative  '>
                                    <FontAwesomeIcon icon={faTimes} className='text-red-700 hidden group-hover:block text-center cursor-pointer' onClick={() => deletePhoto(restoDetails.photos[5])} />
                                    <img src={restoDetails.photos[5]} alt='' width={150} className='object-cover max-h-28 min-h-28  ' />
                                </div> : restoDetails?.photos[4] ? (<><input type='file' id='fileInput' className='text-xs hidden' onChange={(e) => photosHandle(e, 'img6')} /><label for="fileInput" className="px-2 py-1 text-xs bg-yellow-500 text-white rounded cursor-pointer">Add New</label></>) : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    )
}

export default RestoProfile