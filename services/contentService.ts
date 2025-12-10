import { Post, PostStatus, PostType, Comment } from '../types';
import { MAX_POSTS_PER_MONTH } from '../constants';

const POSTS_KEY = 'farashan_posts';

export const ContentService = {
  getPosts: (): Post[] => {
    const stored = localStorage.getItem(POSTS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  savePost: (post: Post) => {
    const posts = ContentService.getPosts();
    posts.unshift(post);
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  },

  updatePost: (updatedPost: Post) => {
    const posts = ContentService.getPosts();
    const index = posts.findIndex(p => p.id === updatedPost.id);
    if (index !== -1) {
      posts[index] = updatedPost;
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    }
  },

  deletePost: (postId: string) => {
    let posts = ContentService.getPosts();
    posts = posts.filter(p => p.id !== postId);
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  },

  canUserPost: (userId: string): boolean => {
    const posts = ContentService.getPosts();
    const now = new Date();
    const userPostsThisMonth = posts.filter(p => {
      const postDate = new Date(p.createdAt);
      return p.userId === userId && 
             postDate.getMonth() === now.getMonth() && 
             postDate.getFullYear() === now.getFullYear();
    });
    return userPostsThisMonth.length < MAX_POSTS_PER_MONTH;
  },

  addComment: (postId: string, comment: Comment) => {
    const posts = ContentService.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      if (!post.comments) post.comments = [];
      post.comments.push(comment);
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    }
  },

  incrementView: (postId: string) => {
    const posts = ContentService.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.views += 1;
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    }
  },

  // Simulating the Backend API Logic requested
  uploadFileMock: async (file: File): Promise<string> => {
     // In a real app, this calls the Next.js API route which uses AWS SDK
     return new Promise(resolve => {
         setTimeout(() => {
             // Returning a fake URL since we can't actually upload to Arvan in this sandbox
             resolve(URL.createObjectURL(file)); 
         }, 1500);
     });
  }
};