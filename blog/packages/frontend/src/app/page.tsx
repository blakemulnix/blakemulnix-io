import React from "react";
import { gql, createHttpLink, ApolloClient, InMemoryCache } from '@apollo/client';

export const dynamic = "force-dynamic"

const GRAPHQL_API_ID = process.env.GRAPHQL_API_ID || 'default_value';
const GRAPHQL_API_KEY = process.env.GRAPHQL_API_KEY || 'default_value';
const GRAPHQL_API_URL = process.env.GRAPHQL_API_URL || 'default_value';

const LIST_NOTES = gql`
  query {
    listNotes {
      id
      content
    }
  }
`;

const CREATE_NOTE = gql`
  mutation CreateNote($note: NoteInput!) {
    createNote(note: $note) {
      id
      content
    }
  }
`;

export default async function Home() {
  const client = new ApolloClient({
    link: createHttpLink({
      uri: GRAPHQL_API_URL,
      headers: {
        'x-api-key': GRAPHQL_API_KEY,
        'x-api-id': GRAPHQL_API_ID
      },
    }),
    cache: new InMemoryCache(),
  });

  const randomNumber = Math.floor(Math.random() * 100) + 1;
  const randomString = Math.random().toString(36).substr(2, 8);

  const newNoteInput = {
    id: randomNumber,
    content: randomString,
  };

  await client.mutate({
    mutation: CREATE_NOTE,
    variables: {
      note: newNoteInput,
    },
  });

  const { data } = await client.query({
    query: LIST_NOTES,
  });

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-stone-800 mb-4">Coming Soon!</h1>
        <p className="text-stone-600 mb-8">Stay tuned!</p>
        <p className="text-stone-600 mb-8">apiUrl: {GRAPHQL_API_URL}</p>
        <p className="text-stone-600 mb-8">listNotes(): {JSON.stringify(data)}</p>
      </div>
    </main>
  );
}
