import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateClientState, updateReduxCart } from '../../../../redux/client';
import userAxios from '../../../../axios/userAxios'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import {
    PerfectScrollbar,
    initTE, Modal

} from "tw-elements";
import CryptoJS from 'crypto-js';


function Cart() {

    useEffect(() => {
        setTimeout(() => {
            initTE({ PerfectScrollbar, Modal });
        }, 100); // Adjust the delay as needed
    })
    const navigate = useNavigate();
    const [cart, setCart] = useState(null)
    const [dishes, setDishes] = useState(null)
    const [reload, setReload] = useState(true)
    const [cartTotal, setCartTotal] = useState(null)
    const dispatch = useDispatch()
    const [deliveryMode, setDeliveryMode] = useState(null);

    const reduxCart = useSelector((state => state.client.cart))
    const { restoId } = useSelector((state => state.client))
    const { phone, state } = useSelector((state) => state.client)
    const cartFiltered = reduxCart.filter((item) => item.userId === phone)
    const [restoDetails, setRestoDetails] = useState(null)
    useEffect(() => {

        userAxios.get(`/menuList?restaurantId=${restoId}`).then((res) => {
            setDishes(res.data.dishes)
            setRestoDetails(res.data.restaurantDetails)
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    useEffect(() => {
        setCart(cartFiltered)
    }, [reload])

    useEffect(() => {
        const cartValue = cart?.filter((item) => dishes?.some((dish) => dish._id === item.item))
            .map((item) => ({
                price: parseFloat(
                    dishes.find((dish) => dish._id === item.item)?.price || 0
                ),
                qnty: item.qnty || 0,
            }));

        const total = cartValue?.reduce((acc, curr) => acc += curr.price * curr.qnty, 0);

        setCartTotal(total);
    }, [cart, dishes])

    const dispatchfn = (newItemId, qnty) => {
        if (!qnty) {
            const newCart = [{ userId: phone, item: newItemId, qnty: 1 }, ...cart]
            dispatch(updateReduxCart(cart ? { cart: newCart } : { cart: [newItemId] }))
        } else {
            let oldQuant
            cart.map((item) => {
                if (item.item === newItemId) {
                    oldQuant = item.qnty
                }
            })
            const updatedCart = cart.filter(item => item.item != newItemId);
            updatedCart.push({ userId: phone, item: newItemId, qnty: oldQuant + 1 })
            setReload(!reload)
            dispatch(updateReduxCart({ cart: updatedCart, phone: phone }))
        }
    }

    const addToCart = (newItemId) => {
        if (!cart.some((item) => item.item === newItemId)) {
            dispatchfn(newItemId)
            toast.success('item added to cart', { position: 'bottom-center' })
        } else {

            dispatchfn(newItemId, 'inc')
            toast.success('cart quantity incremented', { position: 'bottom-center' })
        }
        setReload(!reload)
    }

    const deleteCart = (id) => {
        const updatedCart = cart.filter(item => item.item !== id && item.userId == phone);
        dispatch(updateReduxCart({ cart: updatedCart, phone: phone }))
        toast.success('item removed from cart', { position: 'bottom-center' })
        setReload(!reload);
    }
    const cartDecrement = (id) => {
        let oldQuant

        cart.map((item) => {
            if (item.item === id) {
                oldQuant = item.qnty
            }
        })
        if (oldQuant > 1) {
            const updatedCart = cart.filter(item => item.item != id);
            updatedCart.push({ userId: phone, item: id, qnty: oldQuant - 1 })
            setReload(!reload)
            dispatch(updateReduxCart({ cart: updatedCart, phone: phone }))
            toast.success('cart quantity decremented', { position: 'bottom-center' })

        } else {
            toast.error('Only one quantity added in cart')
        }
    }
    // const clearCart = () => {
    //     dispatch(updateReduxCart({ cart: [], phone: phone }))
    //     toast.success('cart is cleared')
    //     setReload(!reload);
    // }

    const secretPassphrase = 'MySecretPassphrase';
    const encryptingData = (data) => {
        const encrypted = CryptoJS.AES.encrypt(data.toString(), secretPassphrase).toString();
        return encrypted;
    };

    const encryptCartTotal = cartTotal !== null && cartTotal !== undefined ? encryptingData(cartTotal) : null;
    const cartDishDetails = dishes?.filter((dish) => cart?.some((obj) => obj.item === dish._id)).map((filteredDish) => filteredDish)
    console.log(cartDishDetails, 'uuuuuu')


    const checkOut = () => {
        const jsonDishData = JSON.stringify(cartDishDetails);
        const jsonRestoData = JSON.stringify(restoDetails);
        console.log(deliveryMode, 'ooooooo')
        if (deliveryMode === null) {
            toast.error('Please select delivery mode', { position: 'bottom-center' })
        } else {
            navigate(`/checkOut?encryptCartTotal=${encryptCartTotal}&&cartDishDetails=${jsonDishData}&&deliveryMode=${deliveryMode}&&restoDetails=${jsonRestoData}`)
        }
    }

    return (

        <div className="bg-red-800 h-screen">
            <ToastContainer />

            <div className="container mx-auto  ">
                <div className=" shadow-md my-10 md:flex md:flex-row flex flex-col">
                    <div className="md:w-3/4 bg-white px-10 py-10 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-white ">
                        <div className="flex justify-between border-b pb-8">
                            <h1 className="font-semibold text-2xl">Shopping Cart</h1>
                            <h2 className="font-semibold text-2xl">{cartFiltered?.length} items</h2>
                        </div>
                        <div className="flex mt-10 mb-5">
                            <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">Product Details</h3>
                            <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">Quantity</h3>
                            <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">Price</h3>
                            <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">Total</h3>
                        </div>
                        {dishes ? dishes.filter((dish) => cart?.some((obj) => obj.item === dish._id)).map((filteredDish) => (

                            <div className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5">
                                <div key={filteredDish._id} className="flex w-2/5">
                                    {/* <!-- product --> */}
                                    <div className="md:w-30">
                                        <img className="sm:h-8 sm:w-10 h-28" src={filteredDish.images[0]} alt="" />
                                    </div>
                                    <div className="flex flex-col justify-between ml-4 flex-grow">
                                        <span className="font-bold text-sm">{filteredDish.dishName}</span>
                                        <span className="text-red-500 text-xs">{filteredDish.category}</span>
                                        <a href="#" className="font-semibold hover:text-red-500 text-gray-500 text-xs" onClick={() => deleteCart(filteredDish._id)}>Remove</a>
                                    </div>
                                </div>
                                <div className="flex justify-center w-1/5">
                                    <svg onClick={(e) => {
                                        cartDecrement(filteredDish._id);
                                        e.stopPropagation();
                                    }}
                                        className="fill-current text-gray-600 w-3" viewBox="0 0 448 512"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                                    </svg>

                                    <input className="mx-2 border text-center w-8" type="text" value={cart.find((item) => item.item === filteredDish._id)?.qnty || 0} />


                                    <svg onClick={(e) => { addToCart(filteredDish._id), e.stopPropagation() }} className="fill-current text-gray-600 w-3" viewBox="0 0 448 512">
                                        <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                                    </svg>
                                </div>
                                <span className="text-center w-1/5 font-semibold text-sm">{filteredDish.price}</span>
                                <span className="text-center w-1/5 font-semibold text-sm">{filteredDish.price * cart.find((item) => item.item === filteredDish._id)?.qnty}</span>
                            </div>
                        )) : null}




                        <button onClick={() => navigate(-1)} href="#" className="flex font-semibold text-indigo-600 text-sm mt-10 hover:bg-transparent">

                            <svg className="fill-current mr-2 text-indigo-600 w-4" viewBox="0 0 448 512"><path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" /></svg>
                            Continue Shopping
                        </button>
                    </div>

                    <div id="summary" className="md:w-1/4 px-8 py-10 text-slate-300">
                        <div className='flex justify-between mb-10 items-center'>
                            <span className="font-semibold text-lg uppercase text-center">{restoDetails?.resto_name} </span>
                            <img className='w-20 h-20' src={restoDetails?.logo} />
                        </div>
                        <div className='flex justify-between' >
                            <h1 className="font-semibold text-2xl border-b pb-8">Order Summary</h1>
                        </div>
                        <div className="flex justify-between mt-10 mb-5">
                            <span className="font-semibold text-sm uppercase">{cartFiltered?.length} items</span>
                            <span className="font-semibold text-sm">{cartTotal}</span>
                        </div>
                        <div>
                            <label className="font-medium inline-block mb-3 text-sm uppercase">Delivery Type</label>
                            <select className="block p-2 text-gray-600 w-full text-sm" onChange={(e) => setDeliveryMode(e.target.value)}>
                                <option value={null}>Choose here delivery Mode</option>
                                <option value="Door Step">Door Step</option>
                                <option value="Take Away">Take Away</option>
                                <option value="Table Serve">Table Serve</option>
                            </select>

                        </div>
                        {deliveryMode === null ? <h1 className='mt-2 text-xs text-yellow-400 w-full text-center'>Please choose the delivery mode, then proceed</h1> : <h1 className='mt-2 text-xs w-full text-center'>You selected {deliveryMode} delivery</h1>}
                        {/* <div className="py-10">
                            <label for="promo" className="font-semibold inline-block mb-3 text-sm uppercase">Promo Code</label>
                            <input type="text" id="promo" placeholder="Enter your code" className="p-2 text-sm w-full" />
                        </div>
                        <button className="bg-red-500 hover:bg-red-600 px-5 py-2 text-sm text-white uppercase">Apply</button> */}
                        <div className="border-t mt-8">
                            <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                                <span>Total cost</span>
                                <span>{cartTotal}</span>
                            </div>
                            <button className="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full" onClick={checkOut}>Checkout</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    )
}

export default Cart