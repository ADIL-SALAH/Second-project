import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import logo from '../../../../assets/logo 2 ifood 2.png';
import {
    Collapse,
    Dropdown,
    initTE,
} from 'tw-elements';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faWallet, faBars } from '@fortawesome/free-solid-svg-icons';
import { clientLogout } from '../../../../../redux/client';
import { updateClientState } from '../../../../../redux/client';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

function Navbar(props) {
    const location = useLocation();
    console.log(location.pathname);

    useEffect(() => {
        initTE({ Collapse, Dropdown });
    }, []);

    const { name, username, image, state, wallet } = useSelector(
        (state) => state.client
    );
    const navigate = useNavigate();
    const [isLoggedIn, setLoggedIn] = useState(!!Cookies.get('token'));
    const [active, setActive] = useState('home');
    const dispatch = useDispatch();

    useEffect(() => {
        if (state === 'home') {
            navigate('/');
        } else if (state === 'resto') {
            navigate('/restos');
        } else if (state === 'userProfile') {
            navigate('/userProfile');
        }
    }, [state, active]);

    const logout = () => {
        Cookies.remove('token');
        navigate('/');
        useDispatch(clientLogout())
        setLoggedIn(false);
    };

    const handleTabClick = (tab) => {
        dispatch(updateClientState({ state: tab }));
    };
    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };
    return (
        <nav className={`${location.pathname === '/cart' ? 'bg-red-800' : location.pathname === '/checkOut' ? 'bg-red-800' : 'bg-transparent'} flex items-center justify-between bg-red-800  sticky top-0 z-50 shadow-md dark:bg-neutral-600 lg:flex-wrap`} >


            <div className="flex justify-center bg-opacity-50">
                <a
                    className={`"mb-4 mt-3 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:mb-0 lg:mt-0 sm:ml-0"`}
                    href="#"
                >
                    <img
                        src={logo}
                        className="h-20 ml-5"
                        alt=" Logo"
                        loading="lazy"
                        onClick={() => handleTabClick('home')}
                    />
                </a>
            </div>

            <ul className="flex list-none mt-10">
                <div className="bg-slate-400 bg-opacity-20 flex p-1 rounded text-white">
                    <li className="mr-6">
                        <div
                            className={`${state === 'home'
                                ? 'bg-white text-black'
                                : 'hover:bg-white hover:text-black'
                                } rounded px-2 text-sm`}
                        >
                            <a
                                className=""
                                onClick={() =>
                                    handleTabClick('home')
                                }
                                data-te-nav-link-ref
                            >
                                Home
                            </a>
                        </div>
                    </li>
                    <li>
                        <div
                            className={`${state === 'resto'
                                ? 'bg-white text-black'
                                : 'hover:bg-white hover:text-black'
                                } rounded  px-2 text-sm`}
                        >
                            <a
                                className=""
                                data-te-nav-link-ref
                                onClick={() =>
                                    handleTabClick('resto')
                                }
                            >
                                Restaurants
                            </a>
                        </div>
                    </li>
                </div>
            </ul>
            <div className="md:flex justify-between items-center md:w-40">
                {isLoggedIn ? (
                    <div className="text-xs flex text-slate-300 items-center justify-between space-x-2">
                        <FontAwesomeIcon icon={faWallet} className=" " />
                        <span>Rs: {wallet}</span>
                    </div>
                ) : null}
                {(location.pathname === '/restaurantView' ||
                    location.pathname === '/menuList') && (
                        <span
                            className="text-yellow-500 hover:cursor-pointer"
                            onClick={() => navigate('/cart')}
                        >
                            <FontAwesomeIcon icon={faCartShopping} />
                        </span>
                    )}
                <div className="relative" data-te-dropdown-ref>
                    <span
                        className="hidden-arrow"
                        id="dropdownMenuButton2"
                        role="button"
                        data-te-dropdown-toggle-ref
                        aria-expanded="false"
                    >
                        {isLoggedIn ? (
                            <>
                                {image ? (
                                    <img
                                        src={image}
                                        className="rounded-full h-[30px] w-[30px] mr-5"
                                        alt=""
                                        loading="lazy"
                                    />
                                ) : (
                                    <FontAwesomeIcon
                                        className="text-gray-400 mr-5 h-4 w-6"
                                        icon={faUser}
                                    />
                                )}
                            </>
                        ) : (
                            <a
                                onClick={() => navigate('/login')}
                                className="text-slate-300 font-bold text-sm -neutral-500 transition duration-200 hover:text-neutral-700 hover:ease-in-out focus:text-neutral-700 disabled:text-black/30 motion-reduce:transition-none dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
                            >
                                Login
                            </a>
                        )}
                    </span>
                    <ul
                        className="absolute z-[1000] float-left m-0 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
                        aria-labelledby="dropdownMenuButton2"
                        data-te-dropdown-menu-ref
                    >
                        {isLoggedIn ? (
                            <>
                                <li
                                    className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
                                    href="#"
                                    data-te-dropdown-item-ref
                                    onClick={() =>
                                        handleTabClick('userProfile')
                                    }
                                >
                                    Profile
                                </li>
                                <li
                                    className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
                                    href="#"
                                    data-te-dropdown-item-ref
                                    onClick={logout}
                                >
                                    Logout
                                </li>
                            </>
                        ) : (
                            <li
                                className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
                                href="#"
                                data-te-dropdown-item-ref
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav >
    );
}

export default Navbar;
