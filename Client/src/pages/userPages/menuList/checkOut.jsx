import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateClientState, updateClientWallet, updateReduxCart } from '../../../../redux/client'
import AddressForm from './addressForm'
import { useLocation, useNavigate } from 'react-router-dom'
import CryptoJS from 'crypto-js';
import DeliveryAddressForm from './deliveryAddressForm'
import userAxios from '../../../../axios/userAxios'
import { ToastContainer, toast } from 'react-toastify'

function CheckOut() {

    const { cart, phone, state, wallet } = useSelector(state => state.client)
    console.log(cart, phone)
    const [reload, setReload] = useState(true)


    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };
    const query = useQuery();
    const encryptCartTotal = query.get('encryptCartTotal');
    const deliveryMode = query.get('deliveryMode');
    const jsonCartDishData = query.get('cartDishDetails');
    const jsonRestoData = query.get('restoDetails');
    const cartDishDetails = JSON.parse(jsonCartDishData);
    const restoDetails = JSON.parse(jsonRestoData);
    console.log(restoDetails, 'yyyyyyy', encryptCartTotal)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [payment, setPayment] = useState(null)
    const [address, setAddress] = useState('')
    const [addressState, setAddressState] = useState(null)
    const [orderId, setOrderId] = useState(null)

    const getAddress = (address) => {
        setAddress(address)
        setReload(!reload)
    }

    useEffect(() => {

    }, [reload])
    const secretPassphrase = 'MySecretPassphrase';

    const decryptingData = (data) => {
        const bytes = CryptoJS.AES.decrypt(data, secretPassphrase);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted
    };
    const decryptedCartTotal = encryptCartTotal !== null ? decryptingData(encryptCartTotal) : null;
    console.log(decryptedCartTotal, 'rrrrrr')
    const orderDish = async () => {
        if (payment === 'Online') {
            const initPayment = (data) => {
                const options = {
                    key: 'rzp_test_EWUJbMjY8cGv66',
                    amount: data.amount * 100,
                    currency: data.currency,
                    name: 'restro plaza',
                    description: 'Test Transaction',
                    order_id: data.id,
                    handler: async (res) => {
                        try {
                            userAxios.post('/verifyRazorpay', res).then((res) => {
                                userAxios.post('/orderDish', { cart: cart, cartTotal: decryptedCartTotal, cartDishDetails: cartDishDetails, restaurantId: restoDetails._id, phone: phone, paymentMode: payment, deliveryMode: deliveryMode })
                                    .then((res) => {
                                        toast.success(res.data.message)
                                        setOrderId(res.data.orderId)
                                        dispatch(updateClientWallet({ wallet: res.data.wallet }))
                                        dispatch(updateReduxCart({ cart: [] }))
                                        navigate(`/orderSuccess`)
                                        // setReload(!reload)
                                        setPayment('')
                                    }).catch((err) => {
                                        console.log(err)
                                        alert(err)
                                    })
                            }).catch((err) => {
                                console.log(err)
                            })

                        } catch (error) {
                            console.log(error)
                        }
                    }
                }
                const rzp1 = new window.Razorpay(options)
                rzp1.open()
            }
            userAxios.post('/createOrder', { cart: cart, cartTotal: decryptedCartTotal, cartDishDetails: cartDishDetails, restaurantId: restoDetails._id, phone: phone, paymentMode: payment, deliveryMode: deliveryMode })
                .then((res) => {
                    initPayment(res.data.data)
                }).catch((err) => {
                    console.log(err)
                })
        } else {
            userAxios.post('/orderDish', { cart: cart, cartTotal: decryptedCartTotal, cartDishDetails: cartDishDetails, restaurantId: restoDetails._id, phone: phone, paymentMode: payment, deliveryMode: deliveryMode }).then((res) => {

                toast.success('Order placed Successfully')
                setOrderId(res.data.orderId)
                dispatch(updateClientWallet({ wallet: res.data.wallet }))
                dispatch(updateReduxCart({ cart: [] }))
                navigate(`/orderSuccess`)
                setPayment('')
                setReload(!reload)
            }).catch((err) => {
                console.log(err)
            })
        }
    }
    return (
        // <div className='w-3/4 space-x-10 space-y-10 ' >
        //     <div className='flex justify-between w-full'>
        //         <div>
        //         </div>
        //         <h1>CheckOut</h1>
        //         <button className='bg-blue-400 text-xs px-5 py-2' onClick={() => navigate(-1)}>back</button>

        //     </div>
        //     <div className=''>
        //         <div className=''>
        //             <p>How do You want to collect this order?:</p>
        //             <div className='p-10 flex flex-col w-full bg-slate-400 '>
        //                 <div className="inline-flex items-center">
        //                     <label
        //                         className="relative flex cursor-pointer items-center rounded-full p-3"
        //                         for="ripple-off1"
        //                     >
        //                         <input
        //                             id="ripple-off1"
        //                             name="deliveryMode"
        //                             type="radio"
        //                             value={'doorstepDelivery'}
        //                             className="before:content[''] peer relative h-5 w-5 cursor-pointer  rounded-full border border-gray-200 text-gray-800 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-white before:opacity-0 before:transition-opacity checked:border-white checked:before:bg-white hover:before:opacity-10"
        //                             onClick={() => setDeliveryMode('DoorStep')}
        //                         />
        //                         <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-gray-500 opacity-0 transition-opacity peer-checked:opacity-100">
        //                             <svg
        //                                 xmlns="http://www.w3.org/2000/svg"
        //                                 className="h-3.5 w-3.5"
        //                                 viewBox="0 0 16 16"
        //                                 fill="currentColor"
        //                             >
        //                                 <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
        //                             </svg>
        //                         </div>
        //                     </label>
        //                     <label
        //                         className="mt-px cursor-pointer select-none font-light text-black"
        //                         for="ripple-off1"
        //                     >
        //                         Door-step Delivery
        //                     </label>
        //                 </div>
        //                 <div className="inline-flex items-center">
        //                     <label
        //                         className="relative flex cursor-pointer items-center rounded-full p-3"
        //                         for="ripple-off2"
        //                     >
        //                         <input
        //                             id="ripple-off2"
        //                             name="deliveryMode"
        //                             type="radio"
        //                             value={'eatOnTable'}
        //                             className="before:content[''] peer relative h-5 w-5 cursor-pointer  rounded-full border border-gray-200 text-gray-800 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-white before:opacity-0 before:transition-opacity checked:border-white checked:before:bg-white hover:before:opacity-10"
        //                             onClick={() => setDeliveryMode('Eat')}
        //                         />
        //                         <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-gray-500 opacity-0 transition-opacity peer-checked:opacity-100">
        //                             <svg
        //                                 xmlns="http://www.w3.org/2000/svg"
        //                                 className="h-3.5 w-3.5"
        //                                 viewBox="0 0 16 16"
        //                                 fill="currentColor"
        //                             >
        //                                 <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
        //                             </svg>
        //                         </div>
        //                     </label>
        //                     <label
        //                         className="mt-px cursor-pointer select-none font-light text-black"
        //                         for="ripple-off2"
        //                     >
        //                         Eat on Table
        //                     </label>
        //                 </div>
        //                 <div className="inline-flex items-center">
        //                     <label
        //                         className="relative flex cursor-pointer items-center rounded-full p-3"
        //                         for="ripple-off2"
        //                     >
        //                         <input
        //                             id="ripple-off3"
        //                             name="deliveryMode"
        //                             type="radio"
        //                             value={'TakeAway'}
        //                             className="before:content[''] peer relative h-5 w-5 cursor-pointer  rounded-full border border-gray-200 text-gray-800 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-white before:opacity-0 before:transition-opacity checked:border-white checked:before:bg-white hover:before:opacity-10"
        //                             onClick={() => setDeliveryMode('TakeAway')}
        //                         />
        //                         <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-gray-500 opacity-0 transition-opacity peer-checked:opacity-100">
        //                             <svg
        //                                 xmlns="http://www.w3.org/2000/svg"
        //                                 className="h-3.5 w-3.5"
        //                                 viewBox="0 0 16 16"
        //                                 fill="currentColor"
        //                             >
        //                                 <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
        //                             </svg>
        //                         </div>
        //                     </label>
        //                     <label
        //                         className="mt-px cursor-pointer select-none font-light text-black"
        //                         for="ripple-off3"
        //                     >
        //                         Take Away
        //                     </label>
        //                 </div>
        //                 <div className='space-x-7'>
        //                     <span className='text-xs'>{deliveryMode ? <span className='text-blue-100'>You have selected {deliveryMode} </span> : <span className='text-red-500 '>Select a Payment Mode to order now</span>}</span>
        //                     <span className='text-xs'>{deliveryMode === 'DoorStep' && address === '' ? <span className='text-red-500'>Please give Delivery address below</span> : null}</span>
        //                 </div>
        //             </div>

        //         </div>
        //     </div>
        //     {deliveryMode === 'DoorStep' ?
        //         <div className='w-96 h-1/2 bg-slate-600 pt-10 text-white'>
        //             <AddressForm getAddress={getAddress} />
        //         </div> : ""}
        // </div>

        <div className='h-full'>
            <ToastContainer />
            <main className="m-10 bg-white h-full">
                <div className="container mx-auto px-6">
                    <h3 className="text-gray-700 text-2xl font-medium">Checkout</h3>
                    <div className="flex flex-col lg:flex-row mt-8">
                        <div className="w-full lg:w-1/2 order-2">

                            <form className="mt-8 lg:w-3/4" onSubmit={(e) => e.preventDefault()}>
                                <div>
                                    <h4 className="text-sm text-gray-500 font-medium">Payment method</h4>
                                    <div className="mt-6">
                                        <button htmlFor='offline' className="flex items-center justify-between w-full bg-white rounded-md border-2 p-4 focus:outline-none ">
                                            <label className="flex items-center w-full h-full hover:cursor-pointer " >
                                                <input name='paymentMode' value='cash' type="radio" id='offline' onClick={() => setPayment('Cash')} className="form-radio h-5 w-5 text-blue-600" /><span className="ml-2 text-sm text-gray-700">Cash</span>
                                            </label>

                                            <span className="text-gray-400 text-sm">Rs:{decryptedCartTotal}</span>
                                        </button>
                                        <button htmlFor='online' className="mt-6 flex items-center justify-between w-full bg-white rounded-md border p-4 focus:outline-none ">
                                            <label className="flex items-center h-full hover:cursor-pointer w-full" >
                                                <input type="radio" name='paymentMode' value='online' id='online' onClick={() => setPayment('Online')} className="form-radio h-5 w-5 text-blue-600" /><span className="ml-2 text-sm text-gray-700">Online</span>
                                            </label>

                                            <span className="text-gray-400 text-sm">Rs:{decryptedCartTotal}</span>
                                        </button>
                                        <button htmlFor='online' className="mt-6 flex items-center justify-between w-full bg-white rounded-md border p-4 focus:outline-none ">
                                            <label className="flex items-center h-full hover:cursor-pointer w-full" >
                                                <input type="radio" name='paymentMode' disabled={wallet < decryptedCartTotal} value='online' id='online' onClick={() => setPayment('Wallet')} className="form-radio h-5 w-5 text-blue-600" /><span className="ml-2 text-sm text-gray-700">Wallet</span>
                                            </label>

                                            {wallet < decryptedCartTotal ? <small className='text-red-600 text-xs w-full'>Insufficient balance in wallet</small> : null}
                                            <span className="text-gray-400 text-sm">Rs:{decryptedCartTotal}</span>
                                        </button>
                                        {console.log(payment, 'jjjjj')}
                                        {payment != null ? <h1 className='text-green-600 text-center'>{payment} payment selected</h1> : <h1 className='text-xs text-red-400 text-center'>Please select your payment mode</h1>}
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <h4 className="text-sm text-gray-500 font-medium">Delivery address</h4>
                                    {/* <div className='flex'> */}
                                    <div className="mt-6 flex ">
                                        <label className="block  text-xs w-40">
                                            <select className={`${addressState === null || addressState === 'Choose Address here' ? 'text-red-500' : 'text-green-800'}form-select block`} onChange={(e) => setAddressState(e.target.value)}>
                                                <option value={null} >Choose Address here</option>
                                                <option >Home Address</option>
                                                <option >Work Address</option>
                                                <option >Other Address</option>
                                            </select>
                                        </label>
                                        {addressState === 'Other Address' ? <small className='text-blue-500 text-xs'>Fill the address below</small> : null}
                                    </div>
                                    {/* </div> */}
                                </div>
                            </form>
                            <div className='w-full mt-10  '>
                                {addressState === 'Other Address' ?
                                    <DeliveryAddressForm getAddress={getAddress} />
                                    : null}
                            </div>


                            <div className="flex items-center justify-between mt-8">
                                <button type='button' onClick={() => navigate(-1)} className="flex items-center text-gray-700 text-sm font-medium rounded hover:underline focus:outline-none">
                                    <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M7 16l-4-4m0 0l4-4m-4 4h18"></path></svg>
                                    <span className="mx-2">Back to Cart</span>
                                </button>
                                {payment === 'Cash' || payment === 'Online' || payment === 'Wallet' ?
                                    < button
                                        onClick={orderDish}
                                        className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
                                    >
                                        <span>Order now</span>
                                        <svg className="h-5 w-5 mx-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                        </svg>
                                    </button>
                                    : payment}


                            </div>
                        </div>
                        <div className="w-full mb-8 flex-shrink-0 order-1 lg:w-1/2 lg:mb-0 lg:order-2">
                            <div className="flex justify-center lg:justify-end">
                                <div className="border rounded-md max-w-md w-full px-4 py-3">
                                    <div className='flex justify-between mb-10 items-center'>
                                        <span className="font-semibold text-lg uppercase text-center">{restoDetails?.resto_name} </span>
                                        <img className='w-20 h-20' src={restoDetails?.logo} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-gray-700 font-medium">Order items ({cart?.length})</h3>
                                        <span className="text-gray-600 text-sm">{deliveryMode} delivery</span>
                                        <span className="text-gray-600 text-sm">Rs {decryptedCartTotal}</span>
                                    </div>
                                    <div className="flex-col space-y-5  mt-6 w-full h-96 overflow-y-auto">
                                        {cartDishDetails?.map((item) => (
                                            <div className="flex">
                                                <img className="h-20 w-20 object-cover rounded" src={item.images[0]} alt="" />
                                                <div className="mx-3">
                                                    <h3 className="text-sm text-gray-600">{item.dishName}</h3>
                                                    <div className="flex items-center mt-2">
                                                        <span className="text-gray-700 mx-2">{cart?.map((cartItem) => cartItem.item === item._id ? cartItem.qnty : null)} Qnty</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {/* <span className="text-gray-600 text-end w-full"></span> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main >

            <footer className="bg-red-700">
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <a href="#" className="text-xl font-bold text-gray-400 hover:text-gray-400">Resto Plaza</a>
                    <p className="py-2 text-gray-400 sm:py-0">All rights reserved</p>
                </div>
            </footer>
        </div >
    )
}

export default CheckOut