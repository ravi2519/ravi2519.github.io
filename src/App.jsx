import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css'

// Placeholder components
const Home = () => (
  <section
    style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '3rem 1rem',
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      textAlign: 'left',
    }}
  >
    <h1 style={{ fontWeight: 700, fontSize: '2.5rem', marginBottom: '1.5rem' }}>Ravi Ranjan</h1>
    <p style={{ fontWeight: 'bold', fontSize: '1.15rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
      Fullstack Java Developer | Cloud, AI & Microservices Enthusiast | Tech Architect in the Making
    </p>
    <p style={{ marginBottom: '1.2rem', lineHeight: 1.7 }}>
      I am a passionate software engineer with deep expertise in Java, microservices, AI, and cloud-native technologies. As a Java Certified Developer, I thrive on building scalable solutions using modern stacks like Spring Boot, Docker, Kubernetes (AKS/GKE), and cloud platforms such as Azure, AWS.
    </p>
    <p style={{ marginBottom: '1.2rem', lineHeight: 1.7 }}>
      I love collaborating on event-driven architectures, DevOps, AI-driven applications, and open-source projects. My interests also span algorithms, data structures, and continuous learning.
    </p>
    <p style={{ marginBottom: '1.2rem', lineHeight: 1.7 }}>
      Beyond the world of code, I am an amateur badminton player who finds joy and discipline on the court, and an avid reader who believes in the power of books to inspire, challenge, and transform. Whether it's a gripping novel or a thought-provoking non-fiction, I am always eager to explore new ideas and stories.
    </p>
    <p style={{ marginBottom: '1.2rem', lineHeight: 1.7 }}>
      Currently, I am focused on cloud, AI, container orchestration, and architecting robust backend systems.
    </p>
    <p style={{ fontWeight: 600, marginTop: '2rem' }}>
      Let's connect and build something amazing—on the cloud, on the court, or through the pages of a great book!
    </p>
    <div style={{ marginTop: '2rem' }}>
      <a href="https://blog.ravir.in" target="_blank" rel="noopener noreferrer">Blog</a>
    </div>
  </section>
);

const Contact = () => {
  const [form, setForm] = React.useState({ name: '', email: '', message: '' });
  const [status, setStatus] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const res = await fetch('https://formspree.io/f/xgvyzowg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      if (res.ok) {
        setStatus('Message sent! I will get back to you soon.');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('Something went wrong. Please try again later.');
      }
    } catch (err) {
      setStatus('Something went wrong. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <section style={{ padding: '2rem' }}>
      <h2>Contact Me</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          required
        />
        <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
        {status && <div style={{ color: status.startsWith('Message') ? 'green' : 'red' }}>{status}</div>}
      </form>
    </section>
  );
};

const Books = () => {
  const [books, setBooks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      setError(null);
      try {
        // Use a public CORS proxy to fetch the RSS feed (since Goodreads blocks direct browser requests)
        const rssUrl = 'https://www.goodreads.com/review/list_rss/13048149?shelf=read';
        const proxy = 'https://corsproxy.io/?' + encodeURIComponent(rssUrl);
        const res = await fetch(proxy);
        if (!res.ok) throw new Error('Failed to fetch books');
        const xmlText = await res.text();
        const parser = new window.DOMParser();
        const xml = parser.parseFromString(xmlText, 'text/xml');
        const items = Array.from(xml.querySelectorAll('item'));
        const booksData = items.map(item => ({
          title: item.querySelector('title')?.textContent || '',
          author: item.querySelector('author_name')?.textContent || '',
          link: item.querySelector('link')?.textContent || '',
          cover: item.querySelector('book_large_image_url')?.textContent || '',
          description: item.querySelector('description')?.textContent || '',
        }));
        setBooks(booksData);
      } catch (err) {
        setError('Could not load books from Goodreads. Instead check my Goodreads profile: My Goodreads Profile');
      }
      setLoading(false);
    }
    fetchBooks();
  }, []);

  if (loading) return <section style={{ padding: '2rem' }}><h2>Books I've Read</h2><p>Loading...</p></section>;
  if (error) return <section style={{ padding: '2rem' }}><h2>Books I've Read</h2><p style={{ color: 'red' }}>{error}</p></section>;

  return (
    <section style={{ padding: '2rem' }}>
      <h2>Books I've Read</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem',
        width: '100%',
      }}>
        {books.map((book, idx) => (
          <div key={idx} style={{
            background: 'var(--nav-bg)',
            border: '1px solid var(--nav-border)',
            borderRadius: 8,
            padding: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: 300,
          }}>
            {book.cover && <img src={book.cover} alt={book.title} style={{ width: 100, height: 150, objectFit: 'cover', marginBottom: 12, borderRadius: 4 }} />}
            <a href={book.link} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', color: 'var(--link)', fontSize: '1.05rem', marginBottom: 6 }}>{book.title}</a>
            <div style={{ color: 'var(--text)', fontSize: '0.95rem', marginBottom: 8 }}>by {book.author}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

const CV = () => (
  <section
    style={{
      maxWidth: '700px',
      margin: '0 auto',
      padding: '3rem 1rem',
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
      textAlign: 'left',
    }}
  >
    <section style={{ marginBottom: '2.5rem', width: '100%' }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>Experience</h2>
      <div className="cv-experience-card" tabIndex={0}>
        <div className="cv-job-title">Senior Consultant, Pictet Technologies, Luxembourg</div>
        <div className="cv-job-dates">April 2022 – Present</div>
        <ul>
          <li>Lead design, development, and maintenance of Java applications in master and client data domains.</li>
          <li>Spearheaded AI initiatives, integrating LLM models and delivering POCs for real-time speech translation.</li>
          <li>Established CI/CD pipelines, monitoring, and streamlined Kubernetes operations in collaboration with DevOps.</li>
        </ul>
      </div>
      <div className="cv-experience-card" tabIndex={0}>
        <div className="cv-job-title">Technical Lead, Aureus Tech Systems</div>
        <div className="cv-job-dates">May 2021 – April 2022</div>
        <ul>
          <li>Architected and delivered scalable claims management solutions, reducing manual processes and improving onboarding.</li>
          <li>Implemented queue-based load levelling and refactored validation logic for maintainability and responsiveness.</li>
          <li>Led microservices migration to Kubernetes and automated deployments with GitHub Actions and Azure DevOps.</li>
        </ul>
      </div>
      <div className="cv-experience-card" tabIndex={0}>
        <div className="cv-job-title">Senior Software Engineer, Fidelity Information Services</div>
        <div className="cv-job-dates">Oct 2013 – May 2021</div>
        <ul>
          <li>Delivered customized releases of VIEX ECP, replacing legacy systems and enhancing functionality for major clients.</li>
          <li>Designed RESTful APIs and business services (Spring, Hibernate, Java EE); led migration to modern architectures.</li>
          <li>Developed full-stack SPA apps and automated legacy data migration, improving operational efficiency.</li>
        </ul>
      </div>
      <div className="cv-experience-card" tabIndex={0}>
        <div className="cv-job-title">Technology Analyst, Infosys Ltd</div>
        <div className="cv-job-dates">March 2009 – Nov 2013</div>
        <ul>
          <li>Key contributor to Finacle User Experience (FINUX), developing UI frameworks and backend services.</li>
          <li>Designed and implemented complex UI components and tools for code generation and deployment.</li>
          <li>Developed and maintained REST APIs and ORM layers for banking applications.</li>
        </ul>
      </div>
    </section>
    <section style={{ marginBottom: '2.5rem', width: '100%' }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>Skills</h2>
      <div className="cv-skills-card" tabIndex={0}>
        <ul style={{ margin: 0, paddingLeft: '1.2em', fontSize: '1.05rem', listStyle: 'none' }}>
          <li><span className="cv-skill-category">Languages:</span> HTML5, JSP, Java 11/17/21, Angular 15/17, jQuery, JavaScript, SQL, Perl, ActionScript</li>
          <li><span className="cv-skill-category">Frameworks:</span> Spring Boot, Spring MVC, Hibernate, Flex, Spring Cloud, Spring Security, Spring Data JPA, Spring AI, LangChain4J</li>
          <li><span className="cv-skill-category">Architectures:</span> Layered, Micro-services, Hexagonal</li>
          <li><span className="cv-skill-category">Databases:</span> PostgresSQL, SQLite, MySQL, MSSQL, Oracle</li>
          <li><span className="cv-skill-category">CI/CD:</span> Bamboo, Azure Devops, Github Actions</li>
          <li><span className="cv-skill-category">Kubernetes:</span> Azure Kubernetes Services, Google Kubernetes Engine</li>
          <li><span className="cv-skill-category">Testing Tools:</span> Junit, Qunit, Mockito, Karma, Jasmine</li>
          <li><span className="cv-skill-category">Messaging & Integrations:</span> RMQ, Kafka</li>
          <li><span className="cv-skill-category">AI & Machine Learning:</span> AI coding assistants (Copilot, Amazon Q, Cursor), LLM integration (Spring AI, LangChain), Whisper Speech-to-Text, Spring AI MCP Server</li>
          <li><span className="cv-skill-category">Monitoring & Logging:</span> Prometheus, Grafana, ELK Stack (Elasticsearch, Logstash, Kibana), Sleuth</li>
        </ul>
      </div>
    </section>
  </section>
);

function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      style={{ marginLeft: '1rem' }}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}

function App() {
  const [theme, setTheme] = useState('dark');
  const [menuOpen, setMenuOpen] = useState(false);

  React.useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Close menu on route change (optional, for better UX)
  React.useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener('resize', closeMenu);
    return () => window.removeEventListener('resize', closeMenu);
  }, []);

  return (
    <>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1rem',
        borderBottom: '1px solid #eee',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--nav-bg)',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.2rem', marginRight: '2rem' }}>Ravi Ranjan</Link>
          {/* Burger icon for mobile */}
          <button
            className="burger-menu"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(m => !m)}
          >
            <span role="img" aria-label="menu">☰</span>
          </button>
          {/* Menu links */}
          <div className={`nav-links${menuOpen ? ' open' : ''}`}>
            <Link to="/" style={{ marginRight: '1rem' }} onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/books" style={{ marginRight: '1rem' }} onClick={() => setMenuOpen(false)}>Books</Link>
            <Link to="/experience" style={{ marginRight: '1rem' }} onClick={() => setMenuOpen(false)}>Experience</Link>
            <a href="https://blog.ravir.in" target="_blank" rel="noopener noreferrer" style={{ marginRight: '1rem' }} onClick={() => setMenuOpen(false)}>Blog</a>
            <Link to="/contact" style={{ marginRight: '1rem' }} onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>
        </div>
        {/* Social links and Theme toggle at top right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
          <div className="social-links" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <a href="https://github.com/ravi2519" target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/ravir-in/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
            </a>
            <a href="https://stackoverflow.com/users/414744/ravi-ranjan" target="_blank" rel="noopener noreferrer" aria-label="Stack Overflow" style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.473 20.291v-5.568h1.568v7.136h-15.082v-7.136h1.568v5.568zm-10.227-1.568h7.136v-1.568h-7.136zm9.227-2.568l-7.136-1.568.342-1.527 7.136 1.568zm1.568-3.136l-6.136-3.136.684-1.368 6.136 3.136zm2.136-3.136l-4.568-5.136 1.184-1.056 4.568 5.136z"/></svg>
            </a>
            <a href="https://www.instagram.com/ravi2519" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17" cy="7" r="1.2" fill="currentColor"/></svg>
            </a>
          </div>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/books" element={<Books />} />
          <Route path="/experience" element={<CV />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
