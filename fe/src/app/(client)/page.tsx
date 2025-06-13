'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import NewsCard from '@/component/NewsCard';
import { SidebarClient } from '@/component/SidebarClient';

interface Post {
  id: number;
  title: string;
  content: string;
  thumbnail: string;
  timePublish: Date;
  category: {
    name: string;
    slug: string;
  };
  author: {
    name: string;
  };
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/posts/list')
      .then((response) => {
        console.log('API response:', response.data);

        const data = response.data?.data || response.data || [];

        const mappedPosts: Post[] = data.map((post: any) => ({
          id: post.id,
          title: post.title,
          content: post.content,
          thumbnail: post.thumbnail
            ? `http://localhost:8080${post.thumbnail}`
            : '/images/default-thumbnail.jpg',
          timePublish: post.timePublish ? new Date(post.timePublish) : new Date(),
          category: {
            name: post.category?.name || 'Chuyên mục',
            slug: post.category?.slug || 'chuyen-muc',
          },
          author: {
            name: post.author?.name || 'Tác giả',
          },
        }));

        setPosts(mappedPosts);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy dữ liệu:', error);
      });
  }, []);

  const featuredPost = posts[0];
  const hotPosts = posts.slice(1, 3);
  const latestPosts = posts.slice(3);
  // Loại bỏ tất cả thẻ HTML trước khi lấy 100 ký tự
  const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Nội dung chính */}
        <div className="lg:col-span-3 space-y-10">
          {/* Tin nổi bật */}
          {featuredPost && (
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-primary">Tin nổi bật</h2>
              <NewsCard
                post={{
                  id: featuredPost.id,
                  title: featuredPost.title,
                  excerpt: featuredPost.content?.substring(0, 100) ?? '',
                  featuredImage: featuredPost.thumbnail,
                  publishedAt: featuredPost.timePublish,
                  author: featuredPost.author,
                  category: featuredPost.category,
                }}
              />
            </section>
          )}

          {/* Tin hot */}
          {hotPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-red-500">Tin hot</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hotPosts.map((post) => (
                  <NewsCard
                    key={post.id}
                    post={{
                      id: post.id,
                      title: post.title,
                      excerpt: post.content ? stripHtml(post.content).substring(0, 100) + '...' : '',
                      featuredImage: post.thumbnail,
                      publishedAt: post.timePublish,
                      author: post.author,
                      category: post.category,
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Tin mới nhất */}
          {latestPosts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-green-600">Tin mới nhất</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestPosts.map((post) => (
                  <NewsCard
                    key={post.id}
                    post={{
                      id: post.id,
                      title: post.title,
                      excerpt: post.content ? stripHtml(post.content).substring(0, 100) + '...' : '',
                      featuredImage: post.thumbnail,
                      publishedAt: post.timePublish,
                      author: post.author,
                      category: post.category,
                    }}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <SidebarClient />
        </aside>
      </div>
    </div>
  );
}
