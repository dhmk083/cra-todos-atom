import { Atom } from "@dhmk/atom";

export type Id = string;

export type Todo = {
  id: Id;
  text: Atom<string>;
  isCompleted: Atom<boolean>;

  edit(text: string);
  toggle();
};

export type SerializedTodo = {
  id: Id;
  text: string;
  isCompleted: boolean;
};

export type TodosStore = {
  todos: Atom<ReadonlyArray<Todo>>;

  add(text: string);
  move(id: Id, refId: Id);
  remove(id: Id);
};

export type Store = {
  todos: TodosStore;
};
