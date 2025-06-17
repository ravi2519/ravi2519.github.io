import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Placeholder components
const Home = () => (
  <section style={{
    padding: '2rem',
    minHeight: '70vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  }}>
    <h1>Ravi Ranjan</h1>
    <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Fullstack Java Developer | Cloud, AI & Microservices Enthusiast | Tech Architect in the Making</p>
    <p style={{ maxWidth: 600, margin: '1.5rem 0' }}>
      I am a passionate software engineer with deep expertise in Java, microservices, AI, and cloud-native technologies. As a Java Certified Developer, I thrive on building scalable solutions using modern stacks like Spring Boot, Docker, Kubernetes (AKS/GKE), and cloud platforms such as Azure, AWS.<br /><br />
      I love collaborating on event-driven architectures, DevOps, AI-driven applications, and open-source projects. My interests also span algorithms, data structures, and continuous learning.<br /><br />
      Beyond the world of code, I am an amateur badminton player who finds joy and discipline on the court, and an avid reader who believes in the power of books to inspire, challenge, and transform. Whether it's a gripping novel or a thought-provoking non-fiction, I am always eager to explore new ideas and stories.<br /><br />
      Currently, I am focused on cloud, AI, container orchestration, and architecting robust backend systems.<br /><br />
      <strong>Let's connect and build something amazing—on the cloud, on the court, or through the pages of a great book!</strong>
    </p>
    <div style={{ margin: '1.5rem 0' }}>
      <a href="https://github.com/ravi2519" target="_blank" rel="noopener noreferrer">GitHub</a> |{' '}
      <a href="https://linkedin.com/in/ravi-ranjan-5073b910" target="_blank" rel="noopener noreferrer">LinkedIn</a> |{' '}
      <a href="https://stackoverflow.com/users/2263351/ravi-ranjan" target="_blank" rel="noopener noreferrer">Stack Overflow</a> |{' '}
      <Link to="/cv">CV</Link> |{' '}
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
      const res = await fetch('https://formspree.io/f/xdoqzqzq', {
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
        const proxy = 'https://api.allorigins.win/get?url=' + encodeURIComponent(rssUrl);
        const res = await fetch(proxy);
        if (!res.ok) throw new Error('Failed to fetch books');
        const data = await res.json();
        const parser = new window.DOMParser();
        const xml = parser.parseFromString(data.contents, 'text/xml');
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
        setError('Could not load books from Goodreads. Instead check my Goodreads profile: <a href="https://www.goodreads.com/user/show/13048149-ravi-ranjan" target="_blank" rel="noopener noreferrer">My Goodreads Profile</a>');
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem',
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
  <section style={{ padding: '2rem' }}>
    <h2>My CV</h2>
    <p>CV PDF will be embedded here.</p>
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
  const [theme, setTheme] = useState('light');

  React.useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <nav style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eee' }}>
        <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.2rem', marginRight: '2rem' }}>Ravi Ranjan</Link>
        <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
        <Link to="/books" style={{ marginRight: '1rem' }}>Books</Link>
        <Link to="/contact" style={{ marginRight: '1rem' }}>Contact</Link>
        <Link to="/cv" style={{ marginRight: '1rem' }}>CV</Link>
        <a href="https://blog.ravir.in" target="_blank" rel="noopener noreferrer" style={{ marginRight: '1rem' }}>Blog</a>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/books" element={<Books />} />
          <Route path="/cv" element={<CV />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
