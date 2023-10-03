import { configureStore } from '@reduxjs/toolkit'
import clientReducer from './client'
import restoReducer from './resto'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'

const persistConfig = {
    key: 'client',
    storage
}

const persistRestoConfig = {
    key: 'resto',
    storage
}

const persistClientReducer = persistReducer(persistConfig, clientReducer)
const persistRestoReducer = persistReducer(persistRestoConfig, restoReducer)

export const store = configureStore({
    reducer: {
        client: persistClientReducer,
        resto: persistRestoReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
})
