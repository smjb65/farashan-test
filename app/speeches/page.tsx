import React, { useState, useEffect } from 'react';
import { ContentService } from '../../services/contentService';
import { Post, PostStatus, PostType } from '../../types';
import PostCard from '../../components/PostCard';
import { GoogleGenAI } from "@google/genai";
import { Search, Loader2, Sparkles } from 'lucide-react';
import { AuthService } from '../../services/authService';

const Speeches: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const user = AuthService.getCurrentUser();

  useEffect(() => {
    const all = ContentService.getPosts();
    const approvedSpeeches = all.filter(p => p.type === PostType.SPEECH && p.status === PostStatus.APPROVED);
    setPosts(approvedSpeeches);
    setFilteredPosts(approvedSpeeches);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
      return;
    }

    setIsSearching(true);
    try {
      // Basic text filter first
      const basicFilter = posts.filter(p => p.title.includes(searchQuery) || p.description.includes(searchQuery));
      
      // AI Search Logic (Gemini)
      if (process.env.API_KEY) {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const prompt = `
            I have a list of religious speeches with these titles: ${posts.map(p => p.title).join(', ')}.
            The user searched for: "${searchQuery}".
            Return a JSON array of titles that are semantically relevant to this search.
          `;
          
          // Note: In a real Next.js app, this call should happen in a server action to protect the Key.
          // Here we simulate the logic or catch the error if key is missing.
          try {
             const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
             });
             const relevantTitles = JSON.parse(response.text.replace(/```json|```/g, '').trim());
             const aiFiltered = posts.filter(p => relevantTitles.includes(p.title));
             // Merge results
             const unique = Array.from(new Set([...basicFilter, ...aiFiltered]));
             setFilteredPosts(unique);
          } catch(err) {
             console.warn("AI Search failed or key missing, falling back to basic search", err);
             setFilteredPosts(basicFilter);
          }
      } else {
         setFilteredPosts(basicFilter);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDelete = (id: string) => {
      if(user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
          if(window.confirm("حذف پست؟")) {
              ContentService.deletePost(id);
              // Refresh
              const all = ContentService.getPosts();
              const approvedSpeeches = all.filter(p => p.type === PostType.SPEECH && p.status === PostStatus.APPROVED);
              setPosts(approvedSpeeches);
              setFilteredPosts(approvedSpeeches);
          }
      }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
         <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            آرشیو سخنرانی‌ها
         </h1>
         
         <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="جستجوی هوشمند (مثلا: سخنرانی درباره صبر...)" 
              className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-500">
               {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
            </button>
         </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredPosts.map(post => (
           <PostCard key={post.id} post={post} onDelete={handleDelete} />
         ))}
         {filteredPosts.length === 0 && (
           <div className="col-span-3 text-center py-10 text-gray-500">
              موردی یافت نشد.
           </div>
         )}
      </div>
    </div>
  );
};

export default Speeches;