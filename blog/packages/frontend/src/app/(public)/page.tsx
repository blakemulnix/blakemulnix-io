import React from 'react'
import { getSsrApolloClient } from '@/graphql/ssrClient'
import { LIST_NOTES } from '@/graphql/queries'
import { ListNotesQuery, Note } from '@/types/gql/graphql'
import { Navbar } from '@nextui-org/react'



export default async function Page() {
  const gqlClient = getSsrApolloClient()

  const results = await gqlClient.query<ListNotesQuery>({
    query: LIST_NOTES,
  })

  const notes = results.data.listNotes as Note[]

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center gap-4">
        {notes.map((note) => (
          <div key={note.id} className="flex grow p-4 rounded-md bg-stone-600">
            <h2 className="text-xl">{note.content}</h2>
          </div>
        ))}
      </div>
    </>
  )
}
