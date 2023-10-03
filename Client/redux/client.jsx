import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: null,
    phone: null,
    image: null,
    state: null,
    objId: null,
    restoId: null,
    cart: [{ userId: '', item: '', qnty: '' }]
}

const authSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {
        clientLogin: (state, action) => {
            state.name = action.payload.name
            state.phone = action.payload.phone
            state.image = action.payload.image
            state.objId = action.payload.objId
        },
        updateReduxCart: (state, action) => {
            state.cart = action.payload.cart
        },
        updateClientState: (state, action) => {
            state.state = action.payload.state
        },
        updateClientPhoto: (state, action) => {
            state.image = action.payload.image
        },
        updateClientRestoId: (state, action) => {
            state.restoId = action.payload.restoId
        },
        clientLogout: (state, action) => {
            return initialState
        }
    },
})

export const { clientLogin, updateReduxCart, clientLogout, updateClientState, updateClientPhoto, updateClientRestoId } = authSlice.actions
export default authSlice.reducer