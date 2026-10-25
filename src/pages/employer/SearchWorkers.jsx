import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearchWorkers } from '@/lib/hooks/useWorker';
import { Search, MapPin, Star } from 'lucide-react';

export default function SearchWorkers() {
  const [filters, setFilters] = useState({ trade: '', location: '' });
  const [searchTrigger, setSearchTrigger] = useState({ trade: '', location: '' });

  // React Query hook (only runs when searchTrigger changes)
  const { data: workers, isLoading } = useSearchWorkers(searchTrigger);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTrigger(filters);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Find Skilled Workers</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-lg shadow">
        <select 
          value={filters.trade} 
          onChange={(e) => setFilters({ ...filters, trade: e.target.value })}
          className="flex-1 border p-2 rounded"
        >
          <option value="">All Trades</option>
          <option value="Plumber">Plumber</option>
          <option value="Electrician">Electrician</option>
          <option value="Carpenter">Carpenter</option>
        </select>
        <input 
          type="text" 
          placeholder="Location (e.g. Lagos)" 
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="flex-1 border p-2 rounded"
        />
        <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded flex items-center justify-center gap-2">
          <Search size={18} /> Search
        </button>
      </form>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-10">Searching...</div>
      ) : workers?.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No workers found for these filters.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workers?.map((worker) => (
            <Link to={`/profile/${worker.id}`} key={worker.id} className="block bg-white rounded-lg shadow hover:shadow-lg transition p-4 border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{worker.name}</h3>
                <div className="flex items-center text-yellow-500 text-sm font-bold">
                  {worker.rating || 'New'} <Star size={14} className="ml-1 fill-current" />
                </div>
              </div>
              <p className="text-teal-700 font-medium">{worker.trade}</p>
              <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                <MapPin size={14} /> {worker.location}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}