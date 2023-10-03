import React from 'react'
import bgImage from '../../../assets/restaurant-logo-designer-needs 1.jpg'

function Box() {
    return (
        <div className='bg-[#F4C95D] w-2/3 h-screen self-center'>
            <img className='mt-56 ml-16' src={bgImage} width={400} alt="" />
        </div>
    )
}

export default Box