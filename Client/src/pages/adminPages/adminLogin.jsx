import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import bgImg from '../../assets/pexels-magda-ehlers-1279813.jpg'
import adminAxios from '../../../axios/adminAxios'
import { clientLogin } from '../../../redux/client'
import { ToastContainer, toast } from 'react-toastify'

function AdminLogin() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (Cookies.get('adminToken')) {
            navigate('/admin/home')
        }
    })

    const [formValues, setFormValues] = useState({
        phone: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
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
                newError.phone = 'Enter Phone'
                flag = false
            } else if (formValues.phone.trim().length < 10) {
                newError.phone = 'Invalid Phone'
                flag = false
            }
            if (formValues.password.trim().length === 0) {
                newError.password = 'Enter Password'
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
            adminAxios.post('/', data).then((res) => {
                if (res.data.success) {
                    Cookies.set('adminToken', res.data.token)
                    dispatch(clientLogin({ restoName: res.data.restoName, phone: res.data.phone, logo: res.data.logo, objId: res.data.objId }))
                    navigate('/admin/home')
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
                    else if (res.data.error === 'user is not an admin') {
                        toast.info('Wait!! Admin have to Accept you')
                    }
                }

            })
        }

    }
    return (
        // <div className='h-screen w-screen p-10 bg-white'>
        //     <img src={Logo} alt="logo" width={120} height={120} />
        //     <div className='flex justify-center '>
        //         <form onSubmit={handleSubmit} className='p-5 border-4 border-gray-600 w-96 rounded-lg' >
        //             <h1 className='text-gray-600 m-3 mb-4 flex justify-center font-bold'>Admin Login</h1>
        //             <div className='mb-5'>
        //                 <input type="text" name='phone' placeholder='Enter Your Phone' pattern="[789][0-9]{9}" className='w-full h-8 rounded-full p-4  bg-slate-600' onChange={handleInput} />
        //                 {errors.phone ? <small className='text-red-700'>{errors.phone}</small> : ''}

        //             </div>
        //             <div className='mb-10'>
        //                 <input type="password" name='password' placeholder='password' className='w-full h-8 rounded-full p-4  bg-slate-600' onChange={handleInput} />
        //                 {errors.password ? <small className='text-red-700'>{errors.password}</small> : ''}
        //             </div>

        //             <div className='flex justify-center mt-5 mb-5 h-8 bg-black rounded-lg'>
        //                 <button type='submit' value="Signup" className='text-white '>Login</button>
        //             </div>
        //         </form>

        //     </div >
        // </div>

        <section className="min-h-screen flex items-stretch text-white ">
            <ToastContainer />
            <div id='recaptcha-container'></div>
            <div className="lg:flex w-1/2 hidden bg-red-600 bg-no-repeat bg-cover relative items-center " style={{ backgroundImage: `url(${bgImg})` }} >
                <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
                <div className="w-full px-24 z-10">
                    <h1 className="text-5xl font-bold text-left tracking-wide">Build, review the profile with us</h1>
                    <p className="text-3xl my-4">we lead you to the best restaurant for you</p>
                </div>
            </div>
            <div className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0 bg-red-950" style={{ backgroundColor: '#' }}>
                <div className="absolute lg:hidden z-10 inset-0 bg-gray-500 bg-no-repeat bg-cover items-center" style={{ backgroundImage: `url(${bgImg})` }}>
                    <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
                </div>
                <div className="w-full py-6 z-20">
                    <div className="py-6 space-x-2">
                        {/* <span className="w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white">f</span> */}
                        {/* <span className="w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white">G+</span> */}
                        {/* <span className="w-10 h-10 items-center justify-center inline-flex rounded-full font-bold text-lg border-2 border-white">in</span> */}
                        <h1 className='text-2xl'>Admin Login</h1>
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

                        <div className="px-4 pb-2 pt-4">
                            <button type='submit' className="uppercase block w-full p-3 text-sm rounded-full bg-red-600 hover:bg-gray-600 ">Login in</button>
                        </div>

                    </form>
                </div>
            </div>
        </section>


    )
}

export default AdminLogin