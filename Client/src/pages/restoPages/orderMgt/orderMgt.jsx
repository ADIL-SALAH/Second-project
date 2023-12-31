import React, { useEffect, useState } from 'react'
import restoAxios from '../../../../axios/restoAxios'
import { useDispatch, useSelector } from 'react-redux'
import OrderDetails from './orderDetails'
import { updateState } from '../../../../redux/resto'
import { ToastContainer, toast } from 'react-toastify'


function OrderMgt() {

    const dispatch = useDispatch()
    const [orderList, setOrderList] = useState([])
    const [orderDetails, setOrderDetails] = useState('')
    const [reload, setReload] = useState(true)
    useEffect(() => {
        restoAxios.get('/orderMgt').then((res) => {
            setOrderList(res.data.orders)
        }).catch((err) => {
            console.log(err)
        })
    }, [reload])

    const { state } = useSelector((state) => state.resto)
    const orderDetailsfn = (id) => {
        const getDetails = orderList.filter((order) => order._id === id)
        setOrderDetails(getDetails)
        dispatch(updateState({ state: 'orderMgt' }))


    }

    const acceptOrder = (id) => {
        console.log(id)
        restoAxios.put('/acceptOrder', { orderId: id }).then((res) => {
            console.log(res)
            toast.success('Order Accepted')
            setReload(!reload)
        }).catch((err) => {
            console.log(err)
            toast.error('Order Acception failed')
            setReload(!reload)
        })
    }
    const rejectOrder = (id) => {
        console.log(id)
        restoAxios.put('/rejectOrder', { orderId: id }).then((res) => {
            console.log(res)
            toast.success(res.data.message)
            setReload(!reload)
        }).catch((err) => {
            console.log(err)
            toast.error('Order Rejection failed')
            setReload(!reload)
        })
    }


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = orderList.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className='w-full mt-32 flex-col justify-center pt-0 p-10'>
            <ToastContainer />
            {state === null ?
                <table className='text-white w-full border-red  border-separate'>
                    <thead>
                        <tr className='bg-gray-600 '>
                            <th className='p-4'>sl.no</th>
                            <th className='p-4'>order Id</th>
                            <th className='p-4'>Customer</th>
                            <th className='p-4'>Amount</th>
                            <th className='p-4'>OrderDate</th>
                            <th className='p-4'>Order Status</th>
                            <th className='p-4'>Payment Mode</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((order, index) => {
                            return <tr className='text-center bg-gray-400 h-6' key={index}>
                                <td className='p-5'>{indexOfFirstItem + index + 1}</td>
                                <td className='hover:cursor-pointer hover:text-gray-800' onClick={() => orderDetailsfn(order._id)}>{order.orderId}</td>
                                <td className='hover:cursor-pointer hover:text-gray-800'>{order.customer}</td>
                                <td>{order.amount}</td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td className={order.status === 'Confirmed' ? 'text-green-800' : 'text-red-600'}>
                                    {order.status === 'Pending' ? (
                                        <>
                                            <button className='bg-green-600 m-1 px-2 text-white' onClick={() => acceptOrder(order.orderId)}>Accept</button>
                                            <button className='bg-red-600 px-2 m-1 text-white' onClick={() => rejectOrder(order.orderId)}>Reject</button>
                                        </>
                                    ) : (
                                        order.status
                                    )}
                                </td>

                                <td>{order.paymentMode}</td>
                                {/* <td className=''>
                                <button className='bg-yellow-600 p-2 px-5 text-xs '>Edit</button>
                                <button className='bg-red-600 p-2 px-5 text-xs '>Delete</button>
                            </td> */}
                            </tr>
                        })}

                    </tbody>
                </table>

                : <OrderDetails orderDetails={orderDetails} />
            }
            <div className='flex justify-center mt-4'>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className='mr-2'
                >
                    Previous
                </button>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={indexOfLastItem >= orderList.length}
                >
                    Next
                </button>
            </div>
        </div>)
}

export default OrderMgt