import { gql as graphql } from '@apollo/client';

export const LIST_NOTES = graphql(`
  query listNotes {
    listNotes {
      id
      content
    }
  }
`);

export const CREATE_NOTE = graphql(`
  mutation CreateNote($note: NoteInput!) {
    createNote(note: $note) {
      id
      content
    }
  }
`);