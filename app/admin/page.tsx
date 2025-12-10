import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import { ContentService } from '../../services/contentService';
import { Post, User, UserRole, PostStatus } from '../../types';
import PostCard from '../../components/PostCard';
import { Users, Shield, Trash2, RotateCcw, Key } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'posts' | 'users'>('posts');
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!currentUser || (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.SUPER_ADMIN)) {
      navigate('/');
      return;
    }
    loadData();
  }, [currentUser, navigate]);

  const loadData = () => {
    const allPosts = ContentService.getPosts();
    setPendingPosts(allPosts.filter(p => p.status === PostStatus.PENDING));
    setUsers(AuthService.getUsers());
  };

  const handleApprove = (id: string) => {
    const post = pendingPosts.find(p => p.id === id);
    if (post) {
      ContentService.updatePost({ ...post, status: PostStatus.APPROVED });
      loadData();
    }
  };

  const handleReject = (id: string, reason: string) => {
    const post = pendingPosts.find(p => p.id === id);
    if (post) {
      ContentService.updatePost({ ...post, status: PostStatus.REJECTED, rejectionReason: reason });
      loadData();
    }
  };

  const handleDeletePost = (id: string) => {
      if(window.confirm('آیا مطمئن هستید؟')) {
          ContentService.deletePost(id);
          loadData();
      }
  }

  const handleUserAction = (userId: string, action: 'delete' | 'restore' | 'promote' | 'demote') => {
      if (action === 'delete') AuthService.deleteUser(userId);
      if (action === 'restore') AuthService.restoreUser(userId);
      if (action === 'promote') AuthService.updateUserRole(userId, UserRole.ADMIN);
      if (action === 'demote') AuthService.updateUserRole(userId, UserRole.USER);
      loadData();
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
       <h1 className="text-3xl font-bold mb-6 text-gray-800">پنل مدیریت</h1>
       
       <div className="flex gap-4 mb-6 border-b">
          <button 
             onClick={() => setActiveTab('posts')}
             className={`px-4 py-2 font-medium ${activeTab === 'posts' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
          >
             پست‌های در انتظار تایید ({pendingPosts.length})
          </button>
          <button 
             onClick={() => setActiveTab('users')}
             className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
          >
             مدیریت کاربران
          </button>
       </div>

       {activeTab === 'posts' && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingPosts.length === 0 ? <p className="text-gray-500 col-span-3 text-center py-10">هیچ پستی در انتظار تایید نیست.</p> : null}
            {pendingPosts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                isAdminView={true} 
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDeletePost}
              />
            ))}
         </div>
       )}

       {activeTab === 'users' && (
         <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-right">
               <thead className="bg-gray-100 border-b">
                  <tr>
                     <th className="p-4">نام</th>
                     <th className="p-4">ایمیل</th>
                     <th className="p-4">نقش</th>
                     <th className="p-4">وضعیت</th>
                     {currentUser.role === UserRole.SUPER_ADMIN && <th className="p-4 text-red-500">رمز عبور (محرمانه)</th>}
                     <th className="p-4">عملیات</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {users.map(u => (
                     <tr key={u.id} className={`hover:bg-gray-50 ${u.isDeleted ? 'bg-red-50' : ''}`}>
                        <td className="p-4">{u.name}</td>
                        <td className="p-4">{u.email}</td>
                        <td className="p-4">
                           <span className={`px-2 py-1 rounded text-xs ${
                              u.role === UserRole.SUPER_ADMIN ? 'bg-purple-100 text-purple-800' :
                              u.role === UserRole.ADMIN ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                           }`}>
                              {u.role}
                           </span>
                        </td>
                        <td className="p-4">{u.isDeleted ? 'حذف شده' : 'فعال'}</td>
                        {currentUser.role === UserRole.SUPER_ADMIN && (
                            <td className="p-4 font-mono text-sm text-gray-500">{u.password}</td>
                        )}
                        <td className="p-4 flex gap-2">
                           {u.isDeleted ? (
                              <button onClick={() => handleUserAction(u.id, 'restore')} className="text-green-600 hover:bg-green-100 p-1 rounded" title="بازگردانی">
                                 <RotateCcw size={18} />
                              </button>
                           ) : (
                              <button onClick={() => handleUserAction(u.id, 'delete')} className="text-red-600 hover:bg-red-100 p-1 rounded" title="حذف کاربر">
                                 <Trash2 size={18} />
                              </button>
                           )}
                           
                           {currentUser.role === UserRole.SUPER_ADMIN && u.role !== UserRole.SUPER_ADMIN && (
                              u.role === UserRole.USER ? (
                                 <button onClick={() => handleUserAction(u.id, 'promote')} className="text-blue-600 hover:bg-blue-100 p-1 rounded" title="ارتقا به ادمین">
                                    <Shield size={18} />
                                 </button>
                              ) : (
                                 <button onClick={() => handleUserAction(u.id, 'demote')} className="text-gray-600 hover:bg-gray-100 p-1 rounded" title="تنزل به کاربر">
                                    <UserRoleIcon role={UserRole.USER} />
                                 </button>
                              )
                           )}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
       )}
    </div>
  );
};

// Helper for icon
const UserRoleIcon = ({ role }: { role: UserRole }) => <span>...</span>;

export default AdminDashboard;