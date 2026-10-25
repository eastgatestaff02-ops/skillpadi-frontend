import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useWorkerProfile, useUpdateWorkerProfile } from '@/lib/hooks/useWorker';
import { workerApi } from '@/lib/api/worker';
import imageCompression from 'browser-image-compression'; // npm install browser-image-compression

export default function WorkerProfile() {
  const { data: profile, isLoading } = useWorkerProfile();
  const updateProfile = useUpdateWorkerProfile();
  const { register, handleSubmit } = useForm();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // Compress image to < 100KB before uploading
      const options = { maxSizeMB: 0.1, maxWidthOrHeight: 1000, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      
      const formData = new FormData();
      formData.append('image', compressedFile);
      
      await workerApi.uploadPortfolio(formData);
      alert('Image uploaded successfully!');
      // Ideally, invalidate the query here to refetch
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Worker Profile</h1>
      
      {/* Profile Picture Upload */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </div>
        <div>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
          <button 
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className="bg-teal-600 text-white px-4 py-2 rounded"
          >
            {uploading ? 'Compressing & Uploading...' : 'Upload Photo'}
          </button>
          <p className="text-xs text-gray-500 mt-2">Max 100KB (auto-compressed)</p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit((data) => updateProfile.mutate(data))} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Trade</label>
          <select {...register('trade')} defaultValue={profile?.trade} className="w-full border p-2 rounded">
            <option value="Plumber">Plumber</option>
            <option value="Electrician">Electrician</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Tailor">Tailor</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium">Years of Experience</label>
          <input type="number" {...register('yearsOfExperience')} defaultValue={profile?.yearsOfExperience} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Location</label>
          <input type="text" {...register('location')} defaultValue={profile?.location} className="w-full border p-2 rounded" />
        </div>

        <button type="submit" disabled={updateProfile.isPending} className="bg-teal-600 text-white px-6 py-2 rounded">
          {updateProfile.isPending ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}