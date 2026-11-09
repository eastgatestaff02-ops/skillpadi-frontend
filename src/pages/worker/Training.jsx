export default function WorkerTraining() {
  const trainingMaterials = [
    { id: 1, title: 'Basic Safety Guidelines', type: 'PDF Document', size: '2.4 MB' },
    { id: 2, title: 'Tool Maintenance 101', type: 'Video', duration: '12 mins' },
    { id: 3, title: 'Reading Blueprints', type: 'PDF Document', size: '1.8 MB' },
    { id: 4, title: 'Customer Etiquette', type: 'Slideshow', duration: '5 mins' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-6 text-gray-800">My Apprentices (Trainer Dashboard)</h1>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Your training listings and apprentice applications will appear here.</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Training Materials</h2>
          <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Upload Material
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {trainingMaterials.map((material) => (
            <div key={material.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div>
                <p className="font-medium text-gray-800">{material.title}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <span>{material.type}</span>
                  <span>•</span>
                  <span>{material.size || material.duration}</span>
                </div>
              </div>
              <button className="text-teal-600 hover:text-teal-800 text-sm font-medium">
                View
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}