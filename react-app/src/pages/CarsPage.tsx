import React, { useState, useEffect } from 'react';
import { Car } from '../types';
import { carService } from '../services/carService';
import { CarCard } from '../components/CarCard';
import { SearchFilters } from '../components/SearchFilters';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const CarsPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    make: '',
    model: '',
  });

  const fetchCars = async () => {
    try {
      setLoading(true);
      const data = await carService.getAllCars(filters);
      setCars(data);
    } catch (error) {
      toast.error('Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <SearchFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>
        
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Available Cars</h1>
            <p className="text-gray-600">{cars.length} cars found</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>

          {cars.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No cars found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};