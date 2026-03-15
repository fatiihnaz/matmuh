"use client";

import { useContext } from "react";
import {
  ContentStateContext,
  ContentDispatchContext,
} from "@/lib/context/ContentContext";

export function useContentState() {
  const state = useContext(ContentStateContext);
  if (state === null) {
    throw new Error("useContentState must be used within ContentProvider");
  }
  return state;
}

export function useContentDispatch() {
  const dispatch = useContext(ContentDispatchContext);
  if (dispatch === null) {
    throw new Error("useContentDispatch must be used within ContentProvider");
  }
  return dispatch;
}