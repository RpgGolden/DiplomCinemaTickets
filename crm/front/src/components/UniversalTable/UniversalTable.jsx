import React from "react";
import { MaterialReactTable } from "material-react-table";
import { Button } from "@mui/material";
import { Trash2, Pencil } from "lucide-react";
import styles from "./UniversalTable.module.scss";

const UniversalTable = ({ columns, data, onAdd, onEdit, onDelete, editingMode }) => {
  return (
    <div className={styles.table}>
        <div className={styles.ButtonTop}>
          <Button variant="contained" color="primary" onClick={onAdd}>
            Добавить
          </Button>
        </div>
          <MaterialReactTable
            columns={columns}
            data={data}
            enablePagination
            enableSorting
            enableRowSelection
            enableRowActions
            renderRowActions={({ row }) => (
              <div>
                {editingMode && <Button onClick={() => onEdit(row.original)}><Pencil /></Button>}
                <Button color="error" onClick={() => onDelete(row.original.id)}>
                  <Trash2 />
                </Button>
              </div>
            )}
          />
      </div>
  );
};

export default UniversalTable;
