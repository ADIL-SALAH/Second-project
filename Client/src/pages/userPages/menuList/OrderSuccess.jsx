import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import userAxios from '../../../../axios/userAxios'
import { useSelector } from 'react-redux'
import CryptoJS from 'crypto-js';

function OrderSuccess() {
    const navigate = useNavigate()
    return (


        <div class="bg-white h-screen ">
            <div class=" p-6  md:mx-auto">
                <svg viewBox="0 0 24 24" class="text-green-600 w-16 h-16 mx-auto my-6 ">
                    <path fill="currentColor"
                        d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
                    </path>
                </svg>
                <div class="text-center">
                    <h3 class="md:text-2xl text-base text-green-800 font-semibold text-center">Order Done!</h3>
                    <p class="text-gray-600 my-2">Thank you for completing your secure online payment.</p>
                    <p> Have a great day!  </p>
                    <div class="py-5 flex justify-evenly">
                        {/* <a href="/myOrders" class="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3">
                                My Orders
                            </a> */}
                        <button onClick={() => navigate('/')} className='bg-indigo-800 text-white px-4 py-2 text-sm rounded-lg'>Home</button>
                        <button onClick={() => navigate('/myOrders')} className='bg-indigo-800 text-white px-4 py-2 text-sm rounded-lg'>My Order</button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderSuccess