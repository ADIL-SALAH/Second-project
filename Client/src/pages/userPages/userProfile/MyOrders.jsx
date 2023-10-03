import React, { useEffect, useState } from 'react'
import userAxios from '../../../../axios/userAxios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

function MyOrders() {

    const navigate = useNavigate()
    const { phone } = useSelector((state) => state.client)
    const [search, setSearch] = useState(null)
    const [reload, setReload] = useState(true)
    const [orderDetails, setOrderDetails] = useState(null)
    let filteredOrder
    useEffect(() => {
        userAxios.get('/MyOrders').then((res) => {

            setOrderDetails(res.data.orderDetails)
        }).catch((err) => {
            console.log(err)
        })
    }, [reload])
    useEffect(() => {
        const regexPattern = new RegExp(search, 'i');

        filteredOrder = orderDetails?.filter((item) => (
            regexPattern.test(item.orderId) ||
            regexPattern.test(item.restaurant.resto_name)
        ))
        console.log(search, filteredOrder, '&******')
    }, [search])

    const cancelOrder = (id) => {
        console.log(id, 'opppppppppppoooooooo')
        userAxios.put(`/orderCancel?id=${id}&&phone=${phone}`).then((res) => {
            console.log(res)
            if (res.status === 200) {
                toast.success('Order Cancelled')
                setReload(!reload)
            } else {
                toast.error('Order Already Accepted')
            }
        })

    }

    return (
        <div>
            <ToastContainer />
            {/* <div class="flex flex-col p-5">
                <button className='bg-blue-400 px-2 py-1' onClick={() => navigate(-1)}> Back </button>
                <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <div class="overflow-hidden">
                            <table class="min-w-full text-left text-sm font-light">
                                <thead class="border-b font-medium dark:border-neutral-500">
                                    <tr>
                                        <th scope="col" class="px-6 py-4">Sl.no</th>
                                        <th scope="col" class="px-6 py-4">OrderId</th>
                                        <th scope="col" class="px-6 py-4">Items</th>
                                        <th scope="col" class="px-6 py-4">Restaurant</th>
                                        <th scope="col" class="px-6 py-4">Date</th>
                                        <th scope="col" class="px-6 py-4">Amount</th>
                                        <th scope="col" class="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderDetails?.map((order, index) => (
                                        <tr class="border-b dark:border-neutral-500 bg-danger-100 " key={index}>
                                            <td class="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
                                            <td class="whitespace-nowrap px-6 py-4">{order?.orderId}</td>
                                            <td class="whitespace-nowrap px-6 py-4">{order?.items?.map((item) => <>{item?.dishName}<br /></>)}</td>
                                            <td class="whitespace-nowrap px-6 py-4">{order?.restaurant.resto_name}</td>
                                            <td class="whitespace-nowrap px-6 py-4">{new Date(order?.orderDate).toLocaleDateString()}</td>
                                            <td class="whitespace-nowrap px-6 py-4">{order?.amount}</td>
                                            <td class="whitespace-nowrap px-6 py-4">{order?.status === 'Pending' ? <button className='bg-red-600 px-2 text-white py-1' onClick={() => cancelOrder(order.orderId)}> Order Cancel</button> : order.status}</td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div> */}
            <div class="bg-white p-8 rounded-md w-full">
                <div class=" flex items-center justify-between pb-6">
                    <div>
                        <h2 class="text-gray-600 font-semibold">My Orders</h2>
                        <span class="text-xs">All products item</span>
                    </div>
                    <div class="sm:flex items-center justify-between ">

                        <div class="flex bg-gray-50 items-center p-2 rounded-md ">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clip-rule="evenodd" />
                            </svg>
                            <input onChange={(e) => setSearch(e.target.value)} class="bg-gray-50 outline-none ml-1 block " type="text" name="" id="" placeholder="search..." />
                        </div>

                        <div class="lg:ml-40 sm:ml-10  space-x-8 ">
                            <button onClick={() => navigate(-1)} class="bg-indigo-600  px-2 py-1 rounded-md text-sm text-white font-semibold tracking-wide cursor-pointer">Back</button>
                            {/* <button class="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">Create</button> */}
                        </div>
                    </div>
                </div>
                <div>
                    <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                        <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
                            <table class="min-w-full leading-normal">
                                <thead>
                                    <tr>
                                        <th
                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Sl.no
                                        </th>
                                        <th
                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            OrderId
                                        </th>
                                        <th
                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Items
                                        </th>
                                        <th
                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Restaurant
                                        </th>
                                        <th
                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th
                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th
                                            class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrder && filteredOrder?.length !== 0 ? filteredOrder.map((order, index) => (
                                        <tr>
                                            {/* <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <div class="flex items-center">
                                                </div>
                                            </td> */}
                                            {/* <p class="text-gray-900 whitespace-no-wrap">{index + 1}</p> */}

                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p class="text-gray-900 whitespace-no-wrap">{index + 1}</p>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p class="text-gray-900 whitespace-no-wrap">{order.orderId}</p>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p class="text-gray-900 whitespace-no-wrap">{order?.items?.map((item) => <>{item?.dishName}<br /></>)}</p>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p class="text-gray-900 whitespace-no-wrap">
                                                    {order?.restaurant.resto_name}
                                                </p>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p class="text-gray-900 whitespace-no-wrap">
                                                    {new Date(order?.orderDate).toLocaleDateString()}
                                                </p>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p class="text-gray-900 whitespace-no-wrap">
                                                    {order?.amount}
                                                </p>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <span onClick={() => cancelOrder(order._id)}
                                                    class={`${order?.status === 'Confirmed' ? 'text-green-900' : order?.status === 'Pending' ? 'text-red-900 hover:cursor-pointer' : order?.status === 'Cancelled' ? 'text-yellow-900' : 'text-green-900'} relative inline-block px-3 py-1 font-semibold  leading-tight`}>
                                                    <span aria-hidden
                                                        class={`${order?.status === 'Confirmed' ? 'bg-green-200' : order?.status === 'Pending' ? 'bg-red-200' : order?.status === 'Cancelled' ? 'bg-yellow-400' : 'bg-green-200'} absolute inset-0  opacity-50 rounded-full`}></span>
                                                    <span class="relative">{order?.status === 'Pending' ? 'Cancel Order' : order?.status === 'Cancelled' ? 'Cancelled' : 'Confirmed'}</span>
                                                </span>
                                            </td>
                                        </tr>
                                    )) : orderDetails?.map((order, index) => (

                                        <tr>
                                            {filteredOrder?.length == 0 ? 'hai' : 'hello'}
                                            {/* <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <div class="flex items-center">
                                                </div>
                                            </td> */}
                                            {/* <p class="text-gray-900 whitespace-no-wrap">{index + 1}</p> */}

                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p class="text-gray-900 whitespace-no-wrap">{index + 1}</p>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p class="text-gray-900 whitespace-no-wrap">{order.orderId}</p>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p class="text-gray-900 whitespace-no-wrap">{order?.items?.map((item) => <>{item?.dishName}<br /></>)}</p>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p class="text-gray-900 whitespace-no-wrap">
                                                    {order?.restaurant.resto_name}
                                                </p>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p class="text-gray-900 whitespace-no-wrap">
                                                    {new Date(order?.orderDate).toLocaleDateString()}
                                                </p>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p class="text-gray-900 whitespace-no-wrap">
                                                    {order?.amount}
                                                </p>
                                            </td>
                                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <span onClick={() => cancelOrder(order._id)}
                                                    class={`${order?.status === 'Confirmed' ? 'text-green-900' : order?.status === 'Pending' ? 'text-red-900 hover:cursor-pointer' : order?.status === 'Cancelled' ? 'text-yellow-900' : 'text-green-900'} relative inline-block px-3 py-1 font-semibold  leading-tight`}>
                                                    <span aria-hidden
                                                        class={`${order?.status === 'Confirmed' ? 'bg-green-200' : order?.status === 'Pending' ? 'bg-red-200' : order?.status === 'Cancelled' ? 'bg-yellow-400' : 'bg-green-200'} absolute inset-0  opacity-50 rounded-full`}></span>
                                                    <span class="relative">{order?.status === 'Pending' ? 'Cancel Order' : order?.status === 'Cancelled' ? 'Cancelled' : 'Confirmed'}</span>
                                                </span>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                            <div
                                class="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                                <span class="text-xs xs:text-sm text-gray-900">
                                    Showing 1 to 4 of 50 Entries
                                </span>
                                <div class="inline-flex mt-2 xs:mt-0">
                                    <button
                                        class="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-l">
                                        Prev
                                    </button>
                                    &nbsp; &nbsp;
                                    <button
                                        class="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-r">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default MyOrders