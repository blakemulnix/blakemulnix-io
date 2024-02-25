"use client";
import React from "react";
import { CREATE_POST, LIST_POSTS } from "@/graphql/queries";
import { useMutation, useQuery } from "@apollo/client/react";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@nextui-org/react";

if (process.env.NODE_ENV === "development") {
  loadDevMessages();
  loadErrorMessages();
}

export default function GraphqlData() {
  const { data: notesResponse, loading } = useQuery(LIST_POSTS);

  const [createNote, { data: mutationResponse }] = useMutation(CREATE_POST, {
    variables: {
      note: {
        id: uuidv4(),
        content: `This is a new note ${uuidv4()}`,
      },
    },
  });

  const handleCreateNote = () => {
    createNote();
  };

  console.log(mutationResponse);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Button onClick={handleCreateNote}>Create Note</Button>
      {notesResponse && notesResponse.listNotes.map((note: any) => (
        <div key={note.id}>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
}