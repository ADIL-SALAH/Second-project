import React, { useState } from 'react'

function Addmenu() {

    const [dishDetails, setDishDetails] = useState({
        dishName: '',
        dishCategory: '',
        price: '',
        description: ''
    })
    const [errors, setErrors] = useState({})


    const handleInput = (event) => {
        const newObj = {
            ...dishDetails, [event.target.name]: event.target.name
        }
    }
    const validation = () => {
        const newError = {}
        if (dishDetails.dishName.trim().length === 0) {
            newError.dishName = 'Enter the dish name'
        } else if (dishDetails.dishName.trim().length < 4) {
            newError.dishName = 'Name should contain atleast 4 letters'
        }
        if (dishDetails.dishCategory.trim().length === 0) {
            newError.dishCategory = 'Category should be added'
        }
        if (dishDetails.price.trim().length === 0) {
            newError.price = 'Price should be entered'
        }
        return newError
    }
    const handleSubmit = (e) => {
        e.preventDefault()

        setErrors(validation())
    }
    return (
        <div className='h-screen bg-black p-10'>
            <>
                <form onSubmit={handleSubmit} className='p-5 border-4 border-gray-600 w-96 rounded-lg  top-24' >
                    <h2 className='text-gray-600 m-3 mb-4 flex justify-center'>Restaurant Login</h2>
                    <div className='mb-5'>
                        <input type="text" onChange={handleInput} name='dishName' placeholder='Dish Name' className='w-full h-8 rounded-full p-4  bg-slate-600' />
                        {errors.dishName ? <small className='text-red-600'>{errors.dishName}</small> : ''}
                    </div>
                    <div className='mb-5'>
                        <input type="text" onChange={handleInput} name='Category' placeholder='Dish category' className='w-full h-8 rounded-full p-4  bg-slate-600' />

                        {errors.category ? <small className='text-red-600'>{errors.category}</small> : ''}

                    </div>
                    <div className='mb-5'>
                        <input type="text" onChange={handleInput} name='price' placeholder='Dish rice' className='w-full h-8 rounded-full p-4  bg-slate-600' />
                        {errors.price ? <small className='text-red-600'>{errors.price}</small> : ''}

                    </div>
                    <div className='mb-5'>
                        <input type="text" onChange={handleInput} name='description' placeholder='description' className='w-full h-8 rounded-full p-4  bg-slate-600' />
                        {errors.description ? <small className='text-red-600'>{errors.description}</small> : ''}

                    </div>


                    <div className='flex justify-center mt-10 mb-5 h-8 bg-black rounded-lg'>
                        <button type='submit' value="Add Dish" className='text-white'>Add Dish</button>
                    </div>
                </form>
            </>
        </div >
    )
}

export default Addmenu