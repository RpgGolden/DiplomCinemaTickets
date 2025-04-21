import React from "react";
import { MaterialReactTable } from "material-react-table";
import { Button } from "@mui/material";
import {
  Trash2,
  Pencil,
  FileUp,
  EyeIcon,
  EyeClosed,
} from "lucide-react";
import styles from "./UniversalTable.module.scss";
import { exportUniversalExcel } from "../../utils/Function";

const UniversalTable = ({
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  editingMode,
  addMode,
  statusMode,
  onStatus,
}) => {
  const isRequestPage = window.location.pathname === "/adminPage/request";

  return (
    <div className={styles.table}>
      <div className={styles.ButtonTop}>
        {addMode && (
          <Button variant="contained" color="primary" onClick={onAdd}>
            Добавить
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={() => exportUniversalExcel(columns, data)}
        >
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
          enableRowActions={!isRequestPage}
          muiTablePaperProps={{
            sx: { overflow: "auto" }, // важно, чтобы работал sticky
          }}
          initialState={{
            columnPinning: {
              left: ["mrt-row-actions", "mrt-row-select", "id", ], // селектор и id слева
            },
          }}
          renderRowActions={
            !isRequestPage
              ? ({ row }) => (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {editingMode && (
                      <Button onClick={() => onEdit(row.original)}>
                        <Pencil />
                      </Button>
                    )}
                    <Button
                      color="error"
                      onClick={() => onDelete(row.original.id)}
                    >
                      <Trash2 />
                    </Button>
                    {statusMode && (
                      <Button onClick={() => onStatus(row.original)}>
                        {row.original.status === true ? (
                          <EyeIcon />
                        ) : (
                          <EyeClosed />
                        )}
                      </Button>
                    )}
                  </div>
                )
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default UniversalTable;
