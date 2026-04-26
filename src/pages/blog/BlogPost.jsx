import { Link, Navigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { blogPosts } from './blogData';
import './BlogLayout.css';

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find((item) => item.slug === slug);

  useEffect(() => {
    if (!post) return;

    document.title = `${post.title} | Connexa Blog`;

    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta');
      descriptionMeta.setAttribute('name', 'description');
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.setAttribute('content', post.excerpt);
  }, [post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="blog-page">
      <div className="blog-topbar">
        <Link to="/blog">← Back to Blog</Link>
        <a href="/#tickets" className="blog-buy-ticket">Buy Ticket</a>
      </div>

      <div className="blog-container">
        <article className="blog-article">
          <h1 className="blog-heading">{post.title}</h1>
          <p>{post.intro}</p>

          <h2>Key points</h2>
          <ul>
            {post.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          <p>{post.closing}</p>

          <div className="blog-cta-row">
            <a className="blog-cta" href="/#tickets">Secure Your Ticket Now</a>
            <Link className="blog-cta blog-cta-secondary" to="/">Join Connexa Today</Link>
          </div>
        </article>
      </div>
    </div>
  );
}
