// utils/ads.ts
import { AdMobInterstitial } from 'expo-ads-admob';

export const showInterstitialAd = async () => {
  try {
    // Use the test ad unit ID during development
    const adUnitId = __DEV__
      ? 'ca-app-pub-3940256099942544/1033173712' // Test ad unit ID
      : 'your-production-ad-unit-id'; // Replace with your production ID

    await AdMobInterstitial.setAdUnitID(adUnitId);
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
    await AdMobInterstitial.showAdAsync();
  } catch (error) {
    console.error('Failed to show interstitial ad:', error);
  }
  console.log("Requesting ad...");
await AdMobInterstitial.requestAdAsync();
console.log("Showing ad...");
await AdMobInterstitial.showAdAsync();

};
