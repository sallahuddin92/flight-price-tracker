import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface PriceAlert {
  id: string;
  flightId: string;
  userId: string;
  targetPrice: number;
  currency: string;
  currentPrice: number;
  isTriggered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'PRICE_ALERT' | 'BOOKING_CONFIRMATION' | 'PRICE_DROP' | 'GENERAL';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const createPriceAlert = async (alert: Omit<PriceAlert, 'id' | 'userId' | 'isTriggered' | 'createdAt' | 'updatedAt'>): Promise<PriceAlert> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/price-alerts`, alert, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating price alert:', error);
    throw error;
  }
};

export const getPriceAlerts = async (): Promise<PriceAlert[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/price-alerts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching price alerts:', error);
    throw error;
  }
};

export const deletePriceAlert = async (alertId: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/price-alerts/${alertId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  } catch (error) {
    console.error('Error deleting price alert:', error);
    throw error;
  }
};

export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await axios.put(
      `${API_BASE_URL}/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await axios.put(
      `${API_BASE_URL}/notifications/read-all`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

export const subscribeToPushNotifications = async (subscription: PushSubscription): Promise<void> => {
  try {
    await axios.post(
      `${API_BASE_URL}/notifications/push/subscribe`,
      { subscription },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw error;
  }
};

export const unsubscribeFromPushNotifications = async (subscription: PushSubscription): Promise<void> => {
  try {
    await axios.post(
      `${API_BASE_URL}/notifications/push/unsubscribe`,
      { subscription },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    throw error;
  }
}; 