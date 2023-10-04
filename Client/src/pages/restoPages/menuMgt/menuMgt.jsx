// import React, { useEffect, useRef, useState } from 'react'
// import { useSelector } from 'react-redux'
// import { restoLogin } from '../../../../redux/resto'
// import Cookies from 'js-cookie'
// import { useNavigate } from 'react-router-dom'
// import restoAxios from '../../../../axios/restoAxios'
// import { toast, ToastContainer } from 'react-toastify'
// import { restoApi, userApi } from '../../../../constants/server'
// import LoadingPage from '../../../loading'



// function MenuMgt() {
//     const { restoName, objId } = useSelector((state) => state.resto)
//     console.log(restoName, 'iiiiiiiiiiiiiiiiiiii')
//     const navigate = useNavigate()

//     const [dishList, setdishList] = useState([])
//     const [categoryList, setCategoryList] = useState([])
//     const [reload, setReload] = useState(false)
//     const [isLoading, setIsLoading] = useState(true)
//     const dishNameRef = useRef(null)
//     const dishCategoryRef = useRef(null)
//     const dishPriceRef = useRef(null)
//     const dishDescRef = useRef(null)
//     const dishImgRef = useRef(null)
//     useEffect(() => {
//         if (!Cookies.get('restoToken')) {
//             navigate('/resto/')
//         }
//         else {
//             restoAxios.get(`/dishes`).then((res) => {
//                 setIsLoading(false)
//                 if (res.data.dishList) {
//                     setdishList(res.data.dishList)
//                 } else {
//                     console.log('dishes fetch failed')
//                 }
//             })
//                 .catch((err) => console.log(err))
//             restoAxios.get(`/category`).then((res) => res.data.categories ? setCategoryList(res.data.categories) : console.log('category fetch failed'))
//                 .catch((err) => console.log(err))

//         }
//     }, [reload])
//     console.log(dishList, categoryList, 'ooooooooooo')
//     const [state, setState] = useState('')
//     const handleBtn = () => {
//         state === '' ? setState('addMenu') : setState('')
//     }
//     const [dishDetails, setDishDetails] = useState({
//         dishName: '',
//         dishCategory: '',
//         price: '',
//         description: ''
//     })
//     const [dishImages, setDishImages] = useState([])
//     const [errors, setErrors] = useState({})
//     const [dishEdit, setDishEdit] = useState(false)

//     const handleInput = (event) => {
//         const newObj = {
//             ...dishDetails, [event.target.name]: event.target.value
//         }
//         setDishDetails(newObj)
//     }

//     const handleImage = (event) => {
//         const selectedImages = event.target.files;
//         setDishImages(Array.from(selectedImages));

//     };


//     let flag = true
//     const validation = () => {
//         const newError = {}
//         const dishName = dishNameRef.current.value
//         const dishPrice = dishPriceRef.current.value
//         const dishCategory = dishCategoryRef.current.value
//         const dishImg = dishImgRef.current.value
//         if (dishName.trim().length === 0) {
//             newError.dishName = 'Enter the dish name'
//             flag = false
//         } else if (dishName.trim().length < 4) {
//             newError.dishName = 'Name should contain atleast 4 letters'
//             flag = false
//         }
//         if (dishCategory.trim().length === 0) {
//             newError.dishCategory = 'Choose the Category'
//             flag = false
//         }
//         if (dishPrice.trim().length === 0) {
//             newError.price = 'Price should be entered'
//             flag = false
//         }


//         return newError
//     }
//     const handleSubmit = (e) => {
//         e.preventDefault()

//         setErrors(validation())
//         if (flag) {
//             const formData = new FormData()

//             formData.append('dishPrice', dishPriceRef.current.value)
//             formData.append('dishName', dishNameRef.current.value)
//             formData.append('dishCategory', dishCategoryRef.current.value)
//             formData.append('description', dishDescRef.current.value)
//             formData.append('id', dishEdit.id)
//             dishImages.forEach((image, index) => {
//                 formData.append(`images`, image)
//             })
//             if (state === 'edit') {
//                 setIsLoading(true)
//                 restoAxios.post('/editMenu', formData).then((res) => {
//                     if (res.data.success) {
//                         toast.success('Menu updated successfully')
//                         setReload(!reload)
//                     } else {
//                         toast.error(res.data.error)
//                         console.log(res.data.error)
//                     }
//                 })
//             } else {
//                 setIsLoading(true)
//                 restoAxios.post('/addMenu', formData).then((res) => {
//                     setIsLoading(false)
//                     if (res.data.success) {
//                         toast.success('Menu added Successfully')
//                         setReload(!reload)
//                     } else {
//                         toast.error(res.data.error)
//                         console.log(res.data.error)
//                     }
//                 }).catch((err) => console.log(err))
//             }
//         }
//     }

//     const deleteMenu = (dishName) => {
//         restoAxios.get(`/deleteMenu?dishName=${dishName}`)
//             .then((res) => {
//                 if (res.data.success) {
//                     toast.success('Dish deleted')
//                     setReload(!reload)
//                 }
//                 else {
//                     toast.error(res.data.error)
//                 }
//             }).catch((err) => {
//                 toast.error('Dish failed to delete')
//                 console.log(err)
//             })
//     }

//     const editDish = (id, dishName, images, dishCategory, dishPrice, description) => {
//         setState('edit')
//         setDishEdit({ id, dishName, images, dishCategory, dishPrice, description })
//     }
//     return (
//         <div className='bg-white h-full p-10 w-full'>
//             <ToastContainer />
//             {isLoading ? <LoadingPage type={'balls'} color={'#4d88ff'} /> :
//                 <div>
//                     <h1 className='text-red-600 font-mono font-bold text-3xl text-center mb-10'>{restoName}</h1>
//                     <div className=''>
//                         {state === '' ? <button onClick={handleBtn} className='bg-gray-400 p-2 px-3 absolute right-28 text-sm'>Add Menu</button> : <button onClick={handleBtn} className='bg-gray-400 p-2 px-3 absolute right-28 text-sm w-20'>Back</button>}
//                     </div>
//                     {state === '' ? <>
//                         <div className='w-full mt-32 flex justify-center'>
//                             <table className='text-white w-full border-red  border-separate'>
//                                 <thead>
//                                     <tr className='bg-gray-600 '>
//                                         <th className='p-4'>sl.no</th>
//                                         <th className='p-4'>Dish Name</th>
//                                         <th className='p-4'>Images</th>
//                                         <th className='p-4'>Category</th>
//                                         <th className='p-4'>Price</th>
//                                         <th className='p-4'>Description</th>
//                                         <th className='p-4'>Action</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {dishList.map((dish, index) => {
//                                         return <tr className='text-center bg-gray-500 h-6' key={index}>
//                                             <td className='p-5'>{index + 1}</td>
//                                             <td>{dish.dishName}</td>
//                                             <td className='flex justify-center '><img src={dish.images[0]} alt="img" width={130} height={100} /></td>
//                                             <td>{dish.category}</td>
//                                             <td>{dish.price}</td>
//                                             <td>{dish.description}</td>
//                                             <td className=''>
//                                                 <button className='bg-yellow-600 p-2 px-5 text-xs ' onClick={() => editDish(dish._id, dish.dishName, dish.images, dish.category, dish.price, dish.description)}>Edit</button>
//                                                 <button className='bg-red-600 p-2 px-5 text-xs ' onClick={() => deleteMenu(dish.dishName)}>Delete</button>
//                                             </td>
//                                         </tr>
//                                     })}

//                                 </tbody>
//                             </table>
//                         </div>
//                     </> : <>
//                         <div className='w-full mt-25 flex justify-center'>
//                             <form onSubmit={handleSubmit} className='p-5 border-4 border-gray-600 w-96 rounded-lg' encType="multipart/form-data" >
//                                 <h2 className='text-gray-600 m-3 mb-4 flex justify-center font-mono font-bold'>{state === '' ? 'Add' : 'Edit'} Menu Here</h2>
//                                 <div className='mb-5'>
//                                     <input type="text" onChange={handleInput} ref={dishNameRef} name='dishName' placeholder='Dish Name' className='w-full h-8 rounded-full p-4 bg-slate-600 text-white' defaultValue={state === 'edit' ? dishEdit.dishName : ''} />
//                                     {errors.dishName ? <small className='text-red-600'>{errors.dishName}</small> : ''}
//                                 </div>
//                                 <div className='mb-5'>
//                                     {/* <input type="text" onChange={handleInput} name='category' placeholder='Dish category' className='w-full h-8 rounded-full p-4  bg-slate-600' /> */}
//                                     <select name="dishCategory" id="cars" onChange={handleInput} ref={dishCategoryRef} value={dishDetails.dishCategory} className='w-full h-9 rounded-full text-white bg-slate-600 px-2 '>
//                                         <option >Choose the Category</option>
//                                         {categoryList.map((category) => <option selected={category.categoryName === dishEdit.dishCategory} key={category.categoryName}>{category.categoryName}</option>)}
//                                     </select>
//                                     {errors.dishCategory ? <small className='text-red-600'>{errors.dishCategory}</small> : ''}

//                                 </div>
//                                 <div className='mb-5'>
//                                     <input type="text" onChange={handleInput} ref={dishPriceRef} name='price' placeholder='Dish Price' defaultValue={state === 'edit' ? dishEdit.dishPrice : ''} className='w-full h-8 rounded-full p-4 text-white bg-slate-600' />
//                                     {errors.price ? <small className='text-red-600'>{errors.price}</small> : ''}

//                                 </div>
//                                 <div className='mb-5'>
//                                     <input type="text" onChange={handleInput} ref={dishDescRef} name='description' defaultValue={state === 'edit' ? dishEdit.description : ''} placeholder='Description' className='w-full h-8 rounded-full p-4 text-white bg-slate-600' />
//                                     {errors.description ? <small className='text-red-600'>{errors.description}</small> : ''}

//                                 </div>
//                                 <div className='mb-5'>

//                                     <input type="file" onChange={handleImage} ref={dishImgRef} name='images' id='image' placeholder='Upload Images' multiple />
//                                     {errors.images ? <small className='text-red-600'>{errors.images}</small> : ''}
//                                     <div className='w-5 h-5'>
//                                         {dishImages ? dishImages.map((image, index) => {
//                                             <img src={image} alt={index} className='w-5 h-5' />
//                                         }) : ''}
//                                     </div>
//                                 </div>


//                                 <div className='flex justify-center mt-10 mb-5 h-8 bg-black rounded-lg'>
//                                     <button type='submit' value="Add Dish" className='text-white'>{state === '' ? 'Add Dish' : 'Edit Dish'}</button>
//                                 </div>
//                             </form>
//                         </div>
//                     </>}

//                 </div>}
//         </div>
//     )
// }

// export default MenuMgt

import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import restoAxios from '../../../../axios/restoAxios';
import { restoApi } from '../../../../constants/server';
import LoadingPage from '../../../loading';

function MenuMgt() {
    const { restoName } = useSelector((state) => state.resto);
    const navigate = useNavigate();

    const [dishList, setDishList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [reload, setReload] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dishImages, setDishImages] = useState([]);

    const dishNameRef = useRef(null);
    const dishCategoryRef = useRef(null);
    const dishPriceRef = useRef(null);
    const dishDescRef = useRef(null);
    const dishImgRef = useRef(null);

    useEffect(() => {
        if (!Cookies.get('restoToken')) {
            navigate('/resto/');
        } else {
            async function fetchData() {
                try {
                    const [dishRes, categoryRes] = await Promise.all([
                        restoAxios.get(`/dishes`),
                        restoAxios.get(`/category`),
                    ]);

                    setIsLoading(false);

                    if (dishRes.data.dishList) {
                        setDishList(dishRes.data.dishList);
                    } else {
                        console.log('Dishes fetch failed');
                    }

                    if (categoryRes.data.categories) {
                        setCategoryList(categoryRes.data.categories);
                    } else {
                        console.log('Category fetch failed');
                    }
                } catch (err) {
                    console.error(err);
                }
            }

            fetchData();
        }
    }, [reload]);

    const [state, setState] = useState('');
    const handleBtn = () => {
        setState(state === '' ? 'addMenu' : '');
        setDishDetails({
            dishName: '',
            dishCategory: '',
            price: '',
            description: '',
        })
        setDishImages([])
    };

    const [dishDetails, setDishDetails] = useState({
        dishName: '',
        dishCategory: '',
        price: '',
        description: '',
    });

    const [errors, setErrors] = useState({});
    const [dishEdit, setDishEdit] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dishList.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleInput = (event) => {
        const newObj = { ...dishDetails, [event.target.name]: event.target.value };
        setDishDetails(newObj);
    };

    const handleImage = (event) => {
        const selectedImages = event.target.files;
        setDishImages(Array.from(selectedImages));

    };

    const validation = () => {
        const newError = {};
        const dishName = dishNameRef.current.value;
        const dishPrice = dishPriceRef.current.value;
        const dishCategory = dishCategoryRef.current.value;

        if (dishName.trim().length === 0) {
            newError.dishName = 'Enter the dish name';
        } else if (dishName.trim().length < 4) {
            newError.dishName = 'Name should contain at least 4 letters';
        }

        if (dishCategory.trim().length === 0) {
            newError.dishCategory = 'Choose the Category';
        }

        if (dishPrice.trim().length === 0) {
            newError.price = 'Price should be entered';
        }

        return newError;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(validation());

        if (Object.keys(errors).length === 0) {
            const formData = new FormData();

            formData.append('dishPrice', dishPriceRef.current.value);
            formData.append('dishName', dishNameRef.current.value);
            formData.append('dishCategory', dishCategoryRef.current.value);
            formData.append('description', dishDescRef.current.value);
            formData.append('id', dishEdit.id);

            dishImages.forEach((image, index) => {
                formData.append(`images`, image);
            });

            try {
                setIsLoading(true);

                const endpoint = state === 'edit' ? '/editMenu' : '/addMenu';
                const res = await restoAxios.post(endpoint, formData);

                if (res.data.success) {
                    toast.success(state === 'edit' ? 'Menu updated successfully' : 'Menu added successfully');
                    setReload(!reload);
                    setState('')
                    setDishEdit(false)
                    setDishImages([])
                } else {
                    toast.error(res.data.error);
                    console.log(res.data.error);
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const deleteMenu = (dishName) => {
        restoAxios
            .get(`/deleteMenu?dishName=${dishName}`)
            .then((res) => {
                if (res.data.success) {
                    toast.success('Dish deleted');
                    setReload(!reload);
                } else {
                    toast.error(res.data.error);
                }
            })
            .catch((err) => {
                toast.error('Dish failed to delete');
                console.log(err);
            });
    };

    const editDish = (id, dishName, images, dishCategory, dishPrice, description) => {
        setState('edit');
        setDishEdit({ id, dishName, images, dishCategory, dishPrice, description });
    };

    return (
        <div className='bg-white h-full p-10 w-full'>
            <ToastContainer />

            {isLoading ? (
                <LoadingPage type='balls' color='#4d88ff' />
            ) : (
                <div>
                    <h1 className='text-red-600 font-mono font-bold text-3xl text-center mb-10'>{restoName}</h1>
                    <div className=''>
                        {state === '' ? (
                            <button onClick={handleBtn} className='bg-gray-400 p-2 px-3 absolute right-28 text-sm'>
                                Add Menu
                            </button>
                        ) : (
                            <button onClick={handleBtn} className='bg-gray-400 p-2 px-3 absolute right-28 text-sm w-20'>
                                Back
                            </button>
                        )}
                    </div>
                    {state === '' ? (
                        <>
                            <div className='w-full mt-32 flex-col justify-center'>
                                <table className='text-white w-full border-red border-separate'>
                                    <thead>
                                        <tr className='bg-gray-600 '>
                                            <th className='p-4'>sl.no</th>
                                            <th className='p-4'>Dish Name</th>
                                            <th className='p-4'>Images</th>
                                            <th className='p-4'>Category</th>
                                            <th className='p-4'>Price</th>
                                            <th className='p-4'>Description</th>
                                            <th className='p-4'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((dish, index) => (
                                            <tr className='text-center bg-gray-500 h-6' key={index}>
                                                <td className='p-5'>{indexOfFirstItem + index + 1}</td>
                                                <td>{dish.dishName}</td>
                                                <td className='flex justify-center '>
                                                    <img src={dish.images[0]} alt='img' width={130} height={100} />
                                                </td>
                                                <td>{dish.category}</td>
                                                <td>{dish.price}</td>
                                                <td>{dish.description}</td>
                                                <td className=''>
                                                    <button
                                                        className='bg-yellow-600 p-2 px-5 text-xs '
                                                        onClick={() =>
                                                            editDish(
                                                                dish._id,
                                                                dish.dishName,
                                                                dish.images,
                                                                dish.category,
                                                                dish.price,
                                                                dish.description
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className='bg-red-600 p-2 px-5 text-xs '
                                                        onClick={() => deleteMenu(dish.dishName)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>

                                        ))}
                                    </tbody>
                                </table>
                                <div className='flex justify-center mt-4'>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className='mr-2'
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={indexOfLastItem >= dishList.length}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='w-full mt-25 flex justify-center'>
                                <form onSubmit={handleSubmit} className='p-5 border-4 border-gray-600 w-96 rounded-lg' encType='multipart/form-data'>
                                    <h2 className='text-gray-600 m-3 mb-4 flex justify-center font-mono font-bold'>
                                        {state === '' ? 'Add' : 'Edit'} Menu Here
                                    </h2>
                                    <div className='mb-5'>
                                        <input
                                            type='text'
                                            onChange={handleInput}
                                            ref={dishNameRef}
                                            name='dishName'
                                            placeholder='Dish Name'
                                            className='w-full h-8 rounded-full p-4 bg-slate-600 text-white'
                                            defaultValue={state === 'edit' ? dishEdit.dishName : ''}
                                        />
                                        {errors.dishName ? <small className='text-red-600'>{errors.dishName}</small> : ''}
                                    </div>
                                    <div className='mb-5'>
                                        <select
                                            name='dishCategory'
                                            id='cars'
                                            onChange={handleInput}
                                            ref={dishCategoryRef}
                                            value={dishEdit.dishCategory ? dishEdit.dishCategory : dishDetails.dishCategory}
                                            className='w-full h-9 rounded-full text-white bg-slate-600 px-2 '
                                        >
                                            <option>Choose the Category</option>
                                            {categoryList.map((category) => (
                                                <option
                                                    key={category.categoryName}
                                                    value={category.categoryName}

                                                >
                                                    {category.categoryName}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.dishCategory ? <small className='text-red-600'>{errors.dishCategory}</small> : ''}
                                    </div>
                                    <div className='mb-5'>
                                        <input
                                            type='text'
                                            onChange={handleInput}
                                            ref={dishPriceRef}
                                            name='price'
                                            placeholder='Dish Price'
                                            defaultValue={state === 'edit' ? dishEdit?.dishPrice : ''}
                                            className='w-full h-8 rounded-full p-4 text-white bg-slate-600'
                                        />
                                        {errors.price ? <small className='text-red-600'>{errors.price}</small> : ''}
                                    </div>
                                    <div className='mb-5'>
                                        <input
                                            type='text'
                                            onChange={handleInput}
                                            ref={dishDescRef}
                                            name='description'
                                            defaultValue={state === 'edit' ? dishEdit?.description : ''}
                                            placeholder='Description'
                                            className='w-full h-8 rounded-full p-4 text-white bg-slate-600'
                                        />
                                        {errors.description ? <small className='text-red-600'>{errors.description}</small> : ''}
                                    </div>
                                    <div className='mb-5'>
                                        <input
                                            type='file'
                                            onChange={handleImage}
                                            ref={dishImgRef}
                                            name='images'
                                            id='image'
                                            placeholder='Upload Images'
                                            multiple
                                            accept='image/*' // Add this to allow only image types
                                        />
                                        {errors.images ? <small className='text-red-600'>{errors.images}</small> : ''}
                                        <div className='w-full h-full'>
                                            {dishImages.length > 0 &&
                                                dishImages.map((image, index) => (
                                                    <img key={index} src={URL.createObjectURL(image)} alt={index} className='w-20 h-16' /> // Use URL.createObjectURL to display selected images
                                                ))}
                                        </div>



                                    </div>

                                    <div className='flex justify-center mt-10 mb-5 h-8 bg-black rounded-lg'>
                                        <button type='submit' value='Add Dish' className='text-white'>
                                            {state === '' ? 'Add Dish' : 'Edit Dish'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default MenuMgt;
