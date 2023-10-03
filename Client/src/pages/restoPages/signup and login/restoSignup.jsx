import React, { useEffect, useState } from 'react'
import bgImg from '../../../assets/pexels-vidal-balielo-jr-14515104.jpg'
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '../../../../firebaseConfig/firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import restoAxios from '../../../../axios/restoAxios';
import Cookies from 'js-cookie';



function RestoSignup() {

    const navigate = useNavigate()


    const [formValues, setFormValues] = useState({
        RestoName: '',
        username: '',
        phone: '',
        password: '',
        confirmPassword: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [state, setState] = useState('')
    const [errors, setErrors] = useState({})
    const [otp, setOtp] = useState('')
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(30);



    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);

            }

            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(interval);
                } else {
                    setSeconds(59);
                    setMinutes(minutes - 1);
                }
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [seconds]);


    const handleInput = (event) => {
        const newObj = { ...formValues, [event.target.name]: event.target.value }
        setFormValues(newObj)
    }

    const handleSendOtp = async () => {
        try {
            const recaptchaContainer = document.getElementById('sign-in-button');
            if (recaptchaContainer) {
                recaptchaContainer.innerHTML = ''; // Clear the recaptcha-container
                const newRecaptchaContainer = document.createElement('div');
                newRecaptchaContainer.id = 'sign-in-button';
                recaptchaContainer.parentNode.replaceChild(newRecaptchaContainer, recaptchaContainer);
            }
            window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
                'size': 'invisible',
                'callback': () => {
                    console.log('recaptcha resolved..')
                }
            }, auth)
            const appVerifier = window.recaptchaVerifier
            await signInWithPhoneNumber(auth, '+91' + formValues.phone, appVerifier)
                .then((confirmationResult) => {
                    toast.success('OTP sent to your phone number. Please Verify')
                    window.confirmationResult = confirmationResult;
                    setState('otp has sent')
                    setSeconds(30)
                }).catch((error) => {
                    console.log(error)
                    alert(error)
                    // toast.error(error, { position: 'bottom-center' })
                    const recaptchaContainer = document.getElementById('sign-in-button');
                    if (recaptchaContainer) {
                        recaptchaContainer.innerHTML = ''; // Clear the recaptcha-container
                        const newRecaptchaContainer = document.createElement('div');
                        newRecaptchaContainer.id = 'sign-in-button';
                        recaptchaContainer.parentNode.replaceChild(newRecaptchaContainer, recaptchaContainer);
                    }
                })
        } catch (error) {
            console.log(error)
        }

    }

    const validateOtp = async (event) => {
        try {
            event.preventDefault()
            if (otp.trim().length === 6) {
                confirmationResult.confirm(otp).then((result) => {
                    const user = result.user;
                    toast.success('OTP Confirmed')
                    restoAxios.post('/signup', {
                        name: formValues.RestoName,
                        username: formValues.username,
                        password: formValues.password,
                        phone: formValues.phone
                    }).then((res) => {
                        toast.success('user details successfully posted to server')
                        navigate('/resto')

                    })
                        .catch((err) => console.log(err))
                }).catch((error) => {
                    toast.error('Wrong OTP')

                });
            } else {
                // res.json({ success: true, error: 'otp must contains 6 digits' })
                setErrors({ otp: 'Wrong otp' })
                // toast.error('Wrong OTP')
            }
        } catch (error) {
            console.log(error)
            toast.err('something went wrong')
        }

    }


    const handleSubmit = (event) => {

        event.preventDefault()

        let flag = true

        const validation = () => {
            const newErrors = {}
            const email_regex = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/
            if (formValues.RestoName.trim().length === 0) {
                newErrors.RestoName = 'Enter Restaurant Name'
                flag = false
            }
            if (formValues.username.trim().length === 0) {
                newErrors.username = 'Enter Restaurant Email'
                flag = false
            } else if (!email_regex.test(formValues.username)) {
                newErrors.username = 'Not a Valid Email'
                flag = false
            }
            if (formValues.phone.trim().length === 0) {
                newErrors.phone = 'Enter Phone'
                flag = false
            } else if (formValues.phone.length != 10) {
                newErrors.phone = 'Invalid Phone'
                flag = false
            }
            if (formValues.password.trim().length === 0) {
                newErrors.password = 'Enter the Password'
                flag = false
            } else if (formValues.password.trim().length < 8) {
                newErrors.password = 'Password must contain 8 digits'
                flag = false
            }
            if (formValues.confirmPassword.trim().length === 0) {
                newErrors.confirmPassword = 'Confirm Password required'
                flag = false
            } else if (formValues.confirmPassword != formValues.password) {
                newErrors.confirmPassword = 'Confirm password is not matched'
                flag = false
            }
            return newErrors
        }

        setErrors(validation())

        if (flag) {
            handleSendOtp()
        }

    }
    return (
        <div>
            <div id='sign-in-button'></div>
            <div>
                <section className="min-h-screen flex items-stretch text-white">
                    <ToastContainer />
                    <div className="lg:flex w-1/2 hidden bg-red-600 bg-no-repeat bg-cover relative items-center " style={{ backgroundImage: `url(${bgImg})` }} >
                        <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
                        <div className="w-full px-24 z-10">
                            <h1 className="text-5xl font-bold text-left tracking-wide">Be with us</h1>
                            <p className="text-3xl my-4">Serve the best in best forms, double your sales with us</p>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0 bg-[#4d3d00]" style={{ backgroundColor: '' }}>
                        <div className="absolute lg:hidden z-10 inset-0 bg-gray-500 bg-no-repeat bg-cover items-center" style={{ backgroundImage: `url(${bgImg})` }}>
                            <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
                        </div>
                        <div className="w-full py-6 z-20">
                            <div className="py-6 space-x-2">
                                {/* <span className="w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white">f</span> */}
                                {/* <span className="w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white">G+</span> */}
                                {/* <span className="w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white">in</span> */}
                                <h1 className='text-2xl '>Restaurant Signup</h1>
                            </div>
                            {state === '' ? (
                                <form action="" onSubmit={handleSubmit} className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto" autoComplete='off'>
                                    <div className="pb-2 pt-4">
                                        <input type="text" onChange={handleInput} name="RestoName" placeholder="Enter your Name" className="block w-full p-3 text-sm rounded-sm bg-black" />
                                        {errors.RestoName ? <small className='text-[#D90202] '>{errors.RestoName}</small> : ''}
                                    </div>
                                    <div className="pb-2 pt-4">
                                        <input type="email" onChange={handleInput} name="username" placeholder="Enter your Email" className="block w-full p-3 text-sm rounded-sm bg-black" />
                                        {errors.username ? <small className='text-[#D90202] '>{errors.username}</small> : ''}
                                    </div>
                                    <div className="pb-2 pt-4">
                                        <input type="tel" onChange={handleInput} name="phone" placeholder="Enter the Phone" className="block w-full p-3 text-sm rounded-sm bg-black" />
                                        {errors.phone ? <small className='text-[#D90202] '>{errors.phone}</small> : ''}
                                    </div>
                                    <div className="pb-2 pt-4">
                                        <input type={showPassword ? 'text' : 'password'} onChange={handleInput} name="password" placeholder="Enter the Password" className="block w-full p-3 text-sm rounded-sm bg-black" />
                                        {errors.password ? <small className='text-[#D90202] '>{errors.password}</small> : ''}
                                        <div className=' flex items-end justify-end '>
                                            <label htmlFor="showpassword" className='font-mono text-xs text-gray-400 '>Show Password</label>
                                            <input type="checkbox" className='w-3 ml-3 mt-3' onClick={() => setShowPassword(!showPassword)} />
                                        </div>
                                    </div>
                                    <div className="pb-2 pt-4">
                                        <input onChange={handleInput} className="block w-full p-3 text-sm rounded-sm bg-black " type="password" name="confirmPassword" placeholder="Confirm your Password" />
                                        {errors.confirmPassword ? <small className='text-[#D90202] '>{errors.confirmPassword}</small> : ''}
                                    </div>


                                    <div className="px-4 pb-2 pt-4">
                                        <button type='submit' className="uppercase block w-full p-3 text-sm rounded-full bg-red-600 hover:bg-gray-600 ">sign up</button>
                                    </div>
                                    <a onClick={() => navigate('/resto')} className="text-gray-400 hover:text-gray-100 mt-3">
                                        Already have an account? <small className='underline'> Login here</small>
                                    </a>
                                </form>
                            ) : (
                                <form action="" onSubmit={validateOtp} className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto" autoComplete='off'>
                                    <div className="pb-2 pt-4">
                                        <input type="tel" onChange={(e) => { setOtp(e.target.value) }} name="phone" placeholder="Enter the OTP" className="block w-full p-3 text-sm rounded-sm bg-black " value={otp} />
                                        {errors.otp ? <small className='text-[#D90202]'>{errors.otp}</small> : ''}
                                    </div>


                                    <div className="px-4 pb-2 pt-4">
                                        <button className="uppercase block w-full p-3 text-sm rounded-full bg-red-600 hover:bg-gray-600 ">submit otp</button>
                                    </div>
                                    <div className='text-yellow-600 mt-5'>
                                        <p>Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
                                    </div>
                                    <div className="text-center text-gray-400 hover:underline hover:text-gray-100 mt-5">
                                        {/* {showResendBtn ? <small className='cursor-pointer' onClick={handleSendOtp}>Resend OTP</small> : ''} */}
                                        {minutes === 0 && seconds === 0 ? <small className='cursor-pointer' onClick={handleSendOtp}>Resend OTP</small> : ''}
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </section>
            </div >
        </div>
    )


}

export default RestoSignup