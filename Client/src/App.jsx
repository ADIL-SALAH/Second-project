import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import UserRoutes from './Routes/userRoutes'
import RestoRoutes from './Routes/restoRoutes'
import AdminRoutes from './Routes/adminRoutes'
import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:3000');


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<UserRoutes />} />
        <Route path='/resto/*' element={<RestoRoutes />} />
        <Route path='/admin/*' element={<AdminRoutes />} />
      </Routes>
    </BrowserRouter >
  )
}

export default App
