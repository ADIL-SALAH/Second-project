import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../../../assets/logo 2 ifood 2.png'
import {
    Collapse,
    Dropdown,
    initTE,
} from "tw-elements";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { clientLogout } from '../../../../../redux/client';
import { updateClientState } from '../../../../../redux/client';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';





function Navbar(props) {

    const location = useLocation();
    console.log(location.pathname);


    useEffect(() => {
        initTE({ Collapse, Dropdown });
    }, []);

    const { name, username, image, state } = useSelector((state) => state.client)
    const navigate = useNavigate()
    const [isLoggedIn, setLoggedIn] = useState(!!Cookies.get('token'))
    const [active, setActive] = useState('home')
    const dispatch = useDispatch()

    useEffect(() => {
        if (state === 'home') {
            navigate('/')
        } else if (state === 'resto') {
            navigate('/restos')
        } else if (state === 'userProfile') {
            navigate('/userProfile')
        }
    }, [state, active])



    const logout = () => {
        Cookies.remove('token')
        navigate('/')
        // useDispatch(clientLogout())
        setLoggedIn(false)
    }

    const handleTabClick = (tab) => {
        dispatch(updateClientState({ state: tab }))
    }

    return (

        <nav className="flex items-center justify-between bg-red-800 shadow-md dark:bg-neutral-600 lg:flex-wrap ">
            <button className="block lg:hidden">
                <span className="[&>svg]:w-7">
                    {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-7 w-7">
                        <path
                            d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                        />
                    </svg> */}
                </span>
            </button>

            <div className=" flex justify-center">
                {/* <!-- Logo --> */}
                <a
                    className={`"mb-4 mt-3 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:mb-0 lg:mt-0 sm:ml-0   "`}
                    href="#">
                    <img
                        src={logo}
                        className="h-20 ml-5 "
                        alt=" Logo"
                        loading="lazy"
                        onClick={() => /*setState('home')*/handleTabClick('home')} />
                </a>
            </div>

            <ul className="flex list-none mt-10">
                {/* <!-- Navigation links --> */}
                <div className='bg-red-400 bg-opacity-20 flex  p-1 rounded text-white'>
                    <li className="mr-6">
                        {/* <!-- Home link --> */}
                        <div className={`${state === 'home' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'} rounded px-2 text-sm`}>
                            <a
                                className=""
                                onClick={() => {/*setState('home')*/handleTabClick('home'), setActive('home'), console.log(active) }}
                                data-te-nav-link-ref
                            >Home</a>
                        </div>
                    </li>
                    <li>
                        {/* <!-- Restaurants link -->  */}
                        <div className={`${state === 'resto' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'} rounded  px-2 text-sm`}>
                            <a
                                className=""
                                data-te-nav-link-ref
                                onClick={() => {/*setState('resto')*/handleTabClick('resto'), setActive('resto'), console.log(active) }}
                            >Restaurants</a>
                        </div>
                    </li>
                </div>
            </ul>
            <div className='flex justify-between w-24 items-center'>
                {location.pathname == '/restaurantView' || location.pathname == '/menuList' ?
                    <h1 className='text-yellow-500 hover:cursor-pointer' onClick={() => navigate('/cart')}><FontAwesomeIcon icon={faCartShopping} /></h1>
                    : null}
                <div className="relative" data-te-dropdown-ref>
                    {/* <a
                    className="flex items-center whitespace-nowrap rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white  transition duration-150 ease-in-out hover:bg-primary-600  focus:bg-primary-600  focus:outline-none focus:ring-0 active:bg-primary-700  motion-reduce:transition-none dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                    type="button"
                    id="dropdownMenuButton2"
                    data-te-dropdown-toggle-ref
                    aria-expanded="false"
                    data-te-ripple-init
                    data-te-ripple-color="light"> */}
                    <span className="hidden-arrow" id="dropdownMenuButton2" role="button" data-te-dropdown-toggle-ref aria-expanded="false">
                        {isLoggedIn ? (
                            <>

                                {image ?
                                    <img
                                        src={image}
                                        className="rounded-full h-[30px] w-[30px] mr-5"
                                        alt=""
                                        loading="lazy" />
                                    : <FontAwesomeIcon className='text-gray-600 mr-5 h-4 w-6' icon={faUser} />}
                            </>
                        ) : (
                            // Render login link
                            < a onClick={() => navigate('/login')} className='text-[#4682A9] font-bold text-sm -neutral-500 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-neutral-400'>Login</a>

                        )}
                    </span>

                    {/* </a> */}
                    <ul
                        className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
                        aria-labelledby="dropdownMenuButton2"
                        data-te-dropdown-menu-ref>
                        {isLoggedIn ? (
                            <>
                                <li className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
                                    href="#"
                                    data-te-dropdown-item-ref onClick={() => /*setState('userProfile')*/handleTabClick('userProfile')}>Profile</li>
                                <li className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
                                    href="#"
                                    data-te-dropdown-item-ref onClick={logout}>Logout</li>
                            </>
                        ) : (
                            <li className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
                                href="#"
                                data-te-dropdown-item-ref onClick={() => navigate('/login')}>Login</li>
                        )}
                    </ul>
                </div>
            </div>

        </nav >



    )
}

export default Navbar