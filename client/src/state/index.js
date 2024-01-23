import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const { post } = action.payload;

      const updatedPosts = state.posts.map((existingPost) => {
        if (existingPost._id === post._id) {
          // Mettre à jour tous les champs du post, y compris les commentaires
          return post;
        }
        return existingPost;
      });

      state.posts = updatedPosts;
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter(
        (post) => post._id !== action.payload.postId
      );
    },
    setComments: (state, action) => {
      const { postId, comments } = action.payload;

      const updatedPosts = state.posts.map((post) => {
        if (post._id === postId) {
          // Mettre à jour les commentaires du post
          post.comments = comments;
        }
        return post;
      });

      state.posts = updatedPosts;
    },

    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const updatedPosts = state.posts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...post.comments, comment],
          };
        }
        return post;
      });
      state.posts = updatedPosts;
    },
    removeComment: (state, action) => {
      const { postId, commentId } = action.payload;
      const updatedPosts = state.posts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            comments: post.comments.filter(
              (comment) => comment._id !== commentId
            ),
          };
        }
        return post;
      });
      state.posts = updatedPosts;
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  removePost,
  setComments,
  addComment,
  removeComment,
} = authSlice.actions;

export default authSlice.reducer;
