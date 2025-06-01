'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to sign in with Google');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-purple-800 px-4">
      <h1 className="text-3xl font-bold mb-2">Sign in</h1>
      <p className="mb-6 text-center">Enter your email and password to access your journal</p>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-purple-50 p-6 rounded-lg shadow-md text-left"
      >
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-purple-700 text-white font-semibold rounded-md hover:bg-purple-800 transition"
        >
          Sign in
        </button>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full mt-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-6 h-6"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.3h-19v7.4h11.2c-1 5-5.6 8.6-11.2 8.6-6.7 0-12.1-5.4-12.1-12.1s5.4-12.1 12.1-12.1c3.1 0 5.9 1.2 8 3.2l5.7-5.7c-3.5-3.3-8-5.3-13.7-5.3-11 0-20 8.9-20 20s9 20 20 20c11 0 19.9-9 19.9-20 0-1.3-.2-2.7-.6-3.9z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.9c1.8-3.7 5.6-6.2 10-6.2 3.1 0 5.9 1.2 8 3.2l5.7-5.7c-3.5-3.3-8-5.3-13.7-5.3-6.7 0-12.1 3.9-16.6 9.1z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.7 0 10.7-2 14.2-5.3l-6.5-5.5c-2.1 1.9-4.9 3.2-7.7 3.2-5.5 0-10.1-3.6-11.8-8.6l-6.7 5.2c3.8 7.4 11.7 11 18.5 11z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Sign in with Google
        </button>
      </form>

      <footer>
        <p className="mb-8 p-6 text-sm text-purple-400">© 2025 Personal Journal App</p>
      </footer>
    </div>
  );
}
