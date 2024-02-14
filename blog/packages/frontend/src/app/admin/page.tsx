'use client'
import { LIST_NOTES } from '@/graphql/queries'
import { ListNotesQuery } from '@/types/gql/graphql'
import { useQuery } from '@apollo/client'
import { Button } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'

/*
todo list out blog posts with edit and delete buttons
add create button
*/
export default function AdminHome() {
  const { data, loading, error } = useQuery<ListNotesQuery>(LIST_NOTES, {
    fetchPolicy: 'standby'
  })

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  console.log('rerender')

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <span>
      Hello this is where the admin page will be

      </span>
      <Link href="/admin/create">
        <Button color='primary' className="mt-4">Create Note</Button>
      </Link>
    </div>
  )
}

// export default async function Page() {
//   const gqlClient = getSsrApolloClient()

//   const results = await gqlClient.query<ListNotesQuery>({
//     query: LIST_NOTES,
//   })

//   const notes = results.data.listNotes as Note[]

//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-col items-center gap-4">
//         {notes.map((note) => (
//           <div key={note.id} className="flex grow p-4 rounded-md bg-stone-600">
//             <h2 className="text-xl">{note.content}</h2>
//           </div>
//         ))}
//       </div>
//     </>
//   )
// }
