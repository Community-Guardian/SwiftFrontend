"use client"

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import paymentsManager from '../handler/PaymentsManager';
import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';
interface ServiceType {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

interface Service {
  id: number;
  service_type: ServiceType;
  name: string;
  price: string;
  description: string;
  link: string;
  duration: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  image: string;
}

interface Payment {
  id: string;
  service_id: number;
  service: Service;
  payment_method: string;
  result_code: string;
  result_desc: string;
  payment_status: string;
  amount: string;
  transaction_id: string;
  created_at: string;
  updated_at: string;
  user: string;
  service_type: ServiceType | null;
}

interface PaymentsContextProps {
  payments: Payment[];
  loading: boolean;
  getPayments: () => Promise<void>;
  createPayment: (paymentData: Partial<Payment>) => Promise<void>;
  updatePayment: (id: string, paymentData: Partial<Payment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  createMpesaPaymentIntent: (serviceId: number, phone_number: string) => Promise<void>;
  refundPayment: (paymentId: string, refundAmount: number, phone_number: string) => Promise<void>;
}

const PaymentsContext = createContext<PaymentsContextProps | undefined>(undefined);

export const PaymentsProvider = ({ children }: { children: ReactNode }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const pusher = Pusher.getInstance();

    // Enable Pusher debug mode for better troubleshooting
    Pusher.logToConsole = true;

    // Initialize Pusher
    pusher.init({
      apiKey: "38281af5b75dff37a915",
      cluster: "eu",
    });

    // Log connection states
    pusher.connection.bind('state_change', (states) => {
      console.log('Pusher connection state:', states);
    });

    pusher.connect();

    return () => {
      pusher.disconnect();
    };
  }, []);
  const getPayments = async () => {
    setLoading(true);
    try {
      const data = await paymentsManager.getPayments();
      setPayments(data);
    } catch (error) {
      console.error('Failed to fetch payments', error);
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData: Partial<Payment>) => {
    setLoading(true);
    try {
      const newPayment = await paymentsManager.createPayment(paymentData);
      if (newPayment) {
        setPayments([...payments, newPayment]);
      }
    } catch (error) {
      console.error('Failed to create payment', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePayment = async (id: string, paymentData: Partial<Payment>) => {
    setLoading(true);
    try {
      const updatedPayment = await paymentsManager.updatePayment(id, paymentData);
      if (updatedPayment) {
        setPayments(payments.map(payment => (payment.id === id ? updatedPayment : payment)));
      }
    } catch (error) {
      console.error('Failed to update payment', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = async (id: string) => {
    setLoading(true);
    try {
      await paymentsManager.deletePayment(id);
      setPayments(payments.filter(payment => payment.id !== id));
    } catch (error) {
      console.error('Failed to delete payment', error);
    } finally {
      setLoading(false);
    }
  };
  const createMpesaPaymentIntent = async (serviceId: number, phone_number: string) => {
    setLoading(true);
    try {
      await paymentsManager.createMpesaPaymentIntent(serviceId, phone_number);

      const pusher = Pusher.getInstance();
      const channel = await pusher.subscribe('payment-channel');

      channel.on('payment-intent-created', (data) => {
        console.log('Received payment intent event:', data);
        
        const { status_code, user_id, service_id } = data;
        if (status_code === 201) {
          console.log('Payment intent created successfully');
        } else {
          console.error('Failed to create payment intent');
        }

        // Unsubscribe after receiving the event
        channel.unbind('payment-intent-created');
        pusher.unsubscribe('payment-channel');
      });
    } catch (error) {
      console.error('Failed to create Mpesa payment intent', error);
    } finally {
      setLoading(false);
    }
  };

  const refundPayment = async (paymentId: string, refundAmount: number, phone_number: string) => {
    setLoading(true);
    try {
      await paymentsManager.refundPayment(paymentId, refundAmount, phone_number);
    } catch (error) {
      console.error('Failed to refund payment', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPayments();
  }, []);

  return (
    <PaymentsContext.Provider value={{ payments, loading, getPayments, createPayment, updatePayment, deletePayment, createMpesaPaymentIntent, refundPayment }}>
      {children}
    </PaymentsContext.Provider>
  );
};

export const usePayments = () => {
  const context = useContext(PaymentsContext);
  if (context === undefined) {
    throw new Error('usePayments must be used within a PaymentsProvider');
  }
  return context;
};