import { DynamoDB } from 'aws-sdk'
import { Table } from 'sst/node/table'
import { Post, UpdatePostInput } from './Post'

const dynamoDb = new DynamoDB.DocumentClient()

export default async function updatePost(updatePostInput: UpdatePostInput): Promise<Post> {
  const params = {
    Key: { id: updatePostInput.id },
    ReturnValues: 'UPDATED_NEW',
    UpdateExpression: 'SET content = :content, title = :title',
    // @ts-ignore
    TableName: Table.blogPosts.tableName,
    ExpressionAttributeValues: {
      ':content': updatePostInput.content,
      ':title': updatePostInput.title,
    },
  }

  await dynamoDb.update(params).promise()

  return updatePostInput as Post
}
