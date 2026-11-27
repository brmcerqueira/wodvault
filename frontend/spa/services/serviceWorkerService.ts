import { myId } from "./preferencesService.ts";

export async function startRegistration() {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register(
        "serviceWorker.min.js",
      );
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  }
}

function urlBase64ToUint8Array(
  base64String: string,
): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);

  return Uint8Array.from(
    rawData,
    (char) => char.charCodeAt(0),
  );
}

export async function allowPushNotification() {
  const registration = await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    console.info("A Push subscription already exists");
  } else {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.info("Notification permission not granted");
      return;
    }

    const response = await fetch("/api/vapid/key", {
      method: "GET",
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });

    if (!response.ok) {
      console.info("Failed to retrieve the VAPID public key");
      return;
    }

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(await response.text()),
    });
  }

  await fetch(`/api/events/${myId}/web/push/subscription`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  });
}
