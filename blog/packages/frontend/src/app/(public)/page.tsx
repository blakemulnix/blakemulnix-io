import React from 'react'
import { getSsrApolloClient } from '@/graphql/ssrClient'
import { LIST_NOTES } from '@/graphql/queries'
import { ListNotesQuery, Note } from '@/types/gql/graphql'
import { Navbar } from '@nextui-org/react'

export const dynamic = 'force-dynamic'

const containerClasses = 'flex flex-col items-center gap-4'

export default async function Page() {
  const gqlClient = getSsrApolloClient()

  const results = await gqlClient.query<ListNotesQuery>({
    query: LIST_NOTES,
  })

  const notes = results.data.listNotes as Note[]

  if (notes.length === 0) {
    return (
      <div className={containerClasses}>
        <h1 className='text-xl'>No notes found</h1>
      </div>
    )
  }

  return (
      <div className={containerClasses}>
        {notes.map((note) => (
          <div key={note.id} className="flex grow p-4 rounded-md bg-stone-600">
            <h2 className="text-xl">{note.content}</h2>
          </div>
        ))}
      </div>
  )
}
