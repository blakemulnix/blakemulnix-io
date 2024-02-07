import { CREATE_NOTE, LIST_NOTES } from "@/graphql/queries";
import { getSsrApolloClient } from "@/graphql/ssrClient";
import React from "react";

export default async function Page() {
  const { data } = await getSsrApolloClient().query({
    query: LIST_NOTES,
  });

  let error;
  try {
    const { data } = await getSsrApolloClient().mutate({
      mutation: CREATE_NOTE,
      variables: {
        title: "test",
        content: "test",
      },
    });
  } catch (e) {
    error = e;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      Server side rendering
      <div>
        <h1>Notes</h1>
        {data.listNotes.map((note: any) => (
          <div key={note.id}>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
      <h1>Mutation</h1>
      <div>{JSON.stringify(error)}</div>
    </div>
  );
}
