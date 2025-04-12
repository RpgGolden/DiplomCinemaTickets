import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

// Универсальная функция экспорта
export const exportUniversalExcel = (columns, data, filename = "exported_table") => {
  if (!columns?.length || !data?.length) {
    console.warn("Нет данных для экспорта");
    return;
  }

  // Преобразуем данные под заголовки
  const transformedData = data.map((row) => {
    const newRow = {};
    columns.forEach((col) => {
      const accessor = col.accessorKey;
      const header = col.header;
      newRow[header] = row[accessor] ?? "";
    });
    return newRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(transformedData);

  // Устанавливаем ширину колонок автоматически
  const columnWidths = transformedData.reduce((widths, row) => {
    Object.values(row).forEach((val, i) => {
      const length = val?.toString()?.length || 10;
      widths[i] = Math.max(widths[i] || 10, length);
    });
    return widths;
  }, []);

  worksheet["!cols"] = columnWidths.map((w) => ({ wch: w + 5 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const now = new Date();
  const formattedDate = now
    .toLocaleString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(/(\d+)\.(\d+)\.(\d+), (\d+):(\d+)/, "$3.$2.$1_$4-$5");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `${filename}_${formattedDate}.xlsx`);
};
