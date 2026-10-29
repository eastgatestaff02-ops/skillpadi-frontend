import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { workerApi } from '@/lib/api/worker';
import { catalogApi } from '@/lib/api/catalog';
import { Search, MapPin, Star, Briefcase } from 'lucide-react';

export default function SearchWorkers() {
  // Update state to hold IDs
  const [filters, setFilters] = useState({ tradeId: '', stateId: '' });
  const [searchTrigger, setSearchTrigger] = useState(null);

  // Fetch dynamic trades and states
  const { data: trades } = useQuery({ queryKey: ['trades'], queryFn: catalogApi.getTrades });
  const { data: states } = useQuery({ queryKey: ['states'], queryFn: catalogApi.getStates });

  // Fetch workers
  const { data: response, isLoading } = useQuery({
    queryKey: ['searchWorkers', searchTrigger],
    queryFn: () => workerApi.searchWorkers(searchTrigger).then(res => res.data),
    enabled: !!searchTrigger, 
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTrigger(filters);
  };

  // Extract the array from the new response structure
  const workers = response?.data || [];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Find Skilled Workers</h1>

      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        
        {/* Trade Dropdown */}
        <select 
          value={filters.tradeId} 
          onChange={(e) => setFilters({ ...filters, tradeId: e.target.value })}
          className="flex-1 border p-2 rounded-lg focus:ring-teal-500"
        >
          <option value="">All Trades</option>
          {trades?.map(trade => (
            <option key={trade.id} value={trade.id}>{trade.name}</option>
          ))}
        </select>

        {/* State Dropdown */}
        <select 
          value={filters.stateId} 
          onChange={(e) => setFilters({ ...filters, stateId: e.target.value })}
          className="flex-1 border p-2 rounded-lg focus:ring-teal-500"
        >
          <option value="">All States</option>
          {states?.map(state => (
            <option key={state.id} value={state.id}>{state.name}</option>
          ))}
        </select>
        
        <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-teal-700">
          <Search size={18} /> Search
        </button>
      </form>

      {isLoading ? (
        <div className="text-center py-10 text-teal-600">Searching...</div>
      ) : searchTrigger && workers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No workers found for these filters.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers.map((worker) => (
            <Link to={`/profile/${worker.id}`} key={worker.id} className="block bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                {/* Note: Backend removed names from public search, only IDs and trade info are here. 
                    You may need to show "Worker #1234" or ask backend to add First Name */}
                <h3 className="font-bold text-lg text-gray-900">Worker {worker.id.slice(0,4)}</h3>
                <div className="flex items-center text-yellow-500 text-sm font-bold bg-yellow-50 px-2 py-1 rounded">
                  {/* Rating is not in the response yet, might need to ask backend */}
                  New <Star size={14} className="ml-1 fill-current" />
                </div>
              </div>
              <p className="text-teal-700 font-medium flex items-center gap-1">
                <Briefcase size={16} /> {worker.trade?.name}
              </p>
              <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                <MapPin size={16} /> {worker.lga?.name}, {worker.state?.name}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {worker.yearsExperience} years exp.
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}