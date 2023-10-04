import React, { useEffect, useState } from 'react'
import userAxios from '../../../../axios/userAxios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'

function MyOrders() {

    const navigate = useNavigate()
    const { phone, name } = useSelector((state) => state.client)
    const [search, setSearch] = useState(null)
    const [reload, setReload] = useState(true)
    const [orderDetails, setOrderDetails] = useState(null)
    const [filteredState, setFilteredState] = useState([])


    useEffect(() => {
        userAxios.get('/MyOrders').then((res) => {
            setOrderDetails(res.data.orderDetails)
        }).catch((err) => {
            console.log(err)
        })
    }, [reload])

    const searching = (value) => {
        setSearch(value)
        const regexPattern = new RegExp(value, 'i');

        let filteredOrder = orderDetails?.filter((item) => (
            regexPattern.test(item.orderId) ||
            regexPattern.test(item.restaurant.resto_name)
        ))
        setFilteredState(filteredOrder)
        console.log(filteredState, value)
    }

    const cancelOrder = (id) => {
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


    // pagination 
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = orderDetails?.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    return (
        <div className=''>
            <ToastContainer />

            <div class="bg-white p-8 rounded-md w-full">
                <div class=" flex items-center justify-between pb-6">
                    <div>
                        <h2 class="text-gray-600 font-semibold">My Orders</h2>
                        <span class="text-xs">{name}</span>
                    </div>
                    <div class="sm:flex items-center justify-between ">

                        <div class="flex bg-gray-200 items-center p-2 rounded-md ">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clip-rule="evenodd" />
                            </svg>
                            <input onChange={(e) => { searching(e.target.value) }} class="bg-gray-200 outline-none ml-1 block " type="text" name="" id="" placeholder="search..." />
                        </div>

                        <div class="lg:ml-40 sm:ml-10  space-x-8 ">
                            <button onClick={() => navigate(-1)} class="bg-indigo-600  px-2 py-1 rounded-md text-sm text-white font-semibold tracking-wide cursor-pointer">Back</button>
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
                                            class="px-5 py-3 border-b-2 border-gray-200 bg-red-700 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Sl.no
                                        </th>
                                        <th
                                            class="px-5 py-3 border-b-2 border-gray-200 bg-red-700 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            OrderId
                                        </th>
                                        <th
                                            class="px-5 py-3 border-b-2 border-gray-200 bg-red-700 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Items
                                        </th>
                                        <th
                                            class="px-5 py-3 border-b-2 border-gray-200 bg-red-700 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Restaurant
                                        </th>
                                        <th
                                            class="px-5 py-3 border-b-2 border-gray-200 bg-red-700 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th
                                            class="px-5 py-3 border-b-2 border-gray-200 bg-red-700 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th
                                            class="px-5 py-3 border-b-2 border-gray-200 bg-red-700 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {search ? (
                                        filteredState && filteredState.length !== 0 ? (
                                            filteredState.map((order, index) => (
                                                <tr>

                                                    <td class="px-5 py-5 border-b border-gray-200 bg-slate-300 text-sm">
                                                        <p class="text-gray-900 whitespace-no-wrap">{index + 1}</p>
                                                    </td>
                                                    <td class="px-5 py-5 border-b border-gray-200 bg-slate-300 text-sm">
                                                        <p class="text-gray-900 whitespace-no-wrap">{order.orderId}</p>
                                                    </td>
                                                    <td class="px-5 py-5 border-b border-gray-200 bg-slate-300 text-sm">
                                                        <p class="text-gray-900 whitespace-no-wrap">{order?.items?.map((item) => <>{item?.dishName}<br /></>)}</p>
                                                    </td>
                                                    <td class="px-5 py-5 border-b border-gray-200 bg-slate-300 text-sm">
                                                        <p class="text-gray-900 whitespace-no-wrap">
                                                            {order?.restaurant.resto_name}
                                                        </p>
                                                    </td>
                                                    <td class="px-5 py-5 border-b border-gray-200 bg-slate-300 text-sm">
                                                        <p class="text-gray-900 whitespace-no-wrap">
                                                            {new Date(order?.orderDate).toLocaleDateString()}
                                                        </p>
                                                    </td>
                                                    <td class="px-5 py-5 border-b border-gray-200 bg-slate-300 text-sm">
                                                        <p class="text-gray-900 whitespace-no-wrap">
                                                            {order?.amount}
                                                        </p>
                                                    </td>
                                                    <td class="px-5 py-5 border-b border-gray-200 bg-slate-300 text-sm">
                                                        <span onClick={() => cancelOrder(order._id)}
                                                            class={`${order?.status === 'Confirmed' ? 'text-green-900' : order?.status === 'Pending' ? 'text-red-900 hover:cursor-pointer' : order?.status === 'Cancelled' ? 'text-yellow-900' : 'text-green-900'} relative inline-block px-3 py-1 font-semibold  leading-tight`}>
                                                            <span aria-hidden
                                                                class={`${order?.status === 'Confirmed' ? 'bg-green-200' : order?.status === 'Pending' ? 'bg-red-200' : order?.status === 'Cancelled' ? 'bg-yellow-400' : 'bg-green-200'} absolute inset-0  opacity-50 rounded-full`}></span>
                                                            <span class="relative">{order?.status === 'Pending' ? 'Cancel Order' : order?.status === 'Cancelled' ? 'Cancelled' : 'Confirmed'}</span>
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <div className='text-center'>
                                                <h1 >No matching orders found</h1>
                                            </div>
                                        )
                                    ) : (

                                        currentItems?.map((order, index) => (

                                            <tr>
                                                <td class="px-5 py-5 border-b border-gray-200 bg-slate-300 text-sm">
                                                    <p class="text-gray-900 whitespace-no-wrap">{indexOfFirstItem + index + 1}</p>
                                                </td>
                                                <td class="px-5 py-5 border-b border-gray-200 bg-slate-300 text-sm">
                                                    <p class="text-gray-900 whitespace-no-wrap">{order.orderId}</p>
                                                </td>
                                                <td class="px-5 py-5 border-b border-gray-200 bg-slate-300 text-sm">
                                                    <p class="text-gray-900 whitespace-no-wrap">{order?.items?.map((item) => <>{item?.dishName}<br /></>)}</p>
                                                </td>
                                                <td class="px-5 py-5 border-b border-gray-200 bg-slate-300 text-sm">
                                                    <p class="text-gray-900 whitespace-no-wrap">
                                                        {order?.restaurant.resto_name}
                                                    </p>
                                                </td>
                                                <td class="px-5 py-5 border-b border-gray-200 bg-slate-300 text-sm">
                                                    <p class="text-gray-900 whitespace-no-wrap">
                                                        {new Date(order?.orderDate).toLocaleDateString()}
                                                    </p>
                                                </td>
                                                <td class="px-5 py-5 border-b border-gray-200 bg-slate-300 text-sm">
                                                    <p class="text-gray-900 whitespace-no-wrap">
                                                        {order?.amount}
                                                    </p>
                                                </td>
                                                <td class="px-5 py-5 border-b border-gray-200 bg-slate-300 text-sm">
                                                    <span onClick={() => cancelOrder(order._id)}
                                                        class={`${order?.status === 'Confirmed' ? 'text-green-900' : order?.status === 'Pending' ? 'text-red-900 hover:cursor-pointer' : order?.status === 'Cancelled' ? 'text-yellow-900' : 'text-green-900'} relative inline-block px-3 py-1 font-semibold  leading-tight`}>
                                                        <span aria-hidden
                                                            class={`${order?.status === 'Confirmed' ? 'bg-green-200' : order?.status === 'Pending' ? 'bg-red-200' : order?.status === 'Cancelled' ? 'bg-yellow-400' : 'bg-green-200'} absolute inset-0  opacity-50 rounded-full`}></span>
                                                        <span class="relative">{order?.status === 'Pending' ? 'Cancel Order' : order?.status === 'Cancelled' ? 'Cancelled' : 'Confirmed'}</span>
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}

                                </tbody>
                            </table>
                            <div
                                class="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                                <span class="text-xs xs:text-sm text-gray-900">
                                    Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {orderDetails?.length} Entries
                                </span>
                                <div class="inline-flex mt-2 xs:mt-0">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        class="text-xs text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-1 px-2 rounded-l">
                                        Prev
                                    </button>
                                    &nbsp; &nbsp;
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={indexOfLastItem >= orderDetails?.length}
                                        class="text-xs text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-1 px-2 rounded-r">
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