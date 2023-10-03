import React, { useEffect, useState } from 'react'

function Corousel({ restoDetail }) {
    const [imgIndx, setImgIndx] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => {
            const index = Math.floor(Math.random() * (restoDetail?.photos.length || 0));
            setImgIndx(index);
        }, 3000);

        // Clear the timer when the component unmounts or when the effect runs again.
        return () => clearTimeout(timer);
    },);

    const decIndx = () => {
        if (imgIndx >= 0) {
            setImgIndx(imgIndx - 1)
        } else {
            setImgIndx(restoDetail?.photos.length - 1)
        }
        console.log(imgIndx)
    }
    const incIndx = () => {
        if (imgIndx < restoDetail?.photos.length) {
            setImgIndx(imgIndx + 1)
        } else {
            setImgIndx(0)
        }
        console.log(imgIndx)

    }
    return (

        <div id="default-carousel" className="relative w-full opacity-90 " data-carousel="slide">
            {/* <!-- Carousel wrapper --> */}
            <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                {/* <!-- Item 1 --> */}
                <div className="shadow-inner duration-700 ease-in-out" data-carousel-item>
                    <img src={restoDetail?.photos[imgIndx]} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..." />
                </div>

            </div>
            {/* <!-- Slider indicators --> */}
            <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
                <button type="button" className="hover:bg-none w-3 h-3 rounded-full" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>

            </div>
            {/* <!-- Slider controls --> */}
            <button type="button" onClick={decIndx} className="hover:bg-transparent absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <svg className="w-4 h-4 text-white dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4" />
                    </svg>
                    <span className="sr-only">Previous</span>
                </span>
            </button>
            <button type="button" onClick={incIndx} className="hover:bg-transparent absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                    <svg className="w-4 h-4 text-white dark:text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <span className="sr-only" >Next</span>
                </span>
            </button>
        </div>


    )
}


export default Corousel;

