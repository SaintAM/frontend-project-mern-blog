import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

//Загрузка постов с сервера
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get("/posts");
  return data;
});
//Загрузка тэгов поста с сервера
export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});
//Удаление поста с сервера и клиента в Home
export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id) => await axios.delete(`/posts/${id}`)
);

const initialState = {
  posts: {
    items: [],
    status: "idle",
  },
  tags: {
    items: [],
    status: "idle",
  },
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  // СОСТОЯНИЕ асинхронного экшена описывается тут
  extraReducers: (builder) => {
    //posts
    builder.addCase(fetchPosts.pending, (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "success";
    });
    builder.addCase(fetchPosts.rejected, (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    });
    //tags
    builder.addCase(fetchTags.pending, (state) => {
      state.tags.items = [];
      state.tags.status = "loading";
    });
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "success";
    });
    builder.addCase(fetchTags.rejected, (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    });
    // remove post
    builder.addCase(fetchRemovePost.fulfilled, (state, action) => {
      state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg)
    });

  },
});

// export const {  } = postsSlice.actions;

export default postsSlice.reducer;
// export const postsReducer =  postsSlice.reducer;
