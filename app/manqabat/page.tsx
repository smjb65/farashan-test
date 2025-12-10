import React, { useState, useEffect } from 'react';
import { ContentService } from '../../services/contentService';
import { Post, PostStatus, PostType } from '../../types';
import PostCard from '../../components/PostCard';
import { GoogleGenAI } from "@google/genai";
import { Loader2, Sparkles } from 'lucide-react';
import { AuthService } from '../../services/authService';

const Manqabat: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    const all = ContentService.getPosts();
    const approved = all.filter(p => p.type === PostType.MANQABAT && p.status === PostStatus.APPROVED);
    setPosts(approved);
    setFilteredPosts(approved);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
      return;
    }

    setIsSearching(true);
    try {
      const basicFilter = posts.filter(p => p.title.includes(searchQuery) || p.description.includes(searchQuery));
      setFilteredPosts(basicFilter);
      // Gemini integration would go here similar to Speeches page
    } finally {
      setIsSearching(false);
    }
  };

  const handleDelete = (id: string) => {
      if(user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
          if(window.confirm("حذف پست؟")) {
              ContentService.deletePost(id);
              const all = ContentService.getPosts();
              const approved = all.filter(p => p.type === PostType.MANQABAT && p.status === PostStatus.APPROVED);
              setPosts(approved);
              setFilteredPosts(approved);
          }
      }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
         <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-8 bg-green-500 rounded-full"></span>
            گلچین منقبت‌خوانی
         </h1>
         
         <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="جستجو در منقبت‌ها..." 
              className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-green-500">
               {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
            </button>
         </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredPosts.map(post => (
           <PostCard key={post.id} post={post} onDelete={handleDelete} />
         ))}
      </div>
    </div>
  );
};

export default Manqabat;