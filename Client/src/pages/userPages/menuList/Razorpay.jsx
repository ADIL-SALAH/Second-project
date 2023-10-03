import React, { useState } from 'react'
import userAxios from '../../../../axios/userAxios';
import { toast } from 'react-toastify';


function Razorpay() {
    const [paymentId, setPaymentId] = useState('');

    const createOrder = async () => {
        // Make an API call to your Node.js backend to create an order
        const response = await userAxios.post('/createOrder').then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })

        const data = await response.json();
        setPaymentId(data.paymentId);
        // Initialize Razorpay with your key
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID, // Replace with your test key
            amount: 1000, // Amount in paise (1000 paise = ₹10)
            currency: 'INR',
            name: 'Resto Plaza',
            description: 'Payment for Product/Service',
            order_id: paymentId, // Replace with the order ID you received from your server
            handler: function (response) {
                // Handle the successful payment response
                toast.success('Payment Successful');
            },
        });

        // Open the Razorpay payment window
        razorpay.open();
    };

    return (
        <div>
            <button onClick={createOrder}>Pay Now</button>

        </div>
    )
}

export default Razorpay


