import axios from 'axios'
import React, { useContext, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import restoAxios from '../../../../axios/restoAxios'

function AddressForm(props) {
    const [state, setState] = useState(props.state || '')
    const { phone } = useSelector((state) => state.client)
    const [location, setLocation] = useState('')
    const placeInput = useRef(null)
    const cityInput = useRef(null)
    const districtInput = useRef(null)
    const stateInput = useRef(null)
    const countryInput = useRef(null)
    const [address, setAddress] = useState(null)

    const getLocation = (props) => {
        axios.get('https://ipapi.co/json/').then((res) => {
            setLocation(res.data)
        }).catch((err) => {
            console.log(err)
        })

    }

    const saveAddress = () => {
        const inputValue = {
            place: placeInput.current.value,
            city: cityInput.current.value,
            district: districtInput.current.value,
            state: stateInput.current.value,
            country: countryInput.current.value
        }
        setAddress(inputValue)

    }
    return (
        <div className='space-y-4 text-xs'>
            <h1 className='text-center text-lg'>{state === 'edit' ? 'Edit Address' : 'Enter Address'}</h1>
            <div className='space-y-4 text-xs flex justify-center'>
                <div className='space-y-4 text-xs w-2/3 '>
                    <div className=' space-x-10 flex justify-between '>
                        <label htmlFor="">place</label>
                        <input type="text" className='p-1 text-xs w-40 text-gray-600' defaultValue={location ? location.city : ''} ref={placeInput} disabled={address ? state === '' ? true : false : false} />
                    </div>
                    <div className=' space-x-10 flex justify-between'>
                        <label htmlFor="">City</label>
                        <input type="text" className='p-1 text-xs w-40 text-gray-600' defaultValue={location ? location.city : ''} ref={cityInput} disabled={address ? state === '' ? true : false : false} />
                    </div>
                    <div className=' space-x-10 flex justify-between'>
                        <label htmlFor="">District</label>
                        <input type="text" className='p-1 text-xs w-40 text-gray-600' defaultValue={location ? location.city : ''} ref={districtInput} disabled={address ? state === '' ? true : false : false} />
                    </div>
                    <div className=' space-x-10 flex justify-between'>
                        <label htmlFor="">State</label>
                        <input type="text" className='p-1 text-xs w-40 text-gray-600' defaultValue={location ? location.region : ''} ref={stateInput} disabled={address ? state === '' ? true : false : false} />
                    </div>
                    <div className=' space-x-10 flex justify-between'>
                        <label htmlFor="">Country</label>
                        <input type="text" className='p-1 text-xs w-40 text-gray-600' defaultValue={location ? location.country_name : ''} ref={countryInput} disabled={address ? state === '' ? true : false : false} />
                    </div>
                </div>
            </div>
            <div className='flex justify-center space-x-5'>
                {state === 'edit' || address === null ? <button className='text-gray-300 text-md hover:text-gray-400' onClick={getLocation} title='use my location for using you current location'>use my location</button> : null}
                {/* {location ? <small className='text-red-600 text-left'>*Use my location maynot be accurate,Ensure it</small> : ''} */}
                {/* {state === 'edit' ? <button onClick={() => setState('')}>back</button> : ""} */}
                <button className='text-white text-md hover:text-gray-800 hover:bg-white rounded px-2 py-1 ' onClick={address ? state === 'edit' ? () => setState('') : () => setState('edit') : saveAddress} >{address ? state != 'edit' ? 'Edit' : 'Done' : 'Done'}</button>
            </div>
        </div>
    )
}

export default AddressForm