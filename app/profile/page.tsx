import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import { ContentService } from '../../services/contentService';
import { Post, PostStatus } from '../../types';
import { Wallet, Heart, Clock, CheckCircle, XCircle } from 'lucide-react';
import { ZARINPAL_LINK, TETHER_WALLET } from '../../constants';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const allPosts = ContentService.getPosts();
    setPosts(allPosts.filter(p => p.userId === user.id));
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
         <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold">
            {user.name?.charAt(0)}
         </div>
         <div className="flex-1 text-center md:text-right">
            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-500 mb-2">{user.email}</p>
            <span className="inline-block px-3 py-1 bg-gray-100 rounded text-xs text-gray-600">
               نقش: {user.role === 'SUPER_ADMIN' ? 'مدیر کل' : user.role === 'ADMIN' ? 'ادمین' : 'کاربر عادی'}
            </span>
            
            <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
               <a href={ZARINPAL_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-500 transition shadow-sm">
                  <Heart size={18} />
                  حمایت مالی (زرین پال)
               </a>
               <div className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-mono">
                  <Wallet size={18} />
                  <span className="truncate max-w-[150px] md:max-w-none">{TETHER_WALLET}</span>
               </div>
            </div>
         </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4 pr-2 border-r-4 border-primary-500">پست‌های من</h2>
      
      {posts.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg text-gray-500">
           هنوز پستی ثبت نکرده‌اید.
        </div>
      ) : (
        <div className="grid gap-4">
           {posts.map(post => (
             <div key={post.id} className="bg-white border rounded-xl p-4 flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                   {post.posterUrl ? <img src={post.posterUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gray-300">No Image</div>}
                </div>
                <div className="flex-1">
                   <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg">{post.title}</h3>
                      <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${
                        post.status === PostStatus.APPROVED ? 'bg-green-50 text-green-700 border-green-200' :
                        post.status === PostStatus.REJECTED ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                         {post.status === PostStatus.APPROVED && <><CheckCircle size={14} /> منتشر شده</>}
                         {post.status === PostStatus.PENDING && <><Clock size={14} /> در حال بررسی</>}
                         {post.status === PostStatus.REJECTED && <><XCircle size={14} /> رد شده</>}
                      </div>
                   </div>
                   <p className="text-gray-500 text-sm mt-1 mb-2">{new Date(post.createdAt).toLocaleDateString('fa-IR')}</p>
                   
                   {post.status === PostStatus.REJECTED && (
                      <div className="bg-red-50 p-3 rounded text-sm text-red-800 border-r-2 border-red-500">
                         <strong>علت رد شدن: </strong>
                         {post.rejectionReason}
                      </div>
                   )}

                   <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                      <span>بازدید: {post.views}</span>
                      <span>دانلود: {post.downloads}</span>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default Profile;