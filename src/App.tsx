import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useInput } from "@dhmk/react";
import { observer } from "@dhmk/atom-react";
import { useStore, withStore } from "store";
import * as t from "types";

export default withStore(() => {
  const { todos, move } = useStore().todos;

  const handleDrop = ({ source, destination }) => {
    if (source?.index === destination?.index || !destination) return;

    move(todos()[source.index].id, todos()[destination.index].id);
  };

  return (
    <DragDropContext onDragEnd={handleDrop}>
      <div style={{ padding: "1em" }}>
        <h1>Todos</h1>

        <AddTodo />

        <h3>Your tasks:</h3>

        <Droppable droppableId="todos">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <TodosList />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
});

const TodosList = observer(() => (
  <>
    {useStore()
      .todos.todos()
      .map((x, i) => (
        <Todo key={x.id} todo={x} index={i} />
      ))}
  </>
));

function AddTodo() {
  const { add } = useStore().todos;
  const input = useInput();

  return (
    <input
      {...input}
      onKeyPress={(ev) => {
        if (ev.key === "Enter") {
          add(input.value);
          input.onChange({ target: { value: "" } });
        }
      }}
      placeholder="Write something..."
    />
  );
}

const Todo = observer(({ todo, index }: { todo: t.Todo; index: number }) => {
  const { remove } = useStore().todos;
  const { id, isCompleted, toggle } = todo;

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div
            style={{
              textDecoration: isCompleted() ? "line-through" : "none",
              color: isCompleted() ? "lightgray" : "inherit",
            }}
          >
            <input
              type="checkbox"
              checked={isCompleted()}
              onChange={() => toggle()}
            />

            <TodoEditor todo={todo} />

            <button onClick={() => remove(id)} style={{ marginLeft: "1em" }}>
              x
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
});

const TodoEditor = observer(({ todo }: { todo: t.Todo }) => {
  const { text, edit } = todo;

  const [isEditing, setEditing] = React.useState(false);
  const input = useInput(text());

  return isEditing ? (
    <input
      {...input}
      autoFocus
      onBlur={() => {
        edit(input.value);
        setEditing(false);
      }}
    />
  ) : (
    <span onDoubleClick={() => setEditing(true)}>{text()}</span>
  );
});
