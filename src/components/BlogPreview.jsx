import { Link } from 'react-router-dom';
import { blogPosts } from '../pages/blog/blogData';
import './BlogPreview.css';

export default function BlogPreview() {
  return (
    <section className="blog-preview section" id="blog">
      <div className="container">
        <div className="blog-preview-header reveal">
          <div className="section-tag">Connexa Blog</div>
          <h2 className="section-title">Lagos Event Guides and Networking Tips</h2>
          <p>
            Learn how to get more from networking events in Lagos, business events in Nigeria, and entrepreneurship events that can help you grow.
          </p>
        </div>

        <div className="blog-preview-grid reveal">
          {blogPosts.map((post) => (
            <article className="blog-preview-card" key={post.slug}>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div className="blog-preview-actions">
                <Link to={`/blog/${post.slug}`}>Read Post</Link>
                <a href="/#tickets">Buy Ticket</a>
              </div>
            </article>
          ))}
        </div>

        <div className="blog-preview-footer reveal">
          <Link to="/blog" className="blog-preview-all">View all posts</Link>
        </div>
      </div>
    </section>
  );
}
