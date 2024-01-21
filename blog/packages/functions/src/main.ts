import Note from "./graphql/Note";
import listNotes from "./graphql/listNotes";
import createNote from "./graphql/createNote";
import updateNote from "./graphql/updateNote";
import deleteNote from "./graphql/deleteNote";
import getNoteById from "./graphql/getNoteById";

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    note: Note;
    noteId: string;
  };
};

export async function handler(
  event: AppSyncEvent,
  context: any
): Promise<Record<string, unknown>[] | Note | string | null | undefined> {
  // console.log("event", event);

  // console.log("####!!!!!! event.info.fieldName", event.info.fieldName);
  // console.log('event', event)
  // console.log(`typeof context`, typeof context);
  // console.log(`context`, context);

  switch (event.info.fieldName) {
    case "listNotes":
      return await listNotes();
    case "createNote":
      return await createNote(event.arguments.note);
    case "updateNote":
      return await updateNote(event.arguments.note);
    case "deleteNote":
      return await deleteNote(event.arguments.noteId);
    case "getNoteById":
      return await getNoteById(event.arguments.noteId);
    default:
      return null;
  }
}
