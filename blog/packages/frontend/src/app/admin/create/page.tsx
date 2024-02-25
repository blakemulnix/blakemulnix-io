'use client'
import { CREATE_POST } from '@/graphql/queries'
import { CreatePostMutation } from '@/types/gql/graphql'
import { useMutation } from '@apollo/client'
import { Button, Input, Textarea } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Create() {
  const router = useRouter()
  const [title, setTitle] = React.useState('')
  const [content, setContent] = React.useState('')

  const [createPost, { loading, called, error }] = useMutation<CreatePostMutation>(CREATE_POST)

  const handleCreatePost = async () => {
    try {
      await createPost({
        variables: {
          createPostInput: {
            title,
            content,
          },
        },
      })
      router.push('/admin')
    } catch (error) {
      console.error('error:', error)
    }
  }

  return (
    <div className="flex flex-row w-full">
      <div className="flex flex-col basis-4/6">
        <h1 className="text-2xl mb-6">Create a New Post</h1>
        <Input label="Title" value={title} onValueChange={setTitle} size="lg" className="max-w-xs mb-4" />
        <Textarea label="Content" value={content} size="lg" onValueChange={setContent} className="max-w-2xl mb-4" />
        <Button color="primary" className="w-fit" onClick={handleCreatePost} isLoading={loading}>
          Create Post
        </Button>
        {error && <div>There was an error creating the post.</div>}
      </div>
    </div>
  )
}
