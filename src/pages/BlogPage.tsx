import { sitePath } from '../routing/sitePath';
import { blogPosts, type BlogPost } from '../content/blogPosts';

export function BlogPage({ post }: { post?: BlogPost }) {
  if (post) {
    return (
      <article className="portfolio-page portfolio-frame blog-page" aria-labelledby="blog-title">
        <nav className="portfolio-cell blog-back" aria-label="Blog navigation">
          <a href={sitePath('/blog')}>← All posts</a>
        </nav>
        <header className="portfolio-row portfolio-cell blog-article-header">
          <h1 id="blog-title" className="page-main-heading">{post.title}</h1>
          <p>{post.summary}</p>
        </header>
        {post.sections.map(({ heading, text }) => (
          <section className="portfolio-row portfolio-cell blog-prose" key={heading}>
            <h2 className="portfolio-section-heading">{heading}</h2>
            <p>{text}</p>
          </section>
        ))}
        <div className="portfolio-row portfolio-cell blog-project-link">
          <a href={sitePath(`/projects/${post.project.slug}`)}>{post.project.name} case study ↗</a>
        </div>
      </article>
    );
  }

  return (
    <div className="portfolio-page portfolio-frame blog-page">
      <header className="portfolio-cell">
        <h1 className="page-main-heading">Blog</h1>
      </header>
      {blogPosts.map((entry) => (
        <article className="portfolio-row portfolio-cell blog-entry" key={entry.slug}>
          <p className="blog-category">{entry.project.category}</p>
          <h2 className="portfolio-section-heading">
            <a href={sitePath(`/blog/${entry.slug}`)}>{entry.title} <span aria-hidden="true">↗</span></a>
          </h2>
          <p>{entry.summary}</p>
        </article>
      ))}
    </div>
  );
}
