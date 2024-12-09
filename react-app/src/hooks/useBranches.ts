import { useState, useEffect } from 'react';
import { branches as branchesApi } from '../services/api';
import { Branch } from '../types';

export const useBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        console.log('Fetching branches...');
        const response = await branchesApi.getAll();
        console.log('Branches response:', response.data);
        
        if (Array.isArray(response.data)) {
          setBranches(response.data);
          console.log('Branches set successfully:', response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setBranches([]);
        }
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Failed to fetch branches');
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  return { branches, loading, error };
}; 