import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

// Запрос авторизации, в params - login and password
export const fetchAuth = createAsyncThunk(
  "auth/fetchAuth",
  async (params) => {
    const { data } = await axios.post("/auth/login", params);
    return data;
  }
);
// Запрос регистрации
export const fetchRegister = createAsyncThunk(
  "auth/fetchRegister",
  async (params) => {
    const { data } = await axios.post("/auth/register", params);
    return data;
  }
);

// params не нужен, мы вшили в axios уже токен
export const fetchAuthMe = createAsyncThunk(
  "auth/fetchAuthMe",
  async () => {
    const { data } = await axios.get("/auth/me");
    return data;
  }
);

const initialState = {
  data: null,
  status: "idle",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
		//выход из аккаунта
		logaut: (state) => {
			state.data = null
		}
	},
  // СОСТОЯНИЕ асинхронного экшена описывается тут
  extraReducers: (builder) => {
    builder.addCase(fetchAuth.pending, (state) => {
      state.data = null;
      state.status = "loading";
    });
    builder.addCase(fetchAuth.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = "success";
    });
    builder.addCase(fetchAuth.rejected, (state) => {
      state.data = null;
      state.status = "error";
    });
		//AuthMe
		builder.addCase(fetchAuthMe.pending, (state) => {
      state.data = null;
      state.status = "loading";
    });
    builder.addCase(fetchAuthMe.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = "success";
    });
    builder.addCase(fetchAuthMe.rejected, (state) => {
      state.data = null;
      state.status = "error";
    });
		//register
		builder.addCase(fetchRegister.pending, (state) => {
      state.data = null;
      state.status = "loading";
    });
    builder.addCase(fetchRegister.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = "success";
    });
    builder.addCase(fetchRegister.rejected, (state) => {
      state.data = null;
      state.status = "error";
    });

  },
});

export const selectIsAuth = state => Boolean(state.auth.data)

export const { logaut } = authSlice.actions; 

export default authSlice.reducer;
// export const postsReducer =  postsSlice.reducer;
