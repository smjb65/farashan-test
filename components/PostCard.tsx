import React, { useState } from 'react';
import { Post, UserRole } from '../types';
import { Download, Eye, MapPin, Calendar, MessageCircle, Send, PlayCircle, Music } from 'lucide-react';
import { AuthService } from '../services/authService';
import { ContentService } from '../services/contentService';

interface PostCardProps {
  post: Post;
  isAdminView?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
  onDelete?: (id: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, isAdminView, onApprove, onReject, onDelete }) => {
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const currentUser = AuthService.getCurrentUser();

  const handleDownload = () => {
    ContentService.incrementView(post.id);
    const link = document.createElement('a');
    link.href = post.mediaUrl;
    link.download = post.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !commentText.trim()) return;
    
    ContentService.addComment(post.id, {
      id: Date.now().toString(),
      postId: post.id,
      userId: currentUser.id,
      userName: currentUser.name || 'کاربر',
      content: commentText,
      createdAt: new Date().toISOString()
    });
    setCommentText('');
  };

  const formattedDate = new Date(post.createdAt || Date.now()).toLocaleDateString('fa-IR');

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      {/* Poster / Visual Header */}
      <div className="relative h-48 bg-gray-200 flex items-center justify-center overflow-hidden group">
        {post.posterUrl ? (
          <img src={post.posterUrl} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-400 flex flex-col items-center">
            {post.mediaType === 'video' ? <PlayCircle size={48} /> : <Music size={48} />}
            <span className="mt-2 text-sm">{post.type === 'SPEECH' ? 'سخنرانی' : 'منقبت'}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <button onClick={handleDownload} className="bg-white text-gray-800 p-2 rounded-full flex items-center gap-2 hover:bg-primary-100">
                <Download size={20} />
                <span>دانلود</span>
             </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
           <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{post.title}</h3>
           <span className={`text-xs px-2 py-1 rounded ${post.type === 'SPEECH' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
             {post.type === 'SPEECH' ? 'سخنرانی' : 'منقبت'}
           </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">{post.description}</p>
        
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
           {post.location && (
             <span className="flex items-center gap-1"><MapPin size={12} /> {post.location}</span>
           )}
           <span className="flex items-center gap-1"><Calendar size={12} /> {formattedDate}</span>
           <span className="flex items-center gap-1"><Eye size={12} /> {post.views}</span>
        </div>

        {/* Media Player (Simple HTML5) */}
        <div className="mb-4">
          {post.mediaType === 'video' ? (
            <video controls src={post.mediaUrl} className="w-full h-32 rounded bg-black" />
          ) : (
            <audio controls src={post.mediaUrl} className="w-full" />
          )}
        </div>

        {/* Action Buttons (Admin or User) */}
        <div className="flex flex-col gap-2">
            {isAdminView ? (
              <div className="flex gap-2 mt-2">
                 <button onClick={() => onApprove?.(post.id)} className="flex-1 bg-green-500 text-white py-1 rounded text-sm hover:bg-green-600">تایید</button>
                 <button onClick={() => setIsRejecting(!isRejecting)} className="flex-1 bg-red-500 text-white py-1 rounded text-sm hover:bg-red-600">رد</button>
                 {onDelete && <button onClick={() => onDelete(post.id)} className="px-2 bg-gray-500 text-white rounded hover:bg-gray-600">حذف</button>}
              </div>
            ) : (
                <div className="flex justify-between items-center mt-2 border-t pt-2">
                    <button onClick={() => setShowComments(!showComments)} className="text-sm text-primary-600 flex items-center gap-1 hover:underline">
                        <MessageCircle size={16} />
                        {post.comments?.length || 0} نظر
                    </button>
                    {/* Admin/SuperAdmin can delete from explore */}
                    {(currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.SUPER_ADMIN) && onDelete && (
                       <button onClick={() => onDelete(post.id)} className="text-xs text-red-500 hover:text-red-700">حذف پست</button>
                    )}
                </div>
            )}

            {isRejecting && isAdminView && (
              <div className="mt-2 bg-red-50 p-2 rounded">
                 <textarea 
                    className="w-full p-2 text-sm border rounded mb-2" 
                    placeholder="دلیل رد شدن پست..." 
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                 />
                 <button 
                   onClick={() => { onReject?.(post.id, rejectReason); setIsRejecting(false); }}
                   className="w-full bg-red-600 text-white text-xs py-1 rounded"
                 >
                   ثبت رد
                 </button>
              </div>
            )}

            {/* Comments Section */}
            {showComments && !isAdminView && (
               <div className="mt-3 bg-gray-50 p-3 rounded-lg text-sm">
                  <div className="max-h-40 overflow-y-auto mb-2 space-y-2">
                     {post.comments?.map((c) => (
                        <div key={c.id} className="bg-white p-2 rounded shadow-sm">
                           <strong className="text-xs text-primary-700 block">{c.userName}</strong>
                           <p className="text-gray-700">{c.content}</p>
                        </div>
                     ))}
                     {(!post.comments || post.comments.length === 0) && <p className="text-gray-400 text-center text-xs">هنوز نظری ثبت نشده است.</p>}
                  </div>
                  {currentUser ? (
                    <form onSubmit={handleComment} className="flex gap-2">
                       <input 
                         type="text" 
                         value={commentText} 
                         onChange={(e) => setCommentText(e.target.value)}
                         placeholder="نظر خود را بنویسید..." 
                         className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:border-primary-500"
                       />
                       <button type="submit" className="text-primary-600"><Send size={18} /></button>
                    </form>
                  ) : (
                    <p className="text-xs text-red-500 text-center">برای ثبت نظر باید وارد شوید.</p>
                  )}
               </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;