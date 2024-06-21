import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUser } from "~/services/apiServices/UserService";

export const fetchUser = createAsyncThunk("user", async () => {
    if(!localStorage.getItem("accessToken")) return null;
    const res = await getUser();
    if (res.status === "success") {
        return res.data;
    } else {
        throw new Error('Failed to fetch user');
    }
})