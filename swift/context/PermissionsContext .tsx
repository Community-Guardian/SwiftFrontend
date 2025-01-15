import React, { createContext, useContext, useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

type PermissionStatus = 'granted' | 'denied' | 'never_ask_again';

type Permissions = {
  camera: PermissionStatus;
  location: PermissionStatus;
  storage: PermissionStatus;
  contacts: PermissionStatus;
  microphone: PermissionStatus;
};

type PermissionsContextType = {
  permissions: Permissions;
  requestPermission: (type: keyof Permissions) => Promise<void>;
  checkPermission: (type: keyof Permissions) => Promise<PermissionStatus>;
};

const defaultPermissions: Permissions = {
  camera: 'denied',
  location: 'denied',
  storage: 'denied',
  contacts: 'denied',
  microphone: 'denied',
};

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissions, setPermissions] = useState<Permissions>(defaultPermissions);

  const checkPermission = async (type: keyof Permissions): Promise<PermissionStatus> => {
    if (Platform.OS !== 'android') return 'granted';

    let result: PermissionStatus;
    switch (type) {
      case 'camera':
        result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
          ? 'granted'
          : 'denied';
        break;
      case 'location':
        result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
          ? 'granted'
          : 'denied';
        break;
      case 'storage':
        result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
          ? 'granted'
          : 'denied';
        break;
      case 'contacts':
        result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
          ? 'granted'
          : 'denied';
        break;
      case 'microphone':
        result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO)
          ? 'granted'
          : 'denied';
        break;
      default:
        result = 'denied';
    }

    return result;
  };

  const requestPermission = async (type: keyof Permissions): Promise<void> => {
    if (Platform.OS !== 'android') return;

    let result: PermissionStatus;
    try {
      switch (type) {
        case 'camera':
          result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
          break;
        case 'location':
          result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
          break;
        case 'storage':
          result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
          break;
        case 'contacts':
          result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
          break;
        case 'microphone':
          result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
          break;
        default:
          result = 'denied';
      }

      setPermissions((prev) => ({
        ...prev,
        [type]: result,
      }));
    } catch (error) {
      console.error(`Error requesting ${type} permission:`, error);
    }
  };

  const initializePermissions = async () => {
    const updatedPermissions: Permissions = { ...defaultPermissions };
    for (const key of Object.keys(defaultPermissions) as Array<keyof Permissions>) {
      updatedPermissions[key] = await checkPermission(key);
    }
    setPermissions(updatedPermissions);
  };

  useEffect(() => {
    initializePermissions();
  }, []);

  return (
    <PermissionsContext.Provider value={{ permissions, requestPermission, checkPermission }}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = (): PermissionsContextType => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};
