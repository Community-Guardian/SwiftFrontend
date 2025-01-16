import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import referralsManager from '@/handler/referalsManager';

interface Referral {
  id: number;
  referrer: string;
  referred?: string | null;
  referral_code: string;
  reward_amount: string;
  created_at: string;
  is_successful: boolean;
}

interface Reward {
  id: number;
  user: string;
  referral: Referral;
  reward_amount: string;
  created_at: string;
}

interface WithdrawalRequest {
  id: number;
  user: string;
  amount: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ReferralsContextProps {
  referrals: Referral[];
  rewards: Reward[];
  withdrawalRequests: WithdrawalRequest[];
  loading: boolean;
  getReferrals: () => Promise<void>;
  createReferral: (referralData: Partial<Referral>) => Promise<void>;
  getRewards: () => Promise<void>;
  createReward: (rewardData: Partial<Reward>) => Promise<void>;
  getWithdrawalRequests: () => Promise<void>;
  createWithdrawalRequest: (withdrawalRequestData: Partial<WithdrawalRequest>) => Promise<void>;
}

const ReferralsContext = createContext<ReferralsContextProps | undefined>(undefined);

export const ReferralsProvider = ({ children }: { children: ReactNode }) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const getReferrals = async () => {
    setLoading(true);
    try {
      const data = await referralsManager.getReferrals();
      setReferrals(data);
    } catch (error) {
      console.error('Failed to fetch referrals', error);
    } finally {
      setLoading(false);
    }
  };

  const createReferral = async (referralData: Partial<Referral>) => {
    setLoading(true);
    try {
      const newReferral = await referralsManager.createReferral(referralData);
      if (newReferral) {
        setReferrals([...referrals, newReferral]);
      }
    } catch (error) {
      console.error('Failed to create referral', error);
    } finally {
      setLoading(false);
    }
  };

  const getRewards = async () => {
    setLoading(true);
    try {
      const data = await referralsManager.getRewards();
      setRewards(data);
    } catch (error) {
      console.error('Failed to fetch rewards', error);
    } finally {
      setLoading(false);
    }
  };

  const createReward = async (rewardData: Partial<Reward>) => {
    setLoading(true);
    try {
      const newReward = await referralsManager.createReward(rewardData);
      if (newReward) {
        setRewards([...rewards, newReward]);
      }
    } catch (error) {
      console.error('Failed to create reward', error);
    } finally {
      setLoading(false);
    }
  };

  const getWithdrawalRequests = async () => {
    setLoading(true);
    try {
      const data = await referralsManager.getWithdrawalRequests();
      setWithdrawalRequests(data);
    } catch (error) {
      console.error('Failed to fetch withdrawal requests', error);
    } finally {
      setLoading(false);
    }
  };

  const createWithdrawalRequest = async (withdrawalRequestData: Partial<WithdrawalRequest>) => {
    setLoading(true);
    try {
      const newWithdrawalRequest = await referralsManager.createWithdrawalRequest(withdrawalRequestData);
      if (newWithdrawalRequest) {
        setWithdrawalRequests([...withdrawalRequests, newWithdrawalRequest]);
      }
    } catch (error) {
      console.error('Failed to create withdrawal request', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReferrals();
    getRewards();
    getWithdrawalRequests();
  }, []);

  return (
    <ReferralsContext.Provider value={{ referrals, rewards, withdrawalRequests, loading, getReferrals, createReferral, getRewards, createReward, getWithdrawalRequests, createWithdrawalRequest }}>
      {children}
    </ReferralsContext.Provider>
  );
};

export const useReferrals = () => {
  const context = useContext(ReferralsContext);
  if (context === undefined) {
    throw new Error('useReferrals must be used within a ReferralsProvider');
  }
  return context;
};