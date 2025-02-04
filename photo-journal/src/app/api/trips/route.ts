import { NextResponse } from 'next/server';
import { faker } from '@faker-js/faker';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;

  const fakeData = Array.from({ length: 5 }, () => ({
    id: faker.string.uuid(),
    name: faker.hacker.phrase(),
    date: faker.date.past(),
    location: faker.location.state()

  }))
  

  return NextResponse.json(fakeData);
}