"use client";

import { useEffect } from "react";

/**
 * @description 注册 Service Worker 以支持 PWA 离线功能
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* SW registration failed silently */
      });
    }
  }, []);

  return null;
}
