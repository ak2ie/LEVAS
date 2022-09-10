import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuth } from "firebase/auth";
import * as firebase from "firebase/app";

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
      console.log(user);
      if (user) {
        const token = await user.getIdToken();
        console.log("トークン取得成功");
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
        url: "/setting/",
        method: "POST",
        body: {
          channelID: "id",
          channelSecret: "secret",
        },
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

// useXXXXの名前は、"use" + method名 + エンドポイント名
export const { useGetPostsQuery, useAddNewPostMutation } = apiSlice;
