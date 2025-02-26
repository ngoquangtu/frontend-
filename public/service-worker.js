self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "open_url") {
    clients.openWindow("http://localhost:3006/reactbp"); // Thay bằng URL của bạn
  }
});

self.addEventListener('push', (event) => {
  const data = event.data?.json();
  if (data) {
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || "/logo.png", // Đường dẫn đến icon
      actions: [
        { action: "open_url", title: "Open URL", icon: "/logo.png" }, // Icon cho nút
        { action: "dismiss", title: "Dismiss", icon: "/logo.png" }, // Icon cho nút
      ],
      badge: "/logo.png", // Đường dẫn badge icon (tùy chọn)
    });

    // Gửi tin nhắn đến trang web chính để phát âm thanh
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({ action: 'play_sound' });
      });
    });
    
  }
});

