// src/app/dashboard/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import EntryForm from '@/components/EntryForm';
import EntryList from '@/components/EntryList';

interface Entry {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        setLoading(false);
        return;
      }
      setUser(user);
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/entries', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setEntries(data);
        }
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading || !user) return <div>Loading...</div>;

  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>My Journal</h1>
      <button onClick={handleLogout} style={{ marginBottom: '20px', padding: '8px 16px', background: '#1a202c', color: 'white', border: 'none' }}>
        Logout
      </button>
      <EntryForm onNewEntry={(entry: Entry) => setEntries([entry, ...entries])} />
      <EntryList entries={entries} onDelete={(id: string) => setEntries(entries.filter(e => e.id !== id))} />
    </div>
  );
}