import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import userAxios from '../../../../axios/userAxios'
import { faShoppingCart, faCartShopping, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { updateClientState, updateReduxCart } from '../../../../redux/client';
import { ToastContainer, toast } from 'react-toastify';
import ModalComp from './OrderSuccess'

import {
    PerfectScrollbar,
    initTE, Modal

} from "tw-elements";
import OrderConfirm from './checkOut';
import CheckOut from './checkOut';

function MenuList() {
    useEffect(() => {
        setTimeout(() => {
            initTE({ PerfectScrollbar, Modal });
        }, 100); // Adjust the delay as needed
    })


    const dispatch = useDispatch()
    const [cart, setCart] = useState(null)
    const [selectedDishId, setDishId] = useState(null)
    const [dishes, setDishes] = useState(null)
    const [cartTotal, setCartTotal] = useState('')
    const [reload, setReload] = useState(true)
    const [paymentMode, setPaymentMode] = useState('')
    const uselocation = useLocation()
    const [deliveryMode, setDeliveryMode] = useState('');
    const queryParams = new URLSearchParams(uselocation.search)
    const restaurantId = queryParams.get('restoId')
    const viewDish = dishes?.filter((dish) => dish._id === selectedDishId)
    const [modalImgIndx, setModalImgIndx] = useState(0)
    const [orderId, setOrderId] = useState(null)


    const reduxCart = useSelector((state => state.client.cart))
    const { phone, state } = useSelector((state) => state.client)
    const cartFiltered = reduxCart.filter((item) => item.userId === phone)
    console.log(state, '000000000')
    const navigate = useNavigate()
    useEffect(() => {
        setCart(cartFiltered)
    }, [reload])
    const incIndex = () => {
        if (modalImgIndx < viewDish[0].images.length - 1) {
            setModalImgIndx(modalImgIndx + 1)
        } else {
            setModalImgIndx(0)
        }
    }
    const decIndex = () => {
        if (modalImgIndx > 0) {
            setModalImgIndx(modalImgIndx - 1)
        } else {
            setModalImgIndx(viewDish[0].images.length - 1)
        }
    }

    useEffect(() => {

        userAxios.get(`/menuList?restaurantId=${restaurantId}`).then((res) => {
            setDishes(res.data.dishes)
        }).catch((err) => {
            console.log(err)
        })
    }, [])


    const dishView = (dishId) => {
        setDishId(dishId)

    }
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

    useEffect(() => {
        const cartValue = cart?.filter((item) => dishes?.some((dish) => dish._id === item.item))
            .map((item) => ({
                price: parseFloat(
                    dishes.find((dish) => dish._id === item.item)?.price || 0
                ),
                qnty: item.qnty || 0,
            }));

        // const total = cartValue?.reduce((acc, curr) => acc += curr, 0);
        const total = cartValue?.reduce((acc, curr) => acc += curr.price * curr.qnty, 0);

        setCartTotal(total);
    }, [cart, dishes])

    const addToCart = (newItemId) => {
        if (!cart.some((item) => item.item === newItemId)) {
            dispatchfn(newItemId)
            setReload(!reload)

            toast.success('item added to cart', { position: 'bottom-center' })
        } else {

            dispatchfn(newItemId, 'inc')
            toast.success('cart quantity incremented', { position: 'bottom-center' })
        }
    }
    const deleteCart = (id) => {
        const updatedCart = cart.filter(item => item.item !== id && item.userId == phone);
        dispatch(updateReduxCart({ cart: updatedCart, phone: phone }))
        toast.success('item removed from cart')
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

    const clearCart = () => {
        dispatch(updateReduxCart({ cart: [], phone: phone }))
        toast.success('cart is cleared')
        setReload(!reload);
    }

    const orderDish = async () => {
        if (paymentMode === 'online') {
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
                                userAxios.post('/orderDish', { cart: cart, cartTotal: cartTotal, dishes: dishes, restaurantId: restaurantId, phone: phone, paymentMode: paymentMode, deliveryMode: deliveryMode })
                                    .then((res) => {
                                        toast.success(res.data.message)
                                        // dispatch(updateClientState({ state: 'restoView' }))
                                        setOrderId(res.data.orderId)
                                        dispatch(updateClientState({ state: 'orderSuccess' }))
                                        // navigate('/myOrders')
                                        dispatch(updateReduxCart({ cart: [] }))
                                        setReload(!reload)
                                        setPaymentMode('')
                                        setDeliveryMode('')
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
            userAxios.post('/createOrder', { cart: cart, cartTotal: cartTotal, dishes: dishes, restaurantId: restaurantId, phone: phone, paymentMode: paymentMode, deliveryMode: deliveryMode })
                .then((res) => {
                    initPayment(res.data.data)
                }).catch((err) => {
                    console.log(err)
                })
        } else {
            userAxios.post('/orderDish', { cart: cart, cartTotal: cartTotal, dishes: dishes, restaurantId: restaurantId, phone: phone, paymentMode: paymentMode, deliveryMode: deliveryMode }).then((res) => {
                toast.success('Order placed Successfully')
                setOrderId(res.data.orderId)
                dispatch(updateClientState({ state: 'orderSuccess' }))
                dispatch(updateReduxCart({ cart: [] }))
                // dispatch(updateClientState({ state: 'restoView' }))
                // navigate('/myOrders')
                setReload(!reload)
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    const checkOut = () => {
        dispatch(updateClientState({ state: 'checkout' }))
        setReload(!reload)
    }

    const deliveryModeCB = (deliveryModeValue) => {
        if (deliveryModeValue) {
            setDeliveryMode(deliveryModeValue)
        }
    }
    return (
        <>
            {state == 'orderSuccess' ?
                <ModalComp cart={cart} dishes={dishes} cartTotal={cartTotal} orderId={orderId} /> :
                (<div className='p-14 bg-red-800 text-slate-300 h-full'>
                    <ToastContainer />
                    <div className='flex flex-wrap justify-between w-full'>
                        {/* {cartTotal != 0 ? (
                            <div className='w-3/12 '>
                                <div className='bg-gray-600 p-5 px-8 space-y-8 h-screen pb-10 overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-white' >
                                    <h1 className='text-sm font-semibold text-[#fff] text-center'>{state === 'checkout' ? 'CHECKOUT' : 'CART'}</h1>
                                    {dishes ? dishes.filter((dish) => cart?.some((obj) => obj.item === dish._id)).map((filteredDish) => (
                                        <div key={filteredDish._id} className='flex justify-between text-white'>
                                            {state != 'checkout' ? <span  onClick={() => deleteCart(filteredDish._id)} ><FontAwesomeIcon icon={faCircleXmark} className='text-red-600' /></span> : ''}
                                            <span className='text-white'>{filteredDish.dishName}</span>
                                            <span className='text-white'>{cart.find((item) => item.item === filteredDish._id)?.qnty || 0}</span>
                                            <span className='text-white'>{filteredDish.price}</span>
                                        </div>
                                    )) : ''}
                                    <p className='text-end mt-5 text-white'>Cart Total:{cartTotal}</p>
                                    {state === 'checkout' ?
                                        <div className='flex flex-col space-y-5 bg-gray-500 p-5 text-white'>
                                            <h1 >Payment Method</h1>

                                            <div className=''>
                                                <div className="inline-flex items-center">
                                                    <label
                                                        className="relative flex cursor-pointer items-center rounded-full p-3"
                                                        for="html"
                                                        data-ripple-dark="true"
                                                    >
                                                        <input
                                                            id="html"
                                                            name="ripple"
                                                            type="radio"
                                                            value={'cash'}
                                                            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-yellow-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-yellow-500 checked:before:bg-yellow-500 hover:before:opacity-10"
                                                            onClick={() => setPaymentMode('cash')}
                                                        />
                                                        <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-yellow-500 opacity-0 transition-opacity peer-checked:opacity-100">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-3.5 w-3.5"
                                                                viewBox="0 0 16 16"
                                                                fill="currentColor"
                                                            >
                                                                <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                                                            </svg>
                                                        </div>
                                                    </label>
                                                    <label
                                                        className="mt-px cursor-pointer select-none font-light text-white"
                                                        for="html"
                                                    >
                                                        Cash Payment
                                                    </label>
                                                </div>
                                                <div className="inline-flex items-center">
                                                    <label
                                                        className="relative flex cursor-pointer items-center rounded-full p-3"
                                                        for="ripple-off"
                                                    >
                                                        <input
                                                            id="ripple-off"
                                                            name="ripple"
                                                            type="radio"
                                                            value={'online'}
                                                            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-yellow-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-yellow-500 checked:before:bg-yellow-500 hover:before:opacity-10"
                                                            onClick={() => setPaymentMode('online')}

                                                        />
                                                        <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-yellow-500 opacity-0 transition-opacity peer-checked:opacity-100">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-3.5 w-3.5"
                                                                viewBox="0 0 16 16"
                                                                fill="currentColor"
                                                            >
                                                                <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                                                            </svg>
                                                        </div>
                                                    </label>
                                                    <label
                                                        className="mt-px cursor-pointer select-none font-light text-white"
                                                        for="ripple-off"
                                                    >
                                                        Online Payment
                                                    </label>
                                                </div>
                                            </div>
                                            <span className='text-xs'>{paymentMode ? <span className='text-blue-300'>You have selected {paymentMode} payment </span> : <span className='text-red-300 '>Select a Payment Mode to order now</span>}</span> */}
                        {/* </div> */}
                        {/* </div>
                                        : ''}
                                    <div className='flex justify-between'>
                                        {state != 'checkout' ? <button className='bg-red-800 px-3 py-1 text-xs text-white mt-5' onClick={clearCart}>clear</button> : null}

                                        {state != 'checkout' ? <button className='bg-indigo-500 px-3 py-1 text-xs text-white mt-5 ' onClick={checkOut} >Proceed to checkout</button> : <>{paymentMode && deliveryMode ? <button className='bg-indigo-800 px-3 py-1 text-xs text-white mt-5 ' onClick={orderDish} >Order now</button> : ''}</>}
                                    </div>
                                </div>
                            </div>
                        ) : ''} */}
                        {state === 'checkout' ?

                            <CheckOut paymentMode={paymentMode} deliveryMode={deliveryModeCB} />
                            :
                            <>
                                {/* <div className={`${cartTotal != 0 ? 'w-9/12' : 'w-full'} grid md:grid-cols-2 sm:cols-1 justify-around h-screen overflow-y-auto scrollbar-thin scroll-smooth scrollbar-thumb-gray-100 scrollbar-track-white overflow-x-none `}  >
                                    {dishes ? dishes.map((dish, index) => (
                                        <div key={index} className='m-3 bg-gray-300 flex w-80 h-48 justify-between hover:shadow-md hover:-translate-y-0.5 bg-cover' onClick={() => dishView(dish._id)} >
                                            <div className='p-3 pl-5 w-full'>
                                                <h1 className='text-sm text-black m-3 font-semibold'>{dish.dishName}</h1>
                                                <h1 className='text-sm text-gray-800 m-3'>{dish.category}</h1>
                                                <h1 className='text-sm text-gray-800 m-3'>Rs.{dish.price}</h1>
                                            </div>
                                            <div className='flex w-full items-end mb-4 mr-4'>
                                                <div className='w-full flex justify-start'>
                                                    <button
                                                        type='button'
                                                        className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs py-1 px-2 rounded-full ml-2"
                                                        title='decrement cart'
                                                        onClick={(e) => {
                                                            cartDecrement(dish._id);
                                                            e.stopPropagation();
                                                        }}
                                                    >-
                                                    </button>
                                                    <button
                                                        type='button'
                                                        className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs py-1 px-2 rounded-full ml-2"
                                                        title='increment to cart'
                                                        onClick={(e) => {
                                                            addToCart(dish._id);
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    type='button'
                                                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs py-2 px-4 rounded-full ml-2"
                                                    title='Add to cart'
                                                    onClick={(e) => {
                                                        addToCart(dish._id);
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faShoppingCart} />
                                                </button>


                                            </div>
                                            <img src={dish.images[0]} alt="" className='w-48 h-48' data-te-toggle="modal"
                                                data-te-target="#exampleModalCenter"
                                                data-te-ripple-init
                                                data-te-ripple-color="light" /> 
                                        </div>
                                    )) : ''}
                                </div> */}

                                {/* <div className={`${cartTotal != 0 ? 'w-9/12' : 'w-full'} grid md:grid-cols-2 sm:cols-1 justify-around h-screen overflow-y-auto scrollbar-thin scroll-smooth scrollbar-thumb-gray-100 scrollbar-track-white overflow-x-none `}  > */}

                                <div class={`w-screen grid md:grid-cols-5 md:gap-x-5 gap-y-10 h-full  justify-center items-center `} >
                                    {dishes ? dishes.map((dish, index) => (
                                        <div key={index} class="w-60 p-6 bg-gray-100  sm:my-0 hover:bg-white hover:bg-opacity-20  bg-opacity-20 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all transform duration-500 " onClick={() => dishView(dish._id)} >
                                            <img class="h-36 w-64 object-cover rounded-t-md cursor-pointer" src={dish.images[0]} alt="" data-te-toggle="modal"
                                                data-te-target="#exampleModalCenter"
                                                data-te-ripple-init
                                                data-te-ripple-color="light" />
                                            <div class="mt-4">
                                                <h1 class="text-lg font-bold ">{dish.dishName}</h1>
                                                <p class="text-sm mt-2 ">{dish.category}</p>
                                                <div class="mt-3 space-x-4 flex justify-end p-1">
                                                    <div>
                                                        <button className='px-3 text-white bg-blue-600 bg-opacity-50 mx-2 rounded-lg hover:bg-red-500' onClick={(e) => {
                                                            cartDecrement(dish._id);
                                                            e.stopPropagation();
                                                        }}>-</button>
                                                        <button className='px-3 text-white bg-blue-600 bg-opacity-50 mx-2 hover:bg-red-500 rounded-lg' onClick={(e) => {
                                                            addToCart(dish._id);
                                                            e.stopPropagation();
                                                        }}>+</button>
                                                    </div>

                                                </div>
                                                <div class="mt-4 mb-2 flex justify-between pl-4 pr-2">
                                                    <button class="block text-lg font-semibold hover:bg-transparent cursor-auto">Rs.{dish.price}</button>
                                                    <button class="text-lg block font-semibold py-2 px-6 text-green-100 hover:text-white hover:bg-red-500 bg-blue-600 bg-opacity-50 rounded-lg shadow hover:shadow-md transition duration-300"
                                                        onClick={(e) => {
                                                            addToCart(dish._id);
                                                            e.stopPropagation();
                                                        }}><FontAwesomeIcon icon={faCartShopping} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    )) : ''}
                                </div>
                                {/* </div> */}
                            </>
                        }

                        {/* .........................modal............................. */}

                        <div
                            data-te-modal-init
                            className="fixed left-0 top-10 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
                            id="exampleModalCenter"
                            tabIndex="-1"
                            aria-labelledby="exampleModalCenterTitle"
                            aria-modal="true"
                            role="dialog"
                        >
                            <div
                                data-te-modal-dialog-ref
                                className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:min-h-[calc(100%-3.5rem)] min-[576px]:max-w-[800px] "
                            >
                                <div className="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-red-800 bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
                                    <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                                        {/* Modal title */}
                                        <h5 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200" id="exampleModalCenterTitle">
                                            Dish Details
                                        </h5>
                                        {/* Close button */}
                                        <button
                                            type="button"
                                            className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                                            data-te-modal-dismiss
                                            aria-label="Close"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Modal body */}
                                    <div className="relative p-4">
                                        <div className="p-5 space-y-5 rounded-xl">
                                            <button className="text-gray-300  mt-20 ml-10 bg-blue-800 py-2 px-3 text-sm shadow-xl hover:bg-blue-600 hover:text-white absolute right-24 top-6" onClick={() => setState('menu')}>Back to Menu</button>
                                            <div className="flex justify-center h-full shadow-xl shadow-black/5 dark:shadow-black/30">
                                                <div className="bg-slate-100 md:h-72 h-10 relative flex min-w-full shadow-2xl">
                                                    <div className="bg-yellow-800 w-2/5 h-full flex items-center relative">
                                                        <span className="text-4xl font-extrabold text-gray-400 absolute left-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer hover:text-3xl hover:text-red-600 hover:bg-transparent" onClick={decIndex}>{'<'}</span>
                                                        {viewDish && viewDish.length > 0 ? (
                                                            <img
                                                                src={viewDish[0].images[modalImgIndx >= viewDish[0].images.length ? 0 : modalImgIndx]}
                                                                alt={modalImgIndx}
                                                                className="w-full h-full relative"
                                                            />
                                                        ) : (
                                                            <p>No dish selected or dish not found.</p>
                                                        )}
                                                        <span className="text-4xl font-extrabold text-gray-400 absolute right-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer hover:text-3xl hover:text-red-600" onClick={incIndex}>{'>'}</span>
                                                    </div>
                                                    <div className="w-3/5 h-full p-5 pt-8 space-x-1 space-y-5">
                                                        {/* Content for the red section */}
                                                        <div className="flex justify-center">
                                                            <h1 className="text-gray-800 text-xl font-bold">{viewDish ? viewDish[0]?.dishName : ''}</h1>
                                                        </div>
                                                        <div className="space-y-5 max-w-md text-gray-800">
                                                            <p>{viewDish ? viewDish[0]?.category : ''}</p>
                                                            <p>Rs.{viewDish ? viewDish[0]?.price : ''}</p>
                                                            <p>{viewDish ? viewDish[0]?.description : ''}</p>
                                                        </div>
                                                        <div className="flex w-full">
                                                            <button className="text-gray-300  bg-indigo-800 px-5 py-1 shadow-xl text-sm hover:bg-indigo-600 hover:text-white" onClick={(e) => {
                                                                addToCart(viewDish[0]._id);
                                                            }}><FontAwesomeIcon icon={faShoppingCart} /></button>
                                                            {/* <button className="text-gray-300 mt-20 ml-10 bg-blue-800 py-2 px-3 text-sm shadow-xl hover:bg-blue-600 hover:text-white" onClick={() => orderDish(viewDish[0]._id)}>Order Now</button> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal footer */}
                                    <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                                        <button
                                            type="button"
                                            className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                                            data-te-modal-dismiss
                                            data-te-ripple-init
                                            data-te-ripple-color="light"
                                        >
                                            Close
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div >
                </div >)
            }
        </>
    )
}

export default MenuList