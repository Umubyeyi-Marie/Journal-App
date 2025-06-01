// src/components/EntryForm.tsx
'use client';
import { useState } from 'react';
import { auth } from '@/lib/firebase';

interface Entry {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

interface EntryFormProps {
  onNewEntry: (entry: Entry) => void;
}

export default function EntryForm({ onNewEntry }: EntryFormProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, body }),
      });
      if (response.ok) {
        const newEntry = await response.json();
        onNewEntry(newEntry);
        setTitle('');
        setBody('');
      }
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
        style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your thoughts..."
        required
        style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px', height: '100px' }}
      />
      <button type="submit" style={{ padding: '8px 16px', background: '#1a202c', color: 'white', border: 'none' }}>Add Entry</button>
    </form>
  );
}