import React from "react";
import { atom, arrayAtom, runInAction, observe } from "@dhmk/atom";
import { nanoid } from "nanoid";
import * as t from "types";

const StoreContext = React.createContext<t.Store>(undefined!);

export const withStore = (C: React.ComponentType) => () =>
  React.createElement(
    StoreContext.Provider,
    { value: store },
    React.createElement(C)
  );

export const useStore = () => React.useContext(StoreContext);

const createTodos = (initial: ReadonlyArray<t.SerializedTodo>) => {
  const createTodo = ({ id = nanoid(), text, isCompleted = false }) => {
    const todo = {
      id,
      text: atom(text),
      isCompleted: atom(isCompleted),

      edit(text) {
        runInAction(() => todo.text.set(text));
      },

      toggle() {
        runInAction(() => todo.isCompleted.set(!todo.isCompleted()));
      },
    };

    return todo;
  };

  const todos = arrayAtom<t.Todo>(initial.map(createTodo));

  const self: t.TodosStore = {
    todos,

    add(text) {
      runInAction(() => todos.append(createTodo({ text })));
    },

    move(id, refId) {
      runInAction(() => {
        const old = todos();
        const next = old.slice();
        const idi = next.findIndex((x) => x.id === id);
        const refIdi = next.findIndex((x) => x.id === refId);
        next.splice(refIdi, 0, next.splice(idi, 1)[0]);

        todos.set(next);
      });
    },

    remove(id) {
      runInAction(() => todos.remove((x) => x.id === id));
    },
  };

  return self;
};

const todos = JSON.parse(localStorage.getItem("todos")!) || [];

export const store: t.Store = {
  todos: createTodos(todos),
};

observe(() => {
  localStorage.setItem("todos", JSON.stringify(store.todos.todos()));
});
