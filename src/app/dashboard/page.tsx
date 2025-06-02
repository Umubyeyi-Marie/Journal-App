'use client';
import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [entries, setEntries] = useState<any[]>([]);
  const [newEntryText, setNewEntryText] = useState('');
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login');
      } else {
        fetchEntries();
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchEntries = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'journalEntries'));
      const entriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEntries(entriesData);
    } catch (err) {
      console.error('Error fetching entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handleAddEntry = async () => {
    if (!newEntryText.trim()) return;
    try {
      await addDoc(collection(db, 'journalEntries'), {
        text: newEntryText,
        timestamp: new Date().toISOString(),
        userId: auth.currentUser?.uid,
      });
      setNewEntryText('');
      setShowEntryForm(false);
      await fetchEntries();
    } catch (err) {
      console.error('Error adding entry:', err);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'journalEntries', id));
      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (err) {
      console.error('Error deleting entry:', err);
    }
  };

  if (loading) return <p className="text-purple-800 text-center mt-10">Loading...</p>;

    return (
    <div className="min-h-screen bg-white text-purple-800 px-4 py-6">
      <header className=" bg-purple-700 text-white p-4 t-0 flex justify-between items-center w-auto">
        <h1 className="text-2xl font-bold">Personal Journal</h1>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-purple-800 text-white rounded-md hover:bg-purple-900 transition"
        >
          Sign Out
        </button>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4 mt-6">
          <h2 className="text-xl font-semibold">My Journal</h2>
          <button
            onClick={() => setShowEntryForm(true)}
            className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition flex items-center gap-2"
          >
            <span>+</span> New Entry
          </button>
        </div>

        {showEntryForm && (
          <div className="mb-6 p-4 bg-purple-50 rounded-lg">
            <textarea
              value={newEntryText}
              onChange={(e) => setNewEntryText(e.target.value)}
              placeholder="Write your journal entry..."
              className="w-full p-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleAddEntry}
                className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition"
              >
                Save Entry
              </button>
              <button
                onClick={() => setShowEntryForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {entries.length === 0 ? (
          <p className="text-purple-600">No entries yet. Add one to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-4 bg-white border border-purple-200 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                    <p className="mt-2">{entry.text}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

}