import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import adminAxios from '../../../axios/adminAxios'
import { toast, ToastContainer } from 'react-toastify'

function UserMgt() {
    const navigate = useNavigate()

    const [state, setState] = useState('')
    const [userDetails, setUserDetails] = useState([])
    const [blockState, setBlockState] = useState(false)

    useEffect(() => {
        if (!Cookies.get('adminToken')) {
            navigate('/admin');
        } else {
            adminAxios.get('/home')
                .then((res) => {
                    if (res.data.userDetails) {
                        setUserDetails(res.data.userDetails);
                    } else {
                        console.log('user details is not fetched');
                    }
                }).catch((err) => console.log(err));
        }
    }, [blockState]);

    const handleBtn = () => {
        state === '' ? setState('addCategory') : setState('')
    }

    const blockUser = (phone) => {
        adminAxios.patch(`/blockUser?phone=${phone}`).then((res) => {
            if (res.data.success) {
                toast.success('user is blocked')
                setBlockState(!blockState)
            }
            else {
                toast.error('failed to block user')
            }
        }).catch(error => toast.error('failed to block user'))
    }
    const unBlockUser = (phone) => {
        adminAxios.patch(`/unBlockUser?phone=${phone}`).then((res) => {
            if (res.data.success) {
                toast.success('user is unblocked')
                setBlockState(!blockState)
            }
            else {
                toast.error('failed to unblock user')
            }
        }).catch(error => toast.error('failed to unblock user'))

    }


    return (
        <div>
            <ToastContainer />
            <div className=' h-screen p-10 w-full'>
                <h1 className='text-black text-center font-mono font-medium text-lg'>Hi Admin!!</h1>
                <div className=''>
                    {/* {state === '' ? <button onClick={handleBtn} className='bg-gray-400 p-2 px-3 absolute right-28 text-sm'>Add Category</button> : <button onClick={handleBtn} className='bg-gray-400 p-2 px-3 absolute right-28 text-sm w-20'>Back</button>} */}
                    {/* <button className='bg-gray-400 p-2 px-3 absolute right-28 text-sm' onClick={logout}>Logout</button> */}
                </div>
                <div className='w-full mt-20 flex justify-center'>
                    {state === '' ? <>
                        <table className='text-white w-full border-red  border-separate'>
                            <thead>
                                <tr className='bg-gray-500 p-2 h-3'>
                                    <th>sl.no</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody >
                                {userDetails.map((user, index) => {
                                    return <tr className='text-center bg-gray-600 text-white' key={index}>
                                        <td className='p-5'>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.username}</td>
                                        <td className=''>
                                            {user.isBlocked === false ? <button onClick={() => blockUser(user.phone)} className='bg-red-600 p-2 px-5 text-xs '>Block</button> : <button onClick={() => unBlockUser(user.phone)} className='bg-green-600 p-2 px-3 text-xs'>Unblock</button>}
                                        </td>
                                    </tr>
                                })}

                            </tbody>
                        </table>

                    </> : <>
                        <form onSubmit={handleSubmit} className='p-5 border-4 border-gray-600 w-96 rounded-lg  top-24'>
                            <h2 className='text-gray-600 m-3 mb-4 flex justify-center font-mono font-bold'>Add Category Here</h2>
                            <div className='mb-5'>
                                <input type="text" onChange={handleInput} name='categoryName' placeholder='Category Name' className='w-full h-8 rounded-full p-4  bg-slate-600' />
                                {errors.categoryName ? <small className='text-red-600'>{errors.categoryName}</small> : ''}
                            </div>
                            <div className='mb-5'>
                                <input type="text" onChange={handleInput} name='description' placeholder='Description' className='w-full h-8 rounded-full p-4  bg-slate-600' />
                                {errors.description ? <small className='text-red-600'>{errors.description}</small> : ''}

                            </div>
                            <div className='flex justify-center mt-10 mb-5 h-8 bg-black rounded-lg'>
                                <button type='submit' value="Add Dish" className='text-white'>Add Dish</button>
                            </div>
                        </form>
                    </>}


                </div>
            </div>
        </div>
    )
}

export default UserMgt