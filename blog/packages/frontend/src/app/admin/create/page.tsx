'use client'
import { CREATE_NOTE } from '@/graphql/queries'
import { CreateNoteMutation } from '@/types/gql/graphql'
import { useMutation } from '@apollo/client'
import { Button, Input, Textarea } from '@nextui-org/react'
import React from 'react'

export default function Create() {
  const [id, setId] = React.useState('')
  const [content, setContent] = React.useState('')

  const [createNote] = useMutation<CreateNoteMutation>(CREATE_NOTE)

  const handleCreateNote = async () => {
    try {
      await createNote({
        variables: {
          note: {
            id,
            content,
          },
        },
      })
    } catch (error) {
      console.error('error:', error)
    }
  }

  return (
    <div className="flex flex-row justify-center">
      {/* refactor this to container */}
      <div className="flex flex-col max-w-[1280px] grow px-6 gap-4"> 
        <div className="flex flex-col">
          <h1 className='text-2xl mb-6'>Create a New Note</h1>
          <Input label="ID" value={id} onValueChange={setId} size='lg' className='max-w-xs mb-4' />
          <Textarea label="Content" value={content} size='lg' onValueChange={setContent} className='max-w-2xl mb-4' />
          <Button color='primary' className="w-fit" onClick={handleCreateNote}>Create Note</Button>
        </div>
      </div>
    </div>
  )
}
