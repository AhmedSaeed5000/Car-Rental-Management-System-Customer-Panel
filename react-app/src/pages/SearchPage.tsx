import React from 'react';
import { useSearchCars } from '../hooks/useSearchCars';
import { CarCard } from '../components/CarCard';
import { SearchFilters } from '../components/SearchFilters';
import { Loader2, AlertCircle } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { cars, isLoading, error, filters, setFilters } = useSearchCars();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
        <AlertCircle className="w-12 h-12 mb-2" />
        <p>Failed to load cars. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Search Cars</h1>
        <p className="text-gray-600 mt-2">Find your perfect rental car</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <SearchFilters filters={filters} onFilterChange={setFilters} />
        </div>
        
        <div className="lg:col-span-3">
          <div className="mb-6">
            <p className="text-gray-600">{cars.length} cars found</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>

          {cars.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No cars found matching your criteria</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};