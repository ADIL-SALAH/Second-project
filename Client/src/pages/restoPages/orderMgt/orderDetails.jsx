import React from 'react'
import { useDispatch } from 'react-redux'
import { updateState } from '../../../../redux/resto'

function OrderDetails(props) {

    const dispatch = useDispatch()
    return (
        <div className='bg-gray-300 w-screen h-full p-10  space-y-10'>
            <button className='bg-red-600 text-xs p-2 px-3 text-white ' onClick={() => dispatch(updateState({ state: null }))}>Back</button>
            <div className='w-full text-center '>
                <h1 className='text-2xl font-semibold text-gray-600'>Order Details</h1>
            </div>
            <div className='px-16 space-y-5 '>
                <div className='flex justify-between '>
                    <div className='space-y-5'>
                        <h4 className='text-red-800 font-semibold'>Order id:  {props?.orderDetails[0]?.orderId}</h4>
                        <h4 className='text-red-800 font-semibold'> Order Date: {new Date(props?.orderDetails[0]?.orderDate).toLocaleDateString()}</h4>
                    </div>
                    <div className='space-y-5'>
                        <h4 className='text-red-800 font-semibold'>Customer Phone:  {props?.orderDetails[0]?.customer} </h4>
                        <h4 className='text-red-800 font-semibold'>Payment Mode:  {props?.orderDetails[0]?.paymentMode} </h4>
                        <h4 className={`${props?.orderDetails[0]?.status === 'Confirmed' ? 'text-green-600' : 'text-red-800'} font-semibold`}>Order Status:  {props?.orderDetails[0]?.status} </h4>
                    </div>
                </div>
                <div className='h-full'>
                    {props?.orderDetails[0]?.items.map((item) => (
                        <div className='bg-gray-200 w-full'>
                            <div className='p-3 space-x-10 flex justify-between px-10 '>
                                <img src={item.images[0]} alt="" width={200} />
                                <div className='w-full h-32 items-center flex justify-between'>
                                    <h1 className='font-semibold '>{item.dishName}</h1>
                                    <h1 className='font-semibold '>{item.price}</h1>
                                    <h1 className='font-semibold '>{item.qnty}</h1>
                                    <h1 className='font-semibold '>{item.price * item.qnty}</h1>
                                </div>
                            </div>

                        </div>
                    ))}
                    <div className='w-full flex justify-end'>
                        <div className='px-8 w-1/2 flex justify-between mt-3'>
                            <h1 className='font-semibold '>TOTAL:</h1>
                            <h1 className='font-semibold '>{props?.orderDetails[0]?.amount}</h1>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default OrderDetails