import React, { useEffect, useRef, useState } from 'react'
import Logo from '../../../../assets/logo 2 ifood 2.png'
import RestoLogo from '../../../../assets/restaurant-point-logo-vector-ilustration-design-food-icon-cooking-kitchen-fork-menu-dinner-spoon-illustration-cafe-isolated-lunch-156760527 1.png'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux'
import {
    Collapse,
    Dropdown,
    initTE,
} from "tw-elements";

function RestoNavbar() {

    useEffect(() => {
        initTE({ Collapse, Dropdown });
    }, []);
    // const [restoLogo, setRestoLogo] = useState('')
    const { logo } = useSelector((state) => state.resto)
    const navigate = useNavigate()
    const [active, setActive] = useState('reservation')
    const [isMenuVisible, setIsMenuVisible] = useState(true); // Initial state is true to show the menu
    const [isLoggedIn, setLoggedIn] = useState(!!Cookies.get('restoToken'))
    const [state, setState] = useState('')
    const toggleMenuVisibility = () => {
        setIsMenuVisible(!isMenuVisible);
    };
    const handleTab = (tab) => {
        setActive(tab)
        if (tab === 'reservation') {
            navigate('/resto/home')
        }
        else if (tab === 'category') {
            navigate('/resto/categoryMgt')
        }
        else if (tab === 'menu') {
            navigate('/resto/menuMgt')

        }
        else if (tab === 'order') {
            navigate('/resto/orderMgt')

        }
        else if (tab === 'profile') {
            navigate('/resto/restoProfile')
        }
        else if (tab === 'chat') {
            navigate('/resto/chatRoom')
        }
    }

    const logout = () => {
        Cookies.remove('restoToken')
        navigate('/resto')
    }


    return (
        // <div>
        //     <div className='h-5 bg-slate-200 w-full'>
        //     </div>
        //     <div className='bg-white shadow-lg h-20 pb-6 px-9 sm:px-9'>
        //         <div className='flex items-left sm:flex-row justify-between font-mono font-bold'>
        //             <img src={Logo} alt='logo' width={180} height={100} className='w-20 h-20 sm:w-36 sm:h-20' />
        //             <div className={`mt-4 sm:mt-0 sm:flex space-x-4 ${isMenuVisible ? 'block' : 'hidden'}`}>
        //                 <li className={active === 'reservation' ? 'text-red-600 border-b-3' : 'text-blue-600'} onClick={() => handleTab('reservation')}>Home</li>
        //                 <li className={active === 'category' ? 'text-red-600 border-b-3' : 'text-blue-600'} onClick={() => handleTab('category')}>Category Mgt</li>
        //                 <li className={active === 'menu' ? 'text-red-600 border-b-3' : 'text-blue-600'} onClick={() => handleTab('menu')}>Menu Mgt</li>
        //                 <li className={active === 'order' ? 'text-red-600 border-b-3' : 'text-blue-600'} onClick={() => handleTab('order')}>Order Mgt</li>
        //                 <li className={active === 'profile' ? 'text-red-600 border-b-3' : 'text-blue-600'} onClick={() => handleTab('profile')}>Profile</li>
        //                 <li onClick={logout} className='text-blue-600'>Logout</li>
        //             </div>
        //             <button className='sm:hidden' onClick={toggleMenuVisibility}>
        //                 <FontAwesomeIcon icon={faBars} />
        //             </button>
        //             <img src={RestoLogo} alt='Restaurant Logo' width={80} height={80} className='w-12 h-12 sm:w-16 sm:h-16 ml-2 sm:ml-5' />
        //         </div>
        //     </div >
        // </div>

        // <div>
        //     <div className='h-5 bg-slate-200 w-full'></div>
        //     <div className='bg-white shadow-lg py-4 px-6 sm:px-9'>
        //         <div className='flex items-center sm:flex-row justify-between font-mono font-bold'>
        //             <img src={Logo} alt='logo' width={50} className=' ' />
        //             <div className={`mt-4 sm:mt-0 sm:flex space-x-4 ${isMenuVisible ? 'block' : 'hidden'}`}>
        //                 <li className={active === 'reservation' ? 'text-red-600 ' : 'text-blue-600'} onClick={() => handleTab('reservation')}>Home</li>
        //                 <li className={active === 'category' ? 'text-red-600 ' : 'text-blue-600'} onClick={() => handleTab('category')}>Category Mgt</li>
        //                 <li className={active === 'menu' ? 'text-red-600 ' : 'text-blue-600'} onClick={() => handleTab('menu')}>Menu Mgt</li>
        //                 <li className={active === 'order' ? 'text-red-600 ' : 'text-blue-600'} onClick={() => handleTab('order')}>Order Mgt</li>
        //                 <li className={active === 'profile' ? 'text-red-600 ' : 'text-blue-600'} onClick={() => handleTab('profile')}>Profile</li>
        //                 <li className={active === 'chat' ? 'text-red-600 ' : 'text-blue-600'} onClick={() => handleTab('chat')}>Chat Room</li>
        //                 <li onClick={logout} className='text-blue-600'>Logout</li>
        //             </div>
        //             <button className='sm:hidden' onClick={toggleMenuVisibility}>
        //                 <FontAwesomeIcon icon={faBars} />
        //             </button>
        //             <img src={RestoLogo} alt='Restaurant Logo' width={50} height={50} className='w-12 h-12 sm:w-16 sm:h-16 ml-2 sm:ml-5' />
        //         </div>
        //     </div>
        // </div>



        <nav className="flex items-center justify-between bg-[#fff] shadow-md dark:bg-neutral-600 lg:flex-wrap">
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
                    className="mb-4  mx-10 mt-3 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:mb-0 lg:mt-0 sm:ml-0   "
                    href="#">
                    <img
                        src={Logo}
                        className="h-20 mx-5 "
                        alt=" Logo"
                        loading="lazy"
                        onClick={() => /*setState('home')*/handleTab('reservation')} />
                </a>
            </div>

            <ul className="flex list-none mt-10">
                {/* <!-- Navigation links --> */}
                <div className='bg-slate-300 flex  p-1 rounded'>
                    <li className="mr-6">
                        {/* <!-- Home link --> */}
                        <div className={`${state === 'home' ? 'bg-white text-black' : 'hover:bg-white hover:text-black text-black '} rounded px-2 text-sm`}>
                            <a
                                className=""
                                onClick={() => { handleTab('reservation'), setState('home') }}
                                data-te-nav-link-ref
                            >Home</a>
                        </div>
                    </li>
                    <li className="mr-6">
                        {/* <!-- Restaurants link -->  */}
                        <div className={`${state === 'category' ? 'bg-white text-black' : 'hover:bg-white hover:text-black text-black '} rounded px-2 text-sm`}>
                            <a
                                className=""
                                data-te-nav-link-ref
                                onClick={() => { handleTab('category'), setState('category') }}
                            >Category Mgt</a>
                        </div>
                    </li>
                    <li className="mr-6">
                        {/* <!-- Restaurants link -->  */}
                        <div className={`${state === 'menu' ? 'bg-white text-black' : 'hover:bg-white hover:text-black text-black '} rounded px-2 text-sm`}>
                            <a
                                className=""
                                data-te-nav-link-ref
                                onClick={() => { { handleTab('menu'), setState('menu') } }}
                            >Menu Mgt</a>
                        </div>
                    </li>
                    <li className="mr-6">
                        {/* <!-- Restaurants link -->  */}
                        <div className={`${state === 'order' ? 'bg-white text-black' : 'hover:bg-white hover:text-black text-black '} rounded px-2 text-sm`}>
                            <a
                                className=""
                                data-te-nav-link-ref
                                onClick={() => { handleTab('order'), setState('order') }}
                            >Order Mgt</a>
                        </div>
                    </li>
                    <li >
                        {/* <!-- Restaurants link -->  */}
                        <div className={`${state === 'chat' ? 'bg-white text-black' : 'hover:bg-white hover:text-black text-black '} rounded px-2 text-sm`}>
                            <a
                                className=""
                                data-te-nav-link-ref
                                onClick={() => { handleTab('chat'), setState('chat') }}
                            >Chat Room</a>
                        </div>
                    </li>
                </div>
            </ul>

            <div className="relative" data-te-dropdown-ref>

                <span className="hidden-arrow px-5 ml-10" id="dropdownMenuButton2" role="button" data-te-dropdown-toggle-ref aria-expanded="false">

                    <img
                        src={logo}
                        className="rounded-full h-[35px] w-[35px] "
                        alt=""
                        loading="lazy" />


                </span>

                <ul
                    className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
                    aria-labelledby="dropdownMenuButton2"
                    data-te-dropdown-menu-ref>
                    {isLoggedIn ? (
                        <>
                            <li className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
                                href="#"
                                data-te-dropdown-item-ref onClick={() => /*setState('userProfile')*/handleTab('profile')}>Profile</li>
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
        </nav >


    )
}

export default RestoNavbar