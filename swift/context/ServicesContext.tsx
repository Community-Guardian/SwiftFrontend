"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import servicesManager from "../handler/ServicesManager";

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

interface ServicesContextProps {
  services: Service[];
  serviceTypes: ServiceType[];
  loading: boolean; // Track loading state
  getServices: () => Promise<void>;
  createService: (serviceData: Partial<Service>) => Promise<void>;
  updateService: (id: number, serviceData: Partial<Service>) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
  getServiceTypes: () => Promise<void>;
  createServiceType: (serviceTypeData: Partial<ServiceType>) => Promise<void>;
  updateServiceType: (id: number, serviceTypeData: Partial<ServiceType>) => Promise<void>;
  deleteServiceType: (id: number) => Promise<void>;
}

const ServicesContext = createContext<ServicesContextProps | undefined>(undefined);

export const ServicesProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(false); // Loading state for operations

  // Fetch services
  const getServices = async () => {
    setLoading(true);
    try {
      const data = await servicesManager.getServices();
      setServices(data);
    } catch (error) {
      console.error("Failed to fetch services", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new service
  const createService = async (serviceData: Partial<Service>) => {
    setLoading(true);
    try {
      const newService = await servicesManager.createService(serviceData);
      if (newService) {
        setServices([...services, newService]);
      }
    } catch (error) {
      console.error("Failed to create service", error);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing service
  const updateService = async (id: number, serviceData: Partial<Service>) => {
    setLoading(true);
    try {
      const updatedService = await servicesManager.updateService(id, serviceData);
      if (updatedService) {
        setServices(services.map((service) => (service.id === id ? updatedService : service)));
      }
    } catch (error) {
      console.error("Failed to update service", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a service
  const deleteService = async (id: number) => {
    setLoading(true);
    try {
      await servicesManager.deleteService(id);
      setServices(services.filter((service) => service.id !== id));
    } catch (error) {
      console.error("Failed to delete service", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch service types
  const getServiceTypes = async () => {
    setLoading(true);
    try {
      const data = await servicesManager.getServiceTypes();
      setServiceTypes(data);
    } catch (error) {
      console.error("Failed to fetch service types", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new service type
  const createServiceType = async (serviceTypeData: Partial<ServiceType>) => {
    setLoading(true);
    try {
      const newServiceType = await servicesManager.createServiceType(serviceTypeData);
      if (newServiceType) {
        setServiceTypes([...serviceTypes, newServiceType]);
      }
    } catch (error) {
      console.error("Failed to create service type", error);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing service type
  const updateServiceType = async (id: number, serviceTypeData: Partial<ServiceType>) => {
    setLoading(true);
    try {
      const updatedServiceType = await servicesManager.updateServiceType(id, serviceTypeData);
      if (updatedServiceType) {
        setServiceTypes(
          serviceTypes.map((serviceType) =>
            serviceType.id === id ? updatedServiceType : serviceType
          )
        );
      }
    } catch (error) {
      console.error("Failed to update service type", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a service type
  const deleteServiceType = async (id: number) => {
    setLoading(true);
    try {
      await servicesManager.deleteServiceType(id);
      setServiceTypes(serviceTypes.filter((serviceType) => serviceType.id !== id));
    } catch (error) {
      console.error("Failed to delete service type", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch services and service types on initial render
  useEffect(() => {
    getServices();
    getServiceTypes();
  }, []);

  return (
    <ServicesContext.Provider
      value={{
        services,
        serviceTypes,
        loading,
        getServices,
        createService,
        updateService,
        deleteService,
        getServiceTypes,
        createServiceType,
        updateServiceType,
        deleteServiceType,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error("useServices must be used within a ServicesProvider");
  }
  return context;
};
