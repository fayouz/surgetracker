// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import apiConfig from 'src/configs/api'
interface DataParams {
  roles: string
  status: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Users
export const fetchData = createAsyncThunk('appUsers/fetchData', async (params: DataParams) => {


  const response = await axios.get(apiConfig.endpoint + '/users', {
    params,
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
  })

  return response.data
})

// ** Add User
export const addUser = createAsyncThunk(
  'appUsers/addUser',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    const response = await axios.post(apiConfig.endpoint + '/users', {
      data
    })
    dispatch(fetchData(getState().user.params))

    return response.data
  }
)

// ** Delete User
export const deleteUser = createAsyncThunk(
  'appUsers/deleteUser',
  async (id: number | string, { getState, dispatch }: Redux) => {
    const response = await axios.delete('/users/delete', {
      data: id
    })
    dispatch(fetchData(getState().user.params))

    return response.data
  }
)

export const appUsersSlice = createSlice({
  name: 'appUsers',
  initialState: {
    data: [],
    total: 1,
    params: {},
    allData: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {

      state.data = action.payload
      state.total = action.payload.length
      state.params = action.payload.params
      state.allData = action.payload.allData
    })
  }
})

export default appUsersSlice.reducer
