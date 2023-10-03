import React, { useRef } from 'react'
import { toast } from 'react-toastify'

function DeliveryAddressForm(getAddress) {

    const nameInp = useRef(null)
    const phoneInp = useRef(null)
    const addressInp = useRef(null)
    const cityInp = useRef(null)
    const countryInp = useRef(null)
    const stateInp = useRef(null)
    console.log(getAddress)
    const getFormValues = () => {
        const name = nameInp?.current?.value
        const phone = phoneInp?.current?.value
        const address = addressInp?.current?.value
        const city = cityInp?.current?.value
        const country = countryInp?.current?.value
        const state = stateInp?.current?.value
        console.log(name, address, phone, city, country, state)
        toast.success('Address saved', { position: 'top-center' })
        getAddress.getAddress({ name: name, phone: phone, address: address, city: city, country: country, state: state })
    }

    return (
        <div className="w-full text-xs p-2 flex items-center justify-center">
            <div className="container max-w-screen-lg mx-auto">
                <div>
                    <h2 className="font-semibold mb-6 text-xl text-gray-600">Address Form</h2>

                    <div className="bg-white rounded shadow-lg p-3 px-2 md:p-8 mb-6">
                        <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-1">

                            <div className="lg:col-span-2">
                                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                                    <div className="md:col-span-5">
                                        <label htmlFor="full_name ">Full Name</label>
                                        <input ref={nameInp} type="text" name="full_name" id="full_name" className="h-6 px-2  border mt-1 rounded w-full bg-gray-50" />
                                    </div>

                                    <div className="md:col-span-5">
                                        <label htmlFor="email">Phone</label>
                                        <input ref={phoneInp} type="text" name="phone" id="email" className="h-6 px-2 border mt-1 rounded  w-full bg-gray-50" placeholder="9876543210" />
                                    </div>

                                    <div className="md:col-span-3">
                                        <label htmlFor="address">Address / Street</label>
                                        <input ref={addressInp} type="text" name="address" id="address" className="h-6 px-2 border mt-1 rounded  w-full bg-gray-50" placeholder="" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="city">City</label>
                                        <input ref={cityInp} type="text" name="city" id="city" className="h-6 px-2 border mt-1 rounded  w-full bg-gray-50" placeholder="" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="country">Country / region</label>
                                        <div className="h-6 px-2 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                                            <input ref={countryInp} name="country" id="country" placeholder="Country" className=" appearance-none outline-none text-gray-800 w-full bg-transparent" />

                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="state">State </label>
                                        <div className="h-6 px-2 bg-gray-50 flex border border-gray-200 rounded items-center mt-1">
                                            <input ref={stateInp} name="state" id="state" placeholder="State" className=" appearance-none outline-none text-gray-800 w-full bg-transparent" />

                                        </div>
                                    </div>

                                    {/* <div className="md:col-span-1">
                                        <label htmlFor="zipcode">Zipcode</label>
                                        <input type="text" name="zipcode" id="zipcode" className="transition-all flex items-center h-6 px-2 border mt-1 rounded  w-full bg-gray-50" placeholder="" />
                                    </div> */}


                                    <div className="md:col-span-5 text-right">
                                        <div className="inline-flex items-end">
                                            <button onClick={getFormValues} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-xs rounded">Done</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default DeliveryAddressForm