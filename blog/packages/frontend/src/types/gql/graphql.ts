/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Mutation = {
  __typename?: 'Mutation';
  createNote?: Maybe<Note>;
  deleteNote?: Maybe<Scalars['String']['output']>;
  updateNote?: Maybe<Note>;
};


export type MutationCreateNoteArgs = {
  note: NoteInput;
};


export type MutationDeleteNoteArgs = {
  noteId: Scalars['String']['input'];
};


export type MutationUpdateNoteArgs = {
  note: UpdateNoteInput;
};

export type Note = {
  __typename?: 'Note';
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type NoteInput = {
  content: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  getNoteById?: Maybe<Note>;
  listNotes?: Maybe<Array<Maybe<Note>>>;
};


export type QueryGetNoteByIdArgs = {
  noteId: Scalars['String']['input'];
};

export type UpdateNoteInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

export type ListNotesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListNotesQuery = { __typename?: 'Query', listNotes?: Array<{ __typename?: 'Note', id: string, content: string } | null> | null };

export type CreateNoteMutationVariables = Exact<{
  note: NoteInput;
}>;


export type CreateNoteMutation = { __typename?: 'Mutation', createNote?: { __typename?: 'Note', id: string, content: string } | null };


export const ListNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"listNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"listNotes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]} as unknown as DocumentNode<ListNotesQuery, ListNotesQueryVariables>;
export const CreateNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"note"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"note"},"value":{"kind":"Variable","name":{"kind":"Name","value":"note"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]} as unknown as DocumentNode<CreateNoteMutation, CreateNoteMutationVariables>;