import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';

// UI component for main post content
export default function PostContent({ post }) {
  const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();

  return (
    <div className="card">
      <h1>{post?.title}</h1>
      <span className="text-sm">
        Written by{' '}
        <Link href={`/${post.username}/`}>
          <a className="text-info">@{post.username}</a>
        </Link>{' '}
        on  { moment(createdAt.toISOString()).fromNow()}
      </span>
      <ReactMarkdown>{post?.content}</ReactMarkdown>
    </div>
  );
}