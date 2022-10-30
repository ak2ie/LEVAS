import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuth } from "firebase/auth";
import { EventList } from "../Events";
import { EventResponse } from "features/Event";
import { EventRequest } from "features/EventRequest";
import { ReponseFriend } from "features/FriendsResponse";
import { RequestFriend } from "features/RequestFriend";
import { RequestSetting } from "features/RequestSettings";
import { ResponseChannelSettings } from "features/ResponseChannelSettings";

type Post = {
  title: string;
};

export const apiSlice = createApi({
  reducerPath: "api", // 書かなくてもいい
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers, { getState }) => {
      // Firebase API認証
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Post", "Events", "Friends"],
  endpoints: (builder) => ({
    // イベント一覧取得
    getEvents: builder.query<EventList, void>({
      query: () => {
        return {
          url: "/events",
          // ------- デバッグ用 -------------------------------
          headers:
            process.env.NODE_ENV === "development"
              ? {
                  Prefer: "example=multi",
                }
              : {},
          // ------------------------------------------------
        };
      },
    }),
    // 個別イベント取得
    getEvent: builder.query<EventResponse, string>({
      query: (eventId) => {
        return {
          url: `/events/${eventId}`,
          // ------- デバッグ用 -------------------------------
          headers:
            process.env.NODE_ENV === "development"
              ? {
                  Prefer:
                    eventId === "eventId1"
                      ? "example=answer"
                      : "example=noAnswer",
                }
              : {},
          // ------------------------------------------------
        };
      },
      providesTags: ["Events"],
    }),
    // イベント作成
    addEvent: builder.mutation<void, EventRequest>({
      query: (newEvent) => ({
        url: "/events",
        method: "POST",
        body: newEvent,
        // ------- デバッグ用 -------------------------------
        headers:
          process.env.NODE_ENV === "development"
            ? {
                Prefer: "code=429",
              }
            : {},
        // ------------------------------------------------
      }),
      invalidatesTags: ["Events"],
    }),
    // 友だち一覧取得
    getFriends: builder.query<ReponseFriend, void>({
      query: () => ({
        url: "/settings/friends",
        // ------- デバッグ用 -------------------------------
        headers:
          process.env.NODE_ENV === "development"
            ? {
                Prefer: "example=friends",
              }
            : {},
        // ------------------------------------------------
      }),
      providesTags: ["Friends"],
    }),
    // 友だち情報更新
    updateFriend: builder.mutation<void, RequestFriend>({
      query: (friend) => ({
        url: "/settings/friends",
        method: "POST",
        body: friend,
        // ------- デバッグ用 -------------------------------
        headers:
          process.env.NODE_ENV === "development"
            ? {
                Prefer: "code=500",
              }
            : {},
        // ------------------------------------------------
      }),
      invalidatesTags: ["Friends"],
    }),
    // チャネルID・トークン保存
    updateChannelSettings: builder.mutation<void, RequestSetting>({
      query: (settings) => ({
        url: "/settings/token",
        method: "POST",
        body: settings,
        // ------- デバッグ用 -------------------------------
        headers:
          process.env.NODE_ENV === "development"
            ? {
                Prefer: "code=400",
              }
            : {},
      }),
    }),
    // チャネルID・トークン保存有無取得
    getChannelSettings: builder.query<{ result: boolean }, void>({
      query: () => ({
        url: "/settings/token",
        // ------- デバッグ用 -------------------------------
        headers:
          process.env.NODE_ENV === "development"
            ? {
                Prefer: "example=saved",
              }
            : {},
        // ------------------------------------------------
      }),
    }),
  }),
});

// useXXXXの名前は、"use" + method名 + エンドポイント名
export const {
  /**
   * イベント一覧取得
   */
  useGetEventsQuery,
  /**
   * 個別イベント取得
   */
  useGetEventQuery,
  /**
   * イベント作成
   */
  useAddEventMutation,
  useGetFriendsQuery,
  useUpdateFriendMutation,
  useUpdateChannelSettingsMutation,
  useGetChannelSettingsQuery,
} = apiSlice;
