import React from 'react';
import ReactLoading from 'react-loading';

const LoadingPage = ({ type, color }) => (
    <div className='flex justify-center items-center h-96'>
        <ReactLoading type={type} color={color} height={50} width={50} />

    </div>
);

export default LoadingPage;