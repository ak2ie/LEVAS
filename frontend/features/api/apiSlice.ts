import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type Post = {
  title: string;
};

export const apiSlice = createApi({
  reducerPath: "api", // 書かなくてもいい
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPosts: builder.query<Post, string>({
      query: (id) => `/posts/${id}`,
      //   query: () => "/hello/",
      providesTags: ["Post"],
    }),
    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: "/posts/3",
        method: "POST",
        body: initialPost,
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

// useXXXXの名前は、"use" + method名 + エンドポイント名
export const { useGetPostsQuery, useAddNewPostMutation } = apiSlice;
