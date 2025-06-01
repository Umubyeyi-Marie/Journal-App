import Link from 'next/link';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-purple-800">
      
      <header className="flex justify-between items-center px-6 py-4 border-b border-purple-200 shadow-sm">
        <h1 className="text-2xl font-bold">Personal Journal</h1>
        <Link href="/login">
          <button className="text-purple-800 text-base border border-purple-800 px-4 py-1 rounded hover:bg-purple-100">
            Sign In
          </button>
        </Link>
      </header>

      
      <main className="flex-grow flex flex-col items-center text-center px-4 py-12">
        <h2 className="text-4xl font-semibold mb-4">About Personal Journal</h2>
        <p className="mb-8 max-w-md text-lg">
          A private space for your thoughts, memories, and reflections.
        </p>

        
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
          {[
            {
              emoji: '✍️',
              title: 'Write',
              desc: 'Capture your thoughts, ideas, and memories in a clean interface.',
            },
            {
              emoji: '📖',
              title: 'Reflect',
              desc: 'Review past entries to see how you’ve grown and changed over time.',
            },
            {
              emoji: '🔒',
              title: 'Private',
              desc: 'Your entries are private and secure, accessible only to you.',
            },
          ].map(({ emoji, title, desc }, i) => (
            <div
              key={i}
              className="bg-purple-50 p-6 border border-purple-200 rounded-lg shadow-sm w-72"
            >
              <p className="text-3xl mb-2">{emoji}</p>
              <h3 className="text-xl font-semibold mb-1">{title}</h3>
              <p className="text-sm text-purple-700">{desc}</p>
            </div>
          ))}
        </div>

        
        <Link href="/login">
          <button className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800 transition">
            Start Journaling
          </button>
        </Link>
      </main>

      
      <footer className="text-center text-sm text-purple-400 py-4 mb-8">
        © 2025 Personal Journal App
      </footer>
    </div>
  );
}
