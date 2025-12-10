import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import { ContentService } from '../../services/contentService';
import { PostType, PostStatus } from '../../types';
import { UploadCloud, FileImage, Loader2 } from 'lucide-react';
import { MAX_FILE_SIZE_MB } from '../../constants';

const AddPost: React.FC = () => {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: PostType.MANQABAT,
    location: '',
    date: '',
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">لطفا وارد شوید</h2>
        <p className="text-gray-600 mb-6">برای افزودن پست باید وارد حساب کاربری خود شوید.</p>
        <button onClick={() => navigate('/login')} className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">
          ورود به حساب
        </button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'media' | 'poster') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (type === 'media') {
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          setError(`حجم فایل نباید بیشتر از ${MAX_FILE_SIZE_MB} مگابایت باشد.`);
          return;
        }
        setMediaFile(file);
      } else {
        setPosterFile(file);
      }
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFile) {
      setError('لطفا فایل صوتی یا ویدیویی را انتخاب کنید');
      return;
    }

    if (!ContentService.canUserPost(user.id)) {
      setError('شما به سقف مجاز ارسال پست در ماه (2 پست) رسیده‌اید.');
      return;
    }

    setLoading(true);
    try {
      // Simulation of Arvan Cloud Upload
      const mediaUrl = await ContentService.uploadFileMock(mediaFile);
      let posterUrl = undefined;
      if (posterFile) {
        posterUrl = await ContentService.uploadFileMock(posterFile);
      }

      ContentService.savePost({
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        userName: user.name,
        type: formData.type,
        title: formData.title,
        description: formData.description,
        mediaUrl: mediaUrl,
        mediaType: mediaFile.type.startsWith('video') ? 'video' : 'audio',
        posterUrl: posterUrl,
        status: PostStatus.PENDING,
        location: formData.location,
        date: formData.date ? new Date(formData.date).toISOString() : undefined,
        views: 0,
        downloads: 0,
        createdAt: new Date().toISOString()
      });

      navigate('/profile');
    } catch (err) {
      setError('خطا در آپلود فایل. لطفا مجدد تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800">
        <p className="font-bold mb-1">توجه:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>پست شما پس از تایید ادمین منتشر خواهد شد.</li>
          <li>حداکثر حجم فایل {MAX_FILE_SIZE_MB} مگابایت است.</li>
          <li>شما می‌توانید حداکثر 2 پست در ماه ارسال کنید.</li>
        </ul>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">افزودن پست جدید</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border">
        {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">عنوان پست</label>
          <input 
            required
            type="text" 
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">دسته‌بندی</label>
          <div className="flex gap-4">
             <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="type" 
                  checked={formData.type === PostType.MANQABAT}
                  onChange={() => setFormData({...formData, type: PostType.MANQABAT})}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span>منقبت خوانی</span>
             </label>
             <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="type" 
                  checked={formData.type === PostType.SPEECH}
                  onChange={() => setFormData({...formData, type: PostType.SPEECH})}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span>سخنرانی</span>
             </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">فایل رسانه (ویدیو یا صوت)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
             <input type="file" accept="video/*,audio/*" onChange={(e) => handleFileChange(e, 'media')} className="hidden" id="media-upload" />
             <label htmlFor="media-upload" className="cursor-pointer flex flex-col items-center">
                <UploadCloud size={32} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">{mediaFile ? mediaFile.name : 'انتخاب فایل (Max 10MB)'}</span>
             </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">تصویر پوستر (اختیاری)</label>
          <div className="flex items-center gap-4">
             <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'poster')} className="hidden" id="poster-upload" />
             <label htmlFor="poster-upload" className="cursor-pointer flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">
                <FileImage size={18} />
                {posterFile ? 'تغییر تصویر' : 'انتخاب تصویر'}
             </label>
             {posterFile && <span className="text-xs text-gray-500">{posterFile.name}</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات</label>
          <textarea 
            required
            rows={4}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary-500 outline-none"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">مکان (اختیاری)</label>
              <input 
                type="text" 
                className="w-full border rounded-lg p-2"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
           </div>
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ (اختیاری)</label>
              <input 
                type="date" 
                className="w-full border rounded-lg p-2"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
           </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-primary-700 transition flex items-center justify-center gap-2"
        >
          {loading ? (
             <>
               <Loader2 className="animate-spin" />
               در حال آپلود به آروان کلاد...
             </>
          ) : 'ثبت نهایی پست'}
        </button>
      </form>
    </div>
  );
};

export default AddPost;