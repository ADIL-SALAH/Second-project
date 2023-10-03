import React, { useEffect, useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import userAxios from '../../../../axios/userAxios'
import Cookies from 'js-cookie'
import { useSelector } from 'react-redux'
import {
    Input,
    initTE, PerfectScrollbar
} from "tw-elements";
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:5173');


function homepage() {
    useEffect(() => {
        initTE({ Input, PerfectScrollbar });
    })


    const [search, setSearch] = useState(null)
    const [searchResults, setSearchResults] = useState('')
    const navigate = useNavigate()
    useEffect(() => {
        const timer = setTimeout(() => {
            userAxios.get('/search', { params: { data: search } }).then((res) => {
                setSearchResults(res.data.searchResults)

            }).catch((err) => {
                console.log(err)
            })
        }, 800);
        return () => clearTimeout(timer);
    }, [search])
    const handleSearch = (e) => {
        setSearch(e.target.value.toUpperCase().trim())
    }


    const viewResto = (restoId) => {
        navigate(`/restaurantView?restoId=${restoId}`)

    }
    return (
        <div className='  '>
            <div className='flex md:flex-row flex-col  items-center '>
                {/* <img src="https://res.cloudinary.com/dsvassz8z/image/upload/v1694418918/images/xv6p99thvoe5vm8sekev.webp" alt="" className='w-2/5' /> */}
                <div className='bg-red-800 shadow-2xl p-20 h-screen md:w-1/2 w-full text-white  md:flex md:flex-row md:items-center flex-col space-y-20'>
                    <h1 className='text-5xl font-serif '>
                        Find the restaurant,
                        <br />the best for you
                    </h1>
                    <div className='md:w-1/2 w-full h-screen block md:hidden'>
                        <div class="relative mb-3" data-te-input-wrapper-init>
                            <input
                                type="text"
                                class="peer block min-h-[auto] w-full rounded border-0 bg-slate-700 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                id="exampleFormControlInput1"
                                placeholder="Example label"
                                onChange={handleSearch}
                            />
                            <label
                                for="exampleFormControlInput1"
                                class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                            >Example label
                            </label>
                        </div>
                        <div className='flex justify-center'>
                            {search ?
                                <div className='h-36 w-96 overflow-y-auto  scrollbar-thin scroll-smooth scrollbar-thumb-gray-100 scrollbar-track-white' >
                                    {searchResults?.map((resto, index) =>
                                        <div className='flex justify-between p-5 text-xs cursor-pointer' onClick={() => viewResto(resto._id)}>
                                            <p>{resto.resto_name}</p>
                                            <div className=''>
                                                <small className=' text-gray-500 mr-2 '>{resto.address.place}</small>
                                                <small className=' text-gray-500'>{resto.address.district}</small>
                                            </div>
                                        </div>
                                    )}
                                    {searchResults?.length === 0 ? <small className='text-red-600 text-center'>search not found</small> : ''}
                                </div>
                                : ''}

                        </div>
                    </div>
                </div>
                <div className='md:w-1/2 w-full h-screen  md:h-0 hidden md:block '>
                    <div className='flex justify-center '>
                        <div className="relative mb-3" data-te-input-wrapper-init>
                            <input
                                type="search"
                                className="peer hover:shadow-lg block min-h-[auto] w-full sm:w-96 bg-gray-200 rounded border-0 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                                id="exampleSearch2"
                                placeholder="Type query"
                                onChange={handleSearch}
                            />
                            <label
                                className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                            >
                                Search
                            </label>
                        </div>

                    </div>
                    <div className='flex justify-center '>
                        {search ?
                            <div className='h-36 w-96 overflow-y-auto  scrollbar-thin scroll-smooth scrollbar-thumb-gray-100 scrollbar-track-white' >
                                {searchResults?.map((resto, index) =>
                                    <div className='flex justify-between p-5 text-xs cursor-pointer' onClick={() => viewResto(resto._id)}>
                                        <p>{resto.resto_name}</p>
                                        <div className=''>
                                            <small className=' text-gray-500 mr-2 '>{resto.address.place}</small>
                                            <small className=' text-gray-500'>{resto.address.district}</small>
                                        </div>
                                    </div>
                                )}
                                {searchResults?.length === 0 ? <small className='text-red-600 text-center'>search not found</small> : ''}
                            </div>
                            : ''}

                    </div>
                </div>
            </div>

        </div>


    )
}

export default homepage