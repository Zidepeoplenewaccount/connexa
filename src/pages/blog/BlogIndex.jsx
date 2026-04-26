import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { blogPosts } from './blogData';
import './BlogLayout.css';

export default function BlogIndex() {
  useEffect(() => {
    document.title = 'Connexa Blog | Lagos Events, Networking and Growth Tips';
  }, []);

  return (
    <div className="blog-page">
      <div className="blog-topbar">
        <Link to="/">← Back to Connexa</Link>
        <a href="/#tickets" className="blog-buy-ticket">Buy Ticket</a>
      </div>

      <div className="blog-container">
        <h1 className="blog-heading">Connexa Blog: Events in Lagos, Nigeria</h1>
        <p className="blog-subtext">
          Discover practical guides for networking events in Lagos, business events in Nigeria, and how to get more results from conferences and entrepreneurship events.
        </p>

        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.slug} className="blog-card">
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <Link className="blog-link" to={`/blog/${post.slug}`}>
                Read article
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
