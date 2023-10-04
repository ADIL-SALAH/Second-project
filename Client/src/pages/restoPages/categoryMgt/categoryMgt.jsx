import Cookies from 'js-cookie'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import restoAxios from '../../../../axios/restoAxios'
import { ToastContainer, toast } from 'react-toastify'

function CategoryMgt() {

    const categoryNameRef = useRef(null)
    const categoryDescRef = useRef(null)

    const { restoName, objId } = useSelector((state) => state.resto)
    const [categoryList, setCategoryList] = useState([])
    const [reload, setReload] = useState(true)
    const [dishList, setdishList] = useState([])

    useEffect(() => {
        if (!Cookies.get('restoToken')) {
            navigate('/resto')
        } else {
            restoAxios.get(`/category?objId=${objId}`).then((res) => res.data.categories ? setCategoryList(res.data.categories) : console.log('dishes fetch failed'))
                .catch((err) => console.log(err))

            restoAxios.get(`/dishes`).then((res) => {
                if (res.data.dishList) {
                    setdishList(res.data.dishList)
                } else {
                    console.log('dishes fetch failed')
                }
            })
                .catch((err) => console.log(err))
        }
    }, [reload])

    const navigate = useNavigate()
    const [state, setState] = useState('')
    const [editCategory, setEditCategory] = useState(false)

    const handleBtn = () => {
        state === '' ? setState('addCategory') : setState('')
    }
    const [categoryDetails, setCategoryDetails] = useState({
        categoryName: '',
        description: ''
    })
    const [errors, setErrors] = useState({})

    let flag = true
    const validation = () => {
        const newError = {}
        const categoryName = categoryNameRef.current.value.trim()
        const categoryDesc = categoryDescRef.current.value.trim()
        if (categoryName.length === 0) {

            newError.categoryName = 'Enter the category name'
            flag = false
        } else if (categoryName.length < 3) {
            newError.categoryName = 'Name should contain atleast 3 letters'
            flag = false
        }
        return newError
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors(validation())
        if (flag) {
            const data = { categoryName: categoryNameRef.current.value, description: categoryDescRef.current.value, objId: objId }
            if (state != 'edit') {
                restoAxios.post('/addCategory', data)
                    .then((res) => {
                        if (res.data.success) {
                            setReload(!reload)
                            toast.success('Category added successfully')
                        } else {
                            toast.error(res.data.error)
                        }
                    }
                    )
            } else {
                const data = { categoryName: categoryNameRef.current.value, description: categoryDescRef.current.value, id: editCategory.id }
                restoAxios.post('/editCategory', data)
                    .then((res) => {
                        if (res.data.success) {
                            setReload(!reload)
                            toast.success('Category edited successfully')
                        } else {
                            toast.error(res.data.error)
                        }
                    }
                    )
            }
        }
    }

    const deleteCategory = (categoryName) => {
        restoAxios.get(`/deleteCategory?categoryName=${categoryName}`)
            .then((res) => {
                if (res.data.success) {
                    toast.success('Category deleted')
                    setReload(!reload)
                } else {
                    toast.error(res.data.error)
                }
            }).catch((err) => {
                toast.error('Category deletion failed')
                console.log(err)
            })
    }

    const categoryEdit = (categoryName, description, id) => {
        setState('edit')
        setEditCategory({ categoryName: categoryName, description: description, id })
    }

    return (
        <div>
            <ToastContainer />
            <div className='bg-white h-full p-10 w-full'>
                <h1 className='text-red-600 font-mono font-bold text-3xl text-center mb-10'>{restoName}</h1>
                <div className=''>
                    {state === '' ? <button onClick={handleBtn} className='bg-gray-400 p-2 px-3 absolute right-28 text-sm'>Add Category</button> : <button onClick={handleBtn} className='bg-gray-400 p-2 px-3 absolute right-28 text-sm w-20'>Back</button>}
                </div>
                <div className='w-full mt-32 flex justify-center'>
                    {state === '' ? <>
                        <table className='text-white w-full border-red  border-separate'>
                            <thead>
                                <tr className='bg-gray-600'>
                                    <th className='p-4'>sl.no</th>
                                    <th className='p-4'>category Name</th>
                                    <th className='p-4'>Description</th>
                                    <th className='p-4'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoryList.map((category, index) => {
                                    const hasDishes = dishList.some(dish => dish.category === category.categoryName);

                                    return (
                                        <tr className='text-center bg-gray-500 text-white' key={index}>
                                            <td className='p-5'>{index + 1}</td>
                                            <td>{category.categoryName}</td>
                                            <td>{category.description}</td>
                                            <td className=''>
                                                <button className='bg-yellow-600 p-2 px-5 text-xs' onClick={() => categoryEdit(category.categoryName, category.description, category._id)}>Edit</button>
                                                {hasDishes ? (
                                                    null
                                                ) : (
                                                    <button className='bg-red-600 p-2 px-5 text-xs' onClick={() => deleteCategory(category.categoryName)}>Delete</button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}


                            </tbody>
                        </table>

                    </> : <>
                        <form onSubmit={handleSubmit} className='p-5 border-4 border-gray-600 w-96 rounded-lg  top-24'>
                            <h2 className='text-gray-600 m-3 mb-4 flex justify-center font-mono font-bold'>{state === 'edit' ? 'Edit Category' : 'Add Category Here'}</h2>
                            <div className='mb-5'>
                                <input type="text" ref={categoryNameRef} name='categoryName' placeholder='Category Name' defaultValue={state === 'edit' ? editCategory.categoryName : ''} className='w-full h-8 rounded-full p-4 text-white bg-slate-600' />
                                {errors.categoryName ? <small className='text-red-600'>{errors.categoryName}</small> : ''}
                            </div>
                            <div className='mb-5'>
                                <input type="text" ref={categoryDescRef} name='description' placeholder='Description' defaultValue={state === 'edit' ? editCategory.description : ''} className='w-full h-8 rounded-full p-4 text-white bg-slate-600' />
                                {errors.description ? <small className='text-red-600'>{errors.description}</small> : ''}
                            </div>
                            <div className='flex justify-center mt-10 mb-5 h-8 bg-black rounded-lg'>
                                <button type='submit' value="Add Dish" className='text-white'>{state === 'edit' ? 'Save Changes' : 'Add Category'}</button>
                            </div>
                        </form>
                    </>}


                </div>
            </div>
        </div>
    )
}

export default CategoryMgt