import React from 'react';
import PostItem from './PostItem';

// Mock posts data
const mockPosts = [
  {
    id: 1,
    author: { name: 'Alumni: Priya Sharma', role: 'alumni' },
    content: 'Excited to announce a new internship opportunity at Google! Apply before July 15.',
    createdAt: '2025-06-28',
    likes: 12,
    comments: [
      { id: 1, user: 'Student: Rahul', text: 'Thank you for sharing!' }
    ]
  },
  {
    id: 2,
    author: { name: 'TPO: Mr. Verma', role: 'tpo' },
    content: 'Campus placement drive for Infosys on July 10. Register now!',
    createdAt: '2025-06-27',
    likes: 8,
    comments: []
  }
];

const PostFeed = () => {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">Alumni & TPO Posts</h2>
      {mockPosts.length === 0 ? (
        <div className="text-center text-gray-500">No posts yet.</div>
      ) : (
        <div className="space-y-6">
          {mockPosts.map(post => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostFeed;
