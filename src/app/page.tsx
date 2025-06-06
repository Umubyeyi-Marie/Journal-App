import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center space-y-6 p-70 ">
      <h1 className="text-4xl font-bold text-purple-800 ">Your Personal Journal</h1>
      <p className="text-xl text-gray-500 text-center">
        A simple space to capture your thoughts, memories, and reflections.
      </p>
      <div className="flex space-x-4">
        <Link href="/login">
          <button className="px-6 py-2 rounded-lg border border-purple-800 text-purple-800 hover:bg-purple-100">
            Get Started
          </button>
        </Link>
        <Link href="/about">
          <button className="px-6 py-2 rounded-lg bg-purple-800 text-white hover:bg-purple-700">
            Learn More
          </button>
        </Link>
          
    </div>
      <footer className="text-center text-sm text-purple-400 m-60">
        © 2025 Personal Journal App
      </footer>
  
    </div>
  );
}
