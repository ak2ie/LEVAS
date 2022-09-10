import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuth } from "firebase/auth";

type Post = {
  title: string;
};

export const apiSlice = createApi({
  reducerPath: "api", // 書かなくてもいい
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers, { getState }) => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPosts: builder.query<Post, string>({
      query: (id) => `/setting/`,
      //   query: () => "/hello/",
      providesTags: ["Post"],
    }),
    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: "/setting/1",
        method: "GET",
        // body: initialPost,
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

// useXXXXの名前は、"use" + method名 + エンドポイント名
export const { useGetPostsQuery, useAddNewPostMutation } = apiSlice;
