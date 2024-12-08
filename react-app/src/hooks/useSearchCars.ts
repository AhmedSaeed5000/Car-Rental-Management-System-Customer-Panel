import { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import debounce from 'debounce';
import { carService } from '../services/carService';
import { Car } from '../types';

interface SearchFilters {
  location: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  make: string;
  model: string;
}

export const useSearchCars = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    make: '',
    model: '',
  });

  const { data: cars = [], isLoading, error } = useQuery(
    ['cars', filters],
    () => carService.getAllCars(filters),
    {
      keepPreviousData: true,
    }
  );

  const debouncedSetFilters = useCallback(
    debounce((name: string, value: string) => {
      setFilters(prev => ({ ...prev, [name]: value }));
    }, 300),
    []
  );

  return {
    cars,
    isLoading,
    error,
    filters,
    setFilters: debouncedSetFilters,
  };
};