import React, { useEffect, useState } from 'react'
import userAxios from '../../../../axios/userAxios'
import { useNavigate } from 'react-router-dom'
import { auth, firebaseApp } from '../../../../firebaseConfig/firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import bgImg from '../../../assets/pexels-dmitriy-tarasenko-17681853.jpg'

function RegForm() {

    const [formValues, SetValues] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    })

    const [showPassword, setShowPassword] = useState(false)
    const [otp, setOtp] = useState('')
    const [state, setState] = useState('rt')
    const [errors, setError] = useState({})
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

    function handleInput(event) {
        const newObj = { ...formValues, [event.target.name]: event.target.value }
        SetValues(newObj)
    }
    const navigate = useNavigate()
    let flag = true

    const handleSendOtp = async () => {
        try {

            const recaptchaContainer = document.getElementById('recaptcha-container');
            if (recaptchaContainer) {
                recaptchaContainer.innerHTML = ''; // Clear the recaptcha-container
                const newRecaptchaContainer = document.createElement('div');
                newRecaptchaContainer.id = 'recaptcha-container';
                recaptchaContainer.parentNode.replaceChild(newRecaptchaContainer, recaptchaContainer);
            }
            const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
                size: 'invisible',
                callback: () => {
                    console.log('recaptcha resolved..')
                }
            }, auth)
            await signInWithPhoneNumber(auth, '+91' + formValues.phone, recaptchaVerifier).then((result) => {
                window.confirmationResult = result
                setState('otp sent')
                setSeconds(30)
                toast.success("OTP has sent to your phone number", { position: 'bottom-center' })

            })
                .catch((err) => {
                    toast.error(err, { position: 'bottom-center' })
                    alert(err)
                    // window.location.reload()
                    const recaptchaContainer = document.getElementById('recaptcha-container');
                    if (recaptchaContainer) {
                        recaptchaContainer.innerHTML = ''; // Clear the recaptcha-container
                        const newRecaptchaContainer = document.createElement('div');
                        newRecaptchaContainer.id = 'recaptcha-container';
                        recaptchaContainer.parentNode.replaceChild(newRecaptchaContainer, recaptchaContainer);
                    }
                });

        } catch (error) {
            flag = false
            alert(error)
        }
    }

    const validateOtp = async (event) => {
        try {
            event.preventDefault()
            if (otp.trim().length === 6) {
                window.confirmationResult.confirm(otp)
                    .then((res) => {
                        alert('otp successfullly validated')
                        userAxios.post('/signup', {
                            name: formValues.name,
                            email: formValues.email,
                            phone: formValues.phone,
                            password: formValues.password
                        }).then((res) => {
                            if (res.data.success) {
                                navigate('/login')
                            } else {
                                const error = res.data.error
                                const newError = {
                                    [error]: 'Duplicate Phone number/User already existed'
                                }
                            }

                        }).catch((err) => {
                            const error = res.data.error
                            const newError = {
                                [error]: 'Duplicate Phone number/User already existed'
                            }
                        });
                    }).catch((err) => {
                        toast.error('Wtong otp')
                    })
            }
            else {
                setError({ otp: 'Wrong otp' });
            }
        } catch (error) {
            setError({ otp: 'Wrong otp' });
            toast.error('Wrong Code', { position: toast.POSITION.BOTTOM_CENTER })
        }

    }

    function handleSubmit(event) {
        event.preventDefault()

        function validation() {
            const email_regex = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/
            // const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            const newErrors = {}
            if (formValues.name === '') {
                newErrors.name = 'Name is Required'
                flag = false
            }
            if (formValues.email === '') {
                newErrors.email = 'Email is Required'
                flag = false
            }
            else if (!email_regex.test(formValues.email)) {
                newErrors.email = 'Not a Valid Email'
                flag = false
            }
            if (formValues.phone === '') {
                newErrors.phone = 'Phone number is Required'
                flag = false
            } else if (formValues.phone.length != 10) {
                newErrors.phone = 'Enter a valid phone number'
            }
            if (formValues.password === '') {
                newErrors.password = 'Password is Required'
                flag = false
            }
            else if (formValues.password.length < 8) {
                newErrors.password = `Password must have at least 8 characters long`
                flag = false
            }
            if (formValues.confirmPassword === '') {
                newErrors.confirmPassword = 'Password should have been confirmed'
                flag = false
            }
            else if (formValues.confirmPassword != formValues.password) {
                newErrors.confirmPassword = 'Confirm Password is not matched'
                flag = false
            }
            return newErrors
        }

        setError(validation())

        if (flag) {
            userAxios.post('/isDuplicateUser', {
                name: formValues.name,
                email: formValues.email,
                phone: formValues.phone,
                password: formValues.password
            }).then((res) => res.data.success ? handleSendOtp() : toast.error('User Already Existed'))
                .catch((err) => console.log(err))

        }

    }
    return (

        <div>
            <div id='recaptcha-container'></div>
            <div >
                <section className="min-h-screen flex items-stretch text-white">
                    <ToastContainer />
                    <div className="lg:flex w-1/2 hidden bg-red-600 bg-no-repeat bg-cover relative items-center " style={{ backgroundImage: `url(${bgImg})` }} >
                        <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
                        <div className="w-full px-24 z-10">
                            <h1 className="text-5xl font-bold text-left tracking-wide">Keep it special</h1>
                            <p className="text-3xl my-4">“Food is not rational. Food is culture, habit, craving, and identity.” – Jonathan Safran Foer</p>
                        </div>
                    </div>
                    <div className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0 bg-[#0D0F2D]" style={{ backgroundColor: '' }}>
                        <div className="absolute lg:hidden z-10 inset-0 bg-gray-500 bg-no-repeat bg-cover items-center" style={{ backgroundImage: `url(${bgImg})` }}>
                            <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
                        </div>
                        <div className="w-full py-6 z-20">
                            <div className="py-6 space-x-2">
                                {/* <span className="w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white">f</span> */}
                                {/* <span className="w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white">G+</span> */}
                                {/* <span className="w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white">in</span> */}
                                <h1 className='text-2xl '>User Signup</h1>
                            </div>
                            {state === '' ? (
                                <form action="" onSubmit={handleSubmit} className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto" autoComplete='off'>
                                    <div className="pb-2 pt-4">
                                        <input type="text" onChange={handleInput} name="name" placeholder="Enter your Name" className="block w-full p-3 text-sm rounded-sm bg-black" />
                                        {errors.name ? <small className='text-[#D90202]'>{errors.name}</small> : ''}
                                    </div>
                                    <div className="pb-2 pt-4">
                                        <input type="email" onChange={handleInput} name="email" placeholder="Enter your Email" className="block w-full p-3 text-sm rounded-sm bg-black" />
                                        {errors.email ? <small className='text-[#D90202]'>{errors.email}</small> : ''}
                                    </div>
                                    <div className="pb-2 pt-4">
                                        <input type="tel" onChange={handleInput} name="phone" placeholder="Enter the Phone" className="block w-full p-3 text-sm rounded-sm bg-black" />
                                        {errors.phone ? <small className='text-[#D90202]'>{errors.phone}</small> : ''}
                                    </div>
                                    <div className="pb-2 pt-4">
                                        <input type={showPassword === true ? 'text' : 'password'} onChange={handleInput} name="password" placeholder="Enter the Password" className="block w-full p-3 text-sm rounded-sm bg-black" />
                                        {errors.password ? <small className='text-[#D90202]'>{errors.password}</small> : ''}
                                        <div className=' flex items-end justify-end '>
                                            <label htmlFor="showpassword" className='font-mono text-xs text-gray-400 '>Show Password</label>
                                            <input type="checkbox" className='w-3 ml-3 mt-3' onClick={() => setShowPassword(!showPassword)} />
                                        </div>
                                    </div>
                                    <div className="pb-2 pt-4">
                                        <input onChange={handleInput} className="block w-full p-3 text-sm rounded-sm bg-black " type="password" name="confirmPassword" placeholder="Confirm your Password" />
                                        {errors.confirmPassword ? <small className='text-[#D90202]'>{errors.confirmPassword}</small> : ''}
                                    </div>


                                    <div className="px-4 pb-2 pt-4">
                                        <button className="uppercase block w-full p-3 text-sm rounded-full bg-red-600 hover:bg-gray-600 " type='submit'>sign up</button>
                                    </div>
                                    <a onClick={() => navigate('/login')} className="text-gray-400 hover:text-gray-100 mt-3">
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
                                        <button type='submit' className="uppercase block w-full p-3 text-sm rounded-full bg-red-600 hover:bg-gray-600 ">submit otp</button>
                                    </div>
                                    <div className='text-yellow-600 mt-5'>
                                        <p>Time Remaining: {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
                                    </div>
                                    <div className="text-center text-gray-400 hover:underline hover:text-gray-100 mt-5">
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

export default RegForm