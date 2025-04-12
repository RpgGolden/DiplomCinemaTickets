import React from "react";
import { MaterialReactTable } from "material-react-table";
import { Button } from "@mui/material";
import { Trash2, Pencil, FileUp } from "lucide-react";
import styles from "./UniversalTable.module.scss";
import { exportUniversalExcel } from "../../utils/Function";

const UniversalTable = ({ columns, data, onAdd, onEdit, onDelete, editingMode, addMode }) => {
  return (
    <div className={styles.table}>
        <div className={styles.ButtonTop}>
          {
            addMode && <Button variant="contained" color="primary" onClick={onAdd}>
              Добавить
            </Button>
          }
          <Button variant="contained" color="primary" onClick={() => exportUniversalExcel(columns, data)}>
            Экспорт <FileUp />
          </Button>
        </div>
        <div className={styles.tableContainer}>
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
      </div>
  );
};

export default UniversalTable;
