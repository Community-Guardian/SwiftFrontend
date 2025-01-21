"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import paymentsManager from "../handler/PaymentsManager";

interface ServiceType {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

interface Service {
  id: number;
  name: string;
  service_type: ServiceType; // Nested service type object
  service_type_id: string; 
  price: number;
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
  expiration_date: string; // ISO date string
  is_expired: boolean; // Whether the service has expired
  total_amount_paid: number; // Total amount paid for the service
}


interface PaymentsContextProps {
  payments: Payment[];
  loading: boolean;
  getPayments: () => Promise<void>;
  createPayment: (paymentData: Partial<Payment>) => Promise<void>;
  updatePayment: (id: string, paymentData: Partial<Payment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  createMpesaPaymentIntent: (serviceId: number, phone_number: string) => Promise<Payment>;
  refundPayment: (paymentId: string, refundAmount: number, phone_number: string) => Promise<void>;
}

const PaymentsContext = createContext<PaymentsContextProps | undefined>(undefined);

export const PaymentsProvider = ({ children }: { children: ReactNode }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  const getPayments = async () => {
    setLoading(true);
    try {
      const data = await paymentsManager.getPayments();
      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments", error);
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
      console.error("Failed to create payment", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePayment = async (id: string, paymentData: Partial<Payment>) => {
    setLoading(true);
    try {
      const updatedPayment = await paymentsManager.updatePayment(id, paymentData);
      if (updatedPayment) {
        setPayments(payments.map((payment) => (payment.id === id ? updatedPayment : payment)));
      }
    } catch (error) {
      console.error("Failed to update payment", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = async (id: string) => {
    setLoading(true);
    try {
      await paymentsManager.deletePayment(id);
      setPayments(payments.filter((payment) => payment.id !== id));
    } catch (error) {
      console.error("Failed to delete payment", error);
    } finally {
      setLoading(false);
    }
  };
  const createMpesaPaymentIntent = async (serviceId: number, phone_number: string) => {
    setLoading(true);
  
    try {
      // Step 1: Create the payment intent
      const paymentIntent = await paymentsManager.createMpesaPaymentIntent(serviceId, phone_number);
      if (!paymentIntent) {
        throw new Error("Payment unsuccessful. Please try again.");
      }  
      // Step 2: Poll payments to check status
      const startTime = Date.now();
      let newPayment = null;
  
      while (Date.now() - startTime < 40000) { // 40 seconds timeout
        const payments = await paymentsManager.getPayments();        
        newPayment = await payments.find((payment) => payment.id === paymentIntent.id);
        console.log("Payment retrieved:", newPayment);
         
        
        if (newPayment) {
          if (newPayment.payment_status === "paid") {
            console.log("Payment successful:", newPayment);
            return newPayment;
          }
  
          if (newPayment.payment_status === "incomplete") {
            throw new Error(newPayment.result_desc || "Payment was incomplete.");
          }
        }
  
        console.log("Payment status is pending. Retrying...");
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5 seconds
      }
  
      throw new Error("Payment processing timed out. Please try again.");
    } catch (error: any) {
      console.error("Failed to create Mpesa payment intent:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const refundPayment = async (paymentId: string, refundAmount: number, phone_number: string) => {
    setLoading(true);
    try {
      await paymentsManager.refundPayment(paymentId, refundAmount, phone_number);
    } catch (error) {
      console.error("Failed to refund payment", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPayments();
  }, []);

  return (
    <PaymentsContext.Provider
      value={{
        payments,
        loading,
        getPayments,
        createPayment,
        updatePayment,
        deletePayment,
        createMpesaPaymentIntent,
        refundPayment,
      }}
    >
      {children}
    </PaymentsContext.Provider>
  );
};

export const usePayments = () => {
  const context = useContext(PaymentsContext);
  if (context === undefined) {
    throw new Error("usePayments must be used within a PaymentsProvider");
  }
  return context;
};
