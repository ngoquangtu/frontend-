const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");
      } else {
        console.error("Notification permission denied.");
      }
    } else {
      console.error("Browser does not support notifications.");
    }
  };
export default requestNotificationPermission;