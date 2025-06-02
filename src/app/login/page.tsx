'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError('Failed to sign in. Check your email or password.');
      console.error('Email/Password Sign-In Error:', err.code, err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');

    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Google Sign-In Error:', err.code, err.message);
      setError('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-purple-800 p-40">
      <h1 className="text-3xl font-bold mb-2">Sign in</h1>
      <p className="mb-6 text-center">Enter your email and password to access your journal</p>

      <form
        onSubmit={handleSignIn}
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

        <div className="mb-4 flex justify-between items-center">
          <div className="w-full">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 mb-2 bg-purple-700 text-white font-semibold rounded-md transition ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-800'
          }`}
        >
          {isLoading ? 'Loading...' : 'Sign in with Email'}
        </button> */}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
        >
          {isLoading ? 'Loading...' : 'Sign in with Google'}
        </button>
      </form>

      <footer>
        <p className="b-0 p-20  m-20 text-sm text-purple-400">© 2025 Personal Journal App</p>
      </footer>
    </div>
  );
}