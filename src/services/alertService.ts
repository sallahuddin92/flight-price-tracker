import axiosInstance from './axios';

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

export const createPriceAlert = async (alert: Omit<PriceAlert, 'id' | 'userId' | 'isTriggered' | 'createdAt' | 'updatedAt'>): Promise<PriceAlert> => {
  const response = await axiosInstance.post<PriceAlert>('/alerts', alert);
  return response.data;
};

export const getPriceAlerts = async (): Promise<PriceAlert[]> => {
  const response = await axiosInstance.get<PriceAlert[]>('/alerts');
  return response.data;
};

export const updatePriceAlert = async (alertId: string, alert: Partial<PriceAlert>): Promise<PriceAlert> => {
  const response = await axiosInstance.put<PriceAlert>(`/alerts/${alertId}`, alert);
  return response.data;
};

export const deletePriceAlert = async (alertId: string): Promise<void> => {
  await axiosInstance.delete(`/alerts/${alertId}`);
};

export const getTriggeredAlerts = async (): Promise<PriceAlert[]> => {
  const response = await axiosInstance.get<PriceAlert[]>('/alerts/triggered');
  return response.data;
}; 