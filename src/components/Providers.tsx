"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { setCredentials } from "@/store/slices/authSlice";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Restore auth from localStorage on mount
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (token && email) {
      store.dispatch(setCredentials({ token, email }));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
