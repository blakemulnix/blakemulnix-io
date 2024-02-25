'use client'
import { useMutation } from '@apollo/client'
import React from 'react'
import { DELETE_POST } from '@/graphql/queries'
import { DeletePostMutation, ListPostsQuery } from '@/types/gql/graphql'
import { Button, Link } from '@nextui-org/react'

type Post = NonNullable<ListPostsQuery['listPosts']>[0]

export default function PostPreview({ post, refetch }: { post: Post, refetch: () => any }): JSX.Element {
  const [deletePost, { loading, called, error }] = useMutation<DeletePostMutation>(DELETE_POST)

  const handleDelete = async () => {
    try {
      await deletePost({
        variables: {
          postId: post!.id,
        },
      })

      refetch()
    } catch (error) {
      console.error('error:', error)
    }
  }

  return (
    <div className="flex items-center justify-between gap-x-2 w-full p-4 border border-gray-200 rounded-md">
      <div>
        <h2 className="text-xl font-bold">{post?.title}</h2>
        <p className="text-stone-400 line-clamp-3">{post?.content}</p>
      </div>
      <div className="flex flex-row gap-x-3">
        {/* <Link href={`/admin/edit/${post?.id}`}> */}
        <Button color="primary" size="sm" isDisabled>
          Edit
        </Button>
        <Button color="danger" size="sm" onClick={handleDelete} isLoading={loading}>
          Delete
        </Button>
      </div>
    </div>
  )
}
