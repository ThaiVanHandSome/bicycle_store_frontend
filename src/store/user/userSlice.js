const { createSlice } = require("@reduxjs/toolkit")
const { fetchUser } = require("../actions/userAction")

const initialState = {
    info: null,
    status: 'idle',
    error: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUserInfo: (state, action) => {
            state.info = action.payload;
        },
        clearUserInfo: (state) => {
            state.info = null;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.info = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

const userReducer = userSlice.reducer;

export { fetchUser };
export const { updateUserInfo, clearUserInfo } = userSlice.actions;
export default userReducer;