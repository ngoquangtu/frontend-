import React from "react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/auth";


export const showNotification = (fullname:any) => {
  if (Notification.permission === "granted") {
    new Notification(`Xin chào ${fullname}! Bạn được giao tác vụ mới tại MangoAGS.`);
    // const audio = new Audio('../notification-18-270129.mp3');
    // audio.play();
  } else {
    console.error("Notifications are not permitted.");
  }
};
export const showNotificationAssigner = (fullname:any) => {
  if (Notification.permission === "granted") {
    new Notification(`Xin chào ${fullname}! Bạn nhận được kết quả của một nhiệm vụ tại MangoAGS.`);
    // const audio = new Audio('../notification-18-270129.mp3');
    // audio.play();
  } else {
    console.error("Notifications are not permitted.");
  }
};
export const  NotificationApp=()=> {
  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
  };
  

  return (
    <div>
      <button onClick={requestNotificationPermission}>
        Enable Notifications
      </button>
    </div>
  );
}
