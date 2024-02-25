import React from 'react'
import { getSsrApolloClient } from '@/graphql/ssrClient'
import { LIST_POSTS } from '@/graphql/queries'
import { ListPostsQuery, Post } from '@/types/gql/graphql'
import { Navbar } from '@nextui-org/react'

export const dynamic = 'force-dynamic'

const postPreview = (post: Post) => (
  <div className="flex flex-col gap-y-2 w-full p-4 max-w-2xl border border-gray-200 rounded-md">
    <h2 className="text-xl font-bold">{post?.title}</h2>
    <p className="text-stone-400 line-clamp-2">{post?.content}</p>
  </div>
)

export default async function Page() {
  const gqlClient = getSsrApolloClient()

  const results = await gqlClient.query<ListPostsQuery>({
    query: LIST_POSTS,
  })

  const posts = results.data.listPosts as Post[]

  if (posts.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl">No posts found</h1>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl">Posts</h1>
      {posts.map((post) => postPreview(post))}
    </div>
  )
}
