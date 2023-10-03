import React, { useEffect, useState } from 'react'
import bgImg from '../../../assets/pexels-photo-4350101.webp'
import restoAxios from '../../../../axios/restoAxios'
import { useDispatch } from 'react-redux'
import { restoLogin } from '../../../../redux/resto'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { auth } from '../../../../firebaseConfig/firebaseConfig'

function RestoLogin() {



    const dispatch = useDispatch()
    const navigate = useNavigate()



    const [formValues, setFormValues] = useState({
        phone: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [state, setState] = useState('')
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
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
    const handleSubmit = (event) => {
        event.preventDefault()
        let flag = true
        const validation = () => {
            const newError = {}
            if (formValues.phone.trim().length === 0) {
                newError.phone = 'Enter the Phone'
                flag = false
            } else if (formValues.phone.trim().length < 10) {
                newError.phone = 'Invalid Phone'
            }
            if (formValues.password.trim().length === 0) {
                newError.password = 'Enter the Password'
                flag = false
            } else if (formValues.password.trim().length < 8) {
                newError.password = 'Invalid Password'
                flag = false
            }
            return newError
        }
        setErrors(validation())
        if (flag) {
            const data = { phone: formValues.phone, password: formValues.password }
            restoAxios.post('/', data).then((res) => {
                if (res.data.success) {
                    Cookies.set('restoToken', res.data.token)
                    dispatch(restoLogin({ restoName: res.data.restoName, phone: res.data.phone, logo: res.data.logo, objId: res.data.objId }))
                    navigate('/resto/home')
                } else {
                    const err = res.data.error
                    if (err === 'phone') {
                        setErrors({
                            phone: 'Incorrect phone number'
                        })
                    }
                    if (err === 'password') {
                        setErrors({
                            phone: 'Incorrect password'
                        })
                    }
                    else if (res.data.error === 'permission not granted') {
                        toast.info('Wait!! Admin have to Accept you')
                    }
                }

            })
        }

    }

    const forgotPassword = (event) => {
        event.preventDefault()
        let flag = true
        const validation = () => {
            if (phone.trim().length === 0) {
                setErrors({ phone: 'Enter your phone' })
                flag = false
            } else if (phone.trim().length < 10) {
                setErrors({ phone: 'Invalid Phone' })
                flag = false
            }
        }

        validation()

        if (flag) {
            restoAxios.get(`/forgotPassword?phone=${phone}`)
                .then((res) => {
                    if (res.data.success) {
                        sendOtp()
                    } else {
                        toast.error('Account doesnt exist on this number')
                    }
                }).catch((err) => {
                    console.log(err)
                })
        }
    }
    const sendOtp = () => {
        try {
            const recaptchaContainer = document.getElementById('recaptcha-container');
            if (recaptchaContainer) {
                recaptchaContainer.innerHTML = ''; // Clear the recaptcha-container
                const newRecaptchaContainer = document.createElement('div');
                newRecaptchaContainer.id = 'recaptcha-container';
                recaptchaContainer.parentNode.replaceChild(newRecaptchaContainer, recaptchaContainer);
            }
            const appVerifier = new RecaptchaVerifier('recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    console.log('recaptcha resolved..forgot password')
                }
            }, auth);

            signInWithPhoneNumber(auth, '+91' + phone, appVerifier)
                .then((confirmationResult) => {
                    // SMS sent. Prompt user to type the code from the message, then sign the
                    // user in with confirmationResult.confirm(code).
                    window.confirmationResult = confirmationResult;
                    setState('Enter otp')
                    setSeconds(30)
                    toast.success("OTP has sent to your phone number", { position: 'bottom-center' })
                }).catch((error) => {
                    // Error; SMS not sent
                    toast.error(error, { position: 'bottom-center' })
                    const recaptchaContainer = document.getElementById('recaptcha-container');
                    if (recaptchaContainer) {
                        recaptchaContainer.innerHTML = ''; // Clear the recaptcha-container
                        const newRecaptchaContainer = document.createElement('div');
                        newRecaptchaContainer.id = 'recaptcha-container';
                        recaptchaContainer.parentNode.replaceChild(newRecaptchaContainer, recaptchaContainer);
                    }
                });
        } catch (error) {
            console.log(error)
            toast.error(error)
        }

    }

    const validateOtp = (event) => {
        event.preventDefault()
        let flag = true
        if (otp.trim().length === 0) {
            setErrors({ otp: 'Enter otp' })
            flag = false
        } else if (otp.trim().length < 6) {
            setErrors({ otp: 'Wrong otp' })
            flag = false
        }
        if (flag) {
            confirmationResult.confirm(otp).then((result) => {
                // User signed in successfully.
                const user = result.user;
                setState('otp validated')
                toast.success('otp successfully validated')
            }).catch((error) => {
                // User couldn't sign in (bad verification code?)
                toast.error('wrong otp')
            });
        }
    }
    const resetPassword = (event) => {
        event.preventDefault()
        let flag = true

        const formValidation = () => {
            const newError = {}
            if (newPassword.trim().length === 0) {
                newError.newPassword = 'Enter new Password'
                flag = false
            }
            else if (newPassword.trim().length < 8) {
                newError.newPassword = 'Password must contain 8 length'
                flag = false
            }
            if (newPassword.trim() != confirmNewPassword.trim()) {
                newError.confirmNewPassword = 'Confirm Password not matching'
                flag = false
            }
            return newError
        }
        setErrors(formValidation())
        if (flag) {
            restoAxios.put('/resetPassword', { newPassword: newPassword, phone: phone })
                .then((res) => {
                    if (res.data.success) {
                        toast.success('Password Updated Successfully')
                        setState('')
                    }
                    else {
                        toast.error('Password Updation Failed')
                    }
                }).catch((err) => {
                    console.log(err)
                })
        }
    }

    return (

        <section className="min-h-screen flex items-stretch text-white ">
            <ToastContainer />
            <div id='recaptcha-container'></div>
            <div className="lg:flex w-1/2 hidden bg-red-600 bg-no-repeat bg-cover relative items-center " style={{ backgroundImage: `url(${bgImg})` }} >
                <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
                <div className="w-full px-24 z-10">
                    <h1 className="text-5xl font-bold text-left tracking-wide">Hit the sales</h1>
                    <p className="text-3xl my-4">Build your profile with us,strike the sales over the limits  </p>
                </div>
            </div>
            {state === '' ? (
                <div className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0 bg-[#315340]" style={{ backgroundColor: '#' }}>
                    <div className="absolute lg:hidden z-10 inset-0 bg-gray-500 bg-no-repeat bg-cover items-center" style={{ backgroundImage: `url(${bgImg})` }}>
                        <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
                    </div>
                    <div className="w-full py-6 z-20">
                        <div className="py-6 space-x-2">
                            {/* <span className="w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white">f</span> */}
                            {/* <span className="w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white">G+</span> */}
                            {/* <span className="w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white">in</span> */}
                            <h1 className='text-2xl'>Restaurant Login</h1>
                        </div>
                        <form action="" onSubmit={handleSubmit} className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto" autoComplete='off'>
                            <div className="pb-2 pt-4">
                                <input type="tel" onChange={handleInput} name="phone" placeholder="Enter the Phone" className="block w-full p-3 text-sm rounded-sm bg-black" />
                                {errors.phone ? <small className='text-[#D90202]'>{errors.phone}</small> : ''}
                            </div>
                            <div className="pb-2 pt-4">
                                <input onChange={handleInput} className="block w-full p-3 text-sm rounded-sm bg-black " type={showPassword ? 'text' : 'password'} name="password" placeholder="Enter the Password" />
                                {errors.password ? <small className='text-[#D90202]'>{errors.password}</small> : ''}
                                <div className=' flex items-end justify-end '>
                                    <label htmlFor="showpassword" className='font-mono text-xs text-gray-400 '>Show Password</label>
                                    <input type="checkbox" className='w-3 ml-3 mt-3' onClick={() => setShowPassword(!showPassword)} />
                                </div>
                            </div>
                            <div className="text-right text-gray-400 hover:underline hover:text-gray-100">
                                <small onClick={() => setState('forgotPassword')} className='cursor-pointer'>Forgot your password?</small>
                            </div>
                            <div className="px-4 pb-2 pt-4">
                                <button type='submit' className="uppercase block w-full p-3 text-sm rounded-full bg-red-600 hover:bg-gray-600 ">Login in</button>
                            </div>
                            <div>
                                <button type='button' onClick={() => navigate('/resto/signup')} className="text-gray-400 hover:text-gray-100 mt-4">
                                    Don't have an account? <small className='underline' >signup here</small>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : state === 'forgotPassword' ? (
                <div className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0 bg-[#503010]" style={{ backgroundColor: '#' }}>
                    <div className="absolute lg:hidden z-10 inset-0 bg-gray-500 bg-no-repeat bg-cover items-center" style={{ backgroundImage: `url(${bgImg})` }}>
                        <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
                    </div>
                    <div className="w-full py-6 z-20">

                        <div className="py-6 space-x-2">
                            <h1 className='font-mono text-xl'>Forgot Password</h1>
                        </div>
                        <form action="" onSubmit={forgotPassword} className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto" autoComplete='off'>
                            <div className="pb-2 pt-4">
                                <input type="tel" onChange={(e) => { setPhone(e.target.value) }} name="phone" placeholder="Enter Your Phone" className="block w-full p-3 text-sm rounded-sm bg-black " autoComplete='off' value={phone} />
                                {errors.phone ? <small className='text-[#D90202]'>{errors.phone}</small> : ''}
                            </div>
                            <div className="px-4 pb-2 pt-4">
                                <button type='submit' className="uppercase block w-full p-3 text-sm rounded-full bg-red-600 hover:bg-gray-600 ">Get otp</button>
                            </div>
                            <div className='mt-5 text-right font-mono cursor-pointer'>
                                <small onClick={() => setState('')} className=' '>Back to Login</small>
                            </div>
                        </form>


                    </div>
                </div>
            ) : state === 'Enter otp' ? (
                <div className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0 bg-[#503010]" style={{ backgroundColor: '#' }}>
                    <div className="absolute lg:hidden z-10 inset-0 bg-gray-500 bg-no-repeat bg-cover items-center" style={{ backgroundImage: `url(${bgImg})` }}>
                        <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
                    </div>
                    <div className="w-full py-6 z-20">

                        <div className="py-6 space-x-2">
                            <h1 className='font-mono text-xl'>Enter the OTP</h1>
                        </div>
                        <form action="" onSubmit={validateOtp} className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto" autoComplete='off'  >
                            <div className="pb-2 pt-4">
                                <input type="tel" onChange={(e) => { setOtp(e.target.value) }} name="phone" placeholder="Enter the OTP" className="block w-full p-3 text-sm rounded-sm bg-black" value={otp} />
                                {errors.otp ? <small className='text-[#D90202]'>{errors.otp}</small> : ''}
                            </div>


                            <div className="px-4 pb-2 pt-4">
                                <button className="uppercase block w-full p-3 text-sm rounded-full bg-red-600 hover:bg-gray-600 ">submit otp</button>
                            </div>
                            <div className='text-yellow-600 mt-5'>
                                <p>Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
                            </div>
                            <div className="text-center text-gray-200 hover:underline hover:text-gray-100 mt-5">
                                {minutes === 0 && seconds === 0 ? <small className='cursor-pointer' onClick={sendOtp}>Resend OTP</small> : ''}
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0 bg-[#503010]" style={{ backgroundColor: '#' }}>
                    <div className="absolute lg:hidden z-10 inset-0 bg-gray-500 bg-no-repeat bg-cover items-center" style={{ backgroundImage: `url(${bgImg})` }}>
                        <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
                    </div>
                    <div className="w-full py-6 z-20">

                        <div className="py-6 space-x-2">
                            <h1 className='font-mono text-xl'>Reset Password</h1>
                        </div>
                        <form action="" onSubmit={resetPassword} className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto" autoComplete='off'>
                            <div className="pb-2 pt-4">
                                <input type="tel" value={phone} name="phone" placeholder="Enter Your Phone" className="block w-full p-3 text-sm rounded-sm bg-black " disabled />
                                {/* {errors.phone ? <small className='text-[#D90202]'>{errors.phone}</small> : ''} */}
                            </div>
                            <div className="pb-2 pt-4">
                                <input type="password" onChange={(e) => { setNewPassword(e.target.value) }} name="newPassword" placeholder="Enter new Password" className="block w-full p-3 text-sm rounded-sm bg-black " />
                                {errors.newPassword ? <small className='text-[#D90202]'>{errors.newPassword}</small> : ''}
                            </div>
                            <div className="pb-2 pt-4">
                                <input type="password" onChange={(e) => { setConfirmNewPassword(e.target.value) }} name="confirmNewPassword" placeholder="Confirm new Password" className="block w-full p-3 text-sm rounded-sm bg-black " />
                                {errors.confirmNewPassword ? <small className='text-[#D90202]'>{errors.confirmNewPassword}</small> : ''}
                            </div>
                            <div className="px-4 pb-2 pt-4">
                                <button type='submit' className="uppercase block w-full p-3 text-sm rounded-full bg-red-600 hover:bg-gray-600 ">Reset password</button>
                            </div>
                            <div className='mt-5 text-right font-mono cursor-pointer'>
                                <small onClick={() => setState('')} className=' '>Back to Login</small>
                            </div>
                        </form>


                    </div>
                </div>
            )}
        </section>

    )
}

export default RestoLogin