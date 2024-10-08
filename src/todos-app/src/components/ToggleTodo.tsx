import React from "react";
import { Checkbox, Tooltip } from "@mui/material";
import { useToggleIsDoneTodoTaskMutation } from "../services/todoApi";
import { useDispatch } from "react-redux";
import { AlertSeverity } from "../redux/enums/AlertSeverity";
import { toggleIsDone, errorCaught } from "../redux/todosSlice";

interface ToggleTodoProps {
  todoTaskId?: number;
  isDone?: boolean;
}

const ToggleTodo: React.FC<ToggleTodoProps> = ({ todoTaskId, isDone }) => {
  const dispatch = useDispatch();
  const [toggleIsDoneTodoTask] = useToggleIsDoneTodoTaskMutation();

  const handleToggle = async () => {
    if (!todoTaskId) return;
    try {
      await toggleIsDoneTodoTask(todoTaskId).unwrap();
      dispatch(
        toggleIsDone({
          message: "TODO has been successfully changed",
          alertSeverity: AlertSeverity.Success,
        }),
      );
    } catch (err) {
      dispatch(
        errorCaught({
          message: "Failed to change TODO",
          alertSeverity: AlertSeverity.Error,
        }),
      );
    }
  };

  return (
    <Tooltip title={isDone ? "Undo" : "Mark as done"} placement="left">
      <Checkbox checked={isDone} onChange={handleToggle} />
    </Tooltip>
  );
};

export default ToggleTodo;
