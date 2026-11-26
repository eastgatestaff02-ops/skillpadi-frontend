import { useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { User, Upload, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { getApiErrorMessage } from '@/lib/utils/errors';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

function AvatarSection({ profile }) {
  const inputRef = useRef(null);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setError('');
    setPreparing(true);

    try {
      // 1. Compress the image
      const compressed = await imageCompression(file, { 
        maxSizeMB: 0.1, 
        maxWidthOrHeight: 500, 
        useWebWorker: false 
      });
      
      // 2. Get the signed upload URL (ONLY sending contentType)
      const { data: urlRes } = await apiClient.post('/api/profiles/worker/me/avatar/upload-url', {
        contentType: compressed.type,
      });
      
      // Safely extract the URL and Key
      const uploadUrl = urlRes.data?.uploadUrl || urlRes.uploadUrl;
      const fileKey = urlRes.data?.fileKey || urlRes.fileKey;

      if (!uploadUrl) throw new Error('No upload URL returned.');

      // 3. Upload directly to Supabase
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: compressed,
        headers: { 'Content-Type': compressed.type },
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload to storage.');

      // 4. Finalize with the backend (Only send fileKey if it exists)
      const finalizePayload = fileKey ? { fileKey } : {};
      await apiClient.post('/api/profiles/worker/me/avatar/finalize', finalizePayload);

      // 5. Refresh the page to show the new image
      window.location.reload();
      
    } catch (err) {
      console.error("Avatar Error:", err);
      setError(getApiErrorMessage(err, 'Could not upload photo.'));
    } finally {
      setPreparing(false);
    }
  };

  const avatarUrl = profile?.avatarUrl || profile?.avatar?.url || profile?.imageUrl;

  return (
    <div className="flex flex-col items-center mb-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      
      {/* BUTTON OPENING TAG */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={preparing}
        className="relative group h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-ochre-100 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
      >
        {preparing ? (
          <Loader2 size={32} className="animate-spin text-navy-500" />
        ) : avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <User size={40} className="text-navy-500/50" />
        )}

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Upload size={24} className="text-white" />
        </div>
      </button>
      {/* BUTTON CLOSING TAG ADDED HERE */}

      <p className="mt-2 text-caption text-navy-500/70 font-medium">
        {preparing ? 'Uploading...' : 'Tap to change photo'}
      </p>

      {error && <FeedbackBanner tone="error" className="mt-2 text-xs">{error}</FeedbackBanner>}
    </div>
  );
}