import { configureStore } from '@reduxjs/toolkit'
import { signinSlice } from './signinSlice'

export const store = configureStore({
  reducer: {
    signin: signinSlice.reducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
type AppDispatch = typeof store.dispatch

export type { RootState, AppDispatch }