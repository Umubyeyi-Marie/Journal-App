// src/components/EntryList.tsx
'use client';
import { auth } from '@/lib/firebase';

interface Entry {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

interface EntryListProps {
  entries: Entry[];
  onDelete: (id: string) => void;
}

export default function EntryList({ entries, onDelete }: EntryListProps) {
  const handleDelete = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        onDelete(id);
      } else {
        console.error('Failed to delete entry:', response.status);
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div>
      {entries.map((entry) => (
        <div key={entry.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <h3>{entry.title}</h3>
          <p>{entry.body}</p>
          <p><small>{new Date(entry.createdAt).toLocaleString()}</small></p>
          <button onClick={() => handleDelete(entry.id)} style={{ padding: '5px 10px', background: '#ef4444', color: 'white', border: 'none' }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}