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

interface ReferralsContextProps {
  referrals: Referral[];
  rewards: Reward[];
  loading: boolean;
  getReferrals: () => Promise<void>;
  createReferral: (referralData: Partial<Referral>) => Promise<void>;
  getRewards: () => Promise<void>;
  createReward: (rewardData: Partial<Reward>) => Promise<void>;
}

const ReferralsContext = createContext<ReferralsContextProps | undefined>(undefined);

export const ReferralsProvider = ({ children }: { children: ReactNode }) => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
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

  useEffect(() => {
    getReferrals();
    getRewards();
  }, []);

  return (
    <ReferralsContext.Provider value={{ referrals, rewards, loading, getReferrals, createReferral, getRewards, createReward }}>
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