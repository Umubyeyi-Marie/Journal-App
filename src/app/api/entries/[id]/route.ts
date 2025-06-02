// src/app/api/entries/[id]/route.ts

import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    // TODO: Replace with your actual delete logic, e.g., database call
    console.log(`Deleting entry with ID: ${id}`);

    // Simulate success response
    return NextResponse.json({ message: `Entry ${id} deleted successfully.` }, { status: 200 });
  } catch (error) {
    console.error('Error deleting entry:', error);
    return NextResponse.json({ error: 'Failed to delete entry.' }, { status: 500 });
  }
}
