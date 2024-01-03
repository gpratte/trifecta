import {useState} from "react";
import {NotificationData} from "../model/NotificationDataBuilder";

function useNotifications(delay = 2500) {
  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationData | undefined>(undefined);
  const [notifications, setNotifications] = useState<Array<NotificationData>>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const newNotification = (notify: NotificationData) : void => {
    const newNotifications = [...notifications];
    newNotifications.push(notify);
    setNotifications(newNotifications)
    if (!showNotifications) {
      setNotification(notify);
      // Auto close after x seconds
    }
    window.scrollTo(0,0);
  }

  const deleteNotification = (id: number): void => {
    const notificationToDelete = notifications.map((notification) => notification.id === id);
    if (notificationToDelete) {
      const newNotifications = notifications.filter(notification => notification.id !== id)
      setNotification(undefined);
      setNotifications(newNotifications);
    }
  }

  const closeNotification = (id: number): void => {
    const notificationToClose = notifications.map((notification) => notification.id === id);
    if (notificationToClose) {
      setNotification(undefined);
    }
  }

  const deleteAllNotifications = (): void => {
    setNotification(undefined);
    setNotifications([]);
  }

  const showNotificationsPanel = (): void => {
    setNotification(undefined);
    setShowNotifications(true);
  }
  const hideNotificationsPanel = (): void => {
    setShowNotifications(false);
  }

  const toggleLoadingGlobal = (show: boolean): void => {
    setIsGlobalLoading(show);
  }

  return {
    newNotification,
    notification,
    notifications,
    showNotifications,
    closeNotification,
    deleteNotification,
    deleteAllNotifications,
    showNotificationsPanel,
    hideNotificationsPanel,
    isGlobalLoading,
    toggleLoadingGlobal
  };
}

export default useNotifications;