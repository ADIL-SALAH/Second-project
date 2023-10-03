import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    restoName: null,
    phone: null,
    logo: null,
    objId: null,
    state: null
}

const authSlice = createSlice({
    name: 'resto',
    initialState,
    reducers: {
        restoLogin: (state, action) => {
            state.restoName = action.payload.restoName
            state.phone = action.payload.phone
            state.logo = action.payload.logo
            state.objId = action.payload.objId
        },
        updateState: (state, action) => {
            state.state = action.payload.state
        },
        restoLogout: (state, acton) => {
            state.restoName = null
            state.phone = null
            state.logo = null
        }
    }
})

export const { restoLogin, restoLogout, updateState } = authSlice.actions
export default authSlice.reducer