'use client'
import PostPreview from '@/components/admin/PostPreview'
import { LIST_POSTS } from '@/graphql/queries'
import { ListPostsQuery } from '@/types/gql/graphql'
import { useQuery } from '@apollo/client'
import { Button } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'

export default function Page(): JSX.Element {
  const { data, loading, error, refetch } = useQuery<ListPostsQuery>(LIST_POSTS)

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-row justify-between mb-4">
        <h1 className="text-3xl">Posts</h1>
        <Link href="/admin/create">
          <Button color="primary" size="md">
            Create Post
          </Button>
        </Link>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div>There as an error loading the blog posts.</div>}
      {!loading && !error && data?.listPosts?.length === 0 && <div>No posts found</div>}
      <div className='flex flex-col gap-4'>
        {data?.listPosts?.map((post, idx) => (
          <PostPreview key={idx} post={post} refetch={refetch} />
        ))}
      </div>
    </div>
  )
}
