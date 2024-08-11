import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useGetTodoTasksQuery, useToggleIsDoneTodoTaskMutation, useDeleteTodoTaskMutation } from '../services/todoApi';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Checkbox from '@mui/material/Checkbox';
import { FilterTodoTasksViewModel } from '../interfaces/FilterTodoTasksViewModel';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import EditTodoModal from './EditTodoModal';

interface TodosGridProps {
  isDone?: boolean;
  sortBy?: string;
  sortDirection?: string;
  deadlineTo?: Date;
}

const TodosGrid: React.FC<TodosGridProps> = ({ isDone, sortBy, sortDirection, deadlineTo }) => {



  const [isEditTodoModalOpen, setIsEditTodoModalOpen] = useState(false);
  const [selectedTodoTaskId, setSelectedTodoTaskId] = useState<number | null>(null);

  const handleOpenEditTodoModal = (todoTaskId: number) => {
    setSelectedTodoTaskId(todoTaskId);
    setIsEditTodoModalOpen(true);
  };

  const handleCloseEditTodoModal = () => {
    setSelectedTodoTaskId(null);
    setIsEditTodoModalOpen(false);
  };

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const filter: FilterTodoTasksViewModel = {
    pageNumber: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    isDone: isDone,
    deadlineFrom: undefined,
    deadlineTo: deadlineTo ? deadlineTo.toISOString() : undefined,
    todoTaskName: undefined,
    sortBy: sortBy ? sortBy : "TodoTaskId",
    sortDirection: sortDirection,
  };

  const { data: todos = { items: [], pageIndex: 0, totalPages: 0 }, error, isLoading, refetch } = useGetTodoTasksQuery(filter);
  const [toggleIsDoneTodoTask] = useToggleIsDoneTodoTaskMutation();
  const [deleteTodoTask] = useDeleteTodoTaskMutation();

  const rowCountRef = useRef(todos.totalPages * paginationModel.pageSize || 0);

  const rowCount = useMemo(() => {
    if (todos.totalPages !== undefined) {
      rowCountRef.current = todos.totalPages * paginationModel.pageSize;
    }
    return rowCountRef.current;
  }, [todos.totalPages, paginationModel.pageSize]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleToggle = async (id: number) => {
    try {
      await toggleIsDoneTodoTask(id).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to toggle todo', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodoTask(id).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to delete todo', err);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'isDone',
      headerName: ' ',
      width: 150,
      renderCell: (params) => (
        <div>
          <Checkbox checked={params.value} onChange={() => handleToggle(params.row.todoTaskId)} />
        </div>
      ),
    },
    { field: 'todoTaskName', headerName: 'Todo', width: 530 },
    {
      field: 'deadline',
      headerName: 'Deadline',
      width: 200,
      valueGetter: (params) => {
        const date = params ? new Date(params) : null;
        return date ? format(date, 'Pp', { locale: de }) : 'No';
      },
    },
    {
      field: 'actions',
      headerName: ' ',
      width: 200,
      renderCell: (params) => (
        <div>
          <Button variant="text" color="primary" onClick={() => handleOpenEditTodoModal(params.row.todoTaskId)}>
            <EditIcon />
          </Button>
          <Button variant="text" color="primary" onClick={() => handleDelete(params.row.todoTaskId)}>
            <DeleteForeverIcon />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.toString()}</div>;
  }

  return (
    <>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={todos.items}
          columns={columns}
          getRowId={(row) => row.todoTaskId}
          rowCount={rowCount}
          loading={isLoading}
          pageSizeOptions={[5, 10, 15]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          disableRowSelectionOnClick
        />
      </div>
      
      {selectedTodoTaskId !== null && (
        <EditTodoModal
          isOpen={isEditTodoModalOpen}
          handleClose={handleCloseEditTodoModal}
          todoTaskId={selectedTodoTaskId} // Pass the selected task ID to the modal
        />
      )}
    </>
  );
};

export default TodosGrid;
