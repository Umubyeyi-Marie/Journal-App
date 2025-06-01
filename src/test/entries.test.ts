// __tests__/entries.test.ts
import { render, screen, waitFor } from '@testing-library/react';
import { auth } from '@/lib/firebase';
import { fireEvent } from '@testing-library/react';
import EntryForm from '@/components/EntryForm';
import EntryList from '@/components/EntryList';
import { adminDb } from '@/lib/firebaseAdmin';

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  auth: {
    currentUser: {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    },
  },
}));

// Mock adminDb
jest.mock('@/lib/firebaseAdmin', () => ({
  adminDb: {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({ exists: true, data: jest.fn().mockReturn({ userId: 'user123' }) }),
    delete: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('Journal Entry Tests', () => {
  // Mock fetch
  beforeEach(() => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ id: '1', title: 'Test', body: 'Test body', createdAt: new Date().toISOString() }]) }) // GET
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: '2', title: 'New', body: 'New body', createdAt: new Date().toISOString() }) }) // POST
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ message: 'Entry deleted' }) }); // DELETE
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders EntryForm and submits a new entry', async () => {
    const mockOnNewEntry = jest.fn();
    render(<EntryForm onNewEntry={mockOnNewEntry} />);

    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'New Entry' } });
    fireEvent.change(screen.getByPlaceholderText('Write your thoughts...'), { target: { value: 'New content' } });
    fireEvent.click(screen.getByText('Add Entry'));

    await waitFor(() => {
      expect(mockOnNewEntry).toHaveBeenCalledWith({
        id: '2',
        title: 'New Entry',
        body: 'New content',
        createdAt: expect.any(String),
      });
      expect(fetch).toHaveBeenCalledWith('/api/entries', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer mock-token' }),
      }));
    });
  });

  test('renders EntryList and deletes an entry', async () => {
    const mockOnDelete = jest.fn();
    render(<EntryList entries={[{ id: '1', title: 'Test', body: 'Test body', createdAt: new Date().toISOString() }]} onDelete={mockOnDelete} />);

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('1');
      expect(fetch).toHaveBeenCalledWith('/api/entries/1', expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({ Authorization: 'Bearer mock-token' }),
      }));
    });
  });

  test('API GET route fetches user entries', async () => {
    const mockReq = { headers: { get: () => 'Bearer mock-token' } } as unknown as NextRequest;
    const { GET } = await import('@/app/api/entries/route');
    const response = await GET(mockReq as NextRequest);

    await waitFor(() => {
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual([{ id: '1', title: 'Test', body: 'Test body', createdAt: expect.any(String) }]);
    });
  });

  test('API DELETE route handles unauthorized access', async () => {
    const mockReq = { headers: { get: () => 'Bearer invalid-token' } } as unknown as NextRequest;
    jest.spyOn(adminDb.collection('entries').doc(), 'get').mockResolvedValueOnce({ exists: false });
    const { DELETE } = await import('@/app/api/entries/[id]/route');
    const response = await DELETE(mockReq, { params: { id: '1' } });

    await waitFor(() => {
      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: 'Not found' });
    });
  });
});