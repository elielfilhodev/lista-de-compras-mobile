import { File, Paths, EncodingType } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ShoppingItem } from '../types/ShoppingItem';
import XLSX from 'xlsx';

export async function exportToExcel(items: ShoppingItem[]): Promise<void> {
  const checkedItems = items.filter((i) => i.checked && i.unitPrice !== null);

  const rows: Record<string, string | number>[] = checkedItems.map((item) => ({
    Produto: item.name,
    Quantidade: item.quantity,
    'Valor Unitário (R$)': item.unitPrice ?? 0,
    'Subtotal (R$)': ((item.unitPrice ?? 0) * item.quantity).toFixed(2),
  }));

  const total = checkedItems.reduce(
    (sum, item) => sum + (item.unitPrice ?? 0) * item.quantity,
    0
  );

  rows.push({
    Produto: 'TOTAL',
    Quantidade: '',
    'Valor Unitário (R$)': '',
    'Subtotal (R$)': total.toFixed(2),
  });

  const ws = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  ws['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 20 }, { wch: 15 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Lista de Compras');

  const base64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

  // Use the new expo-file-system v56 File API
  const file = new File(Paths.cache, 'lista_compras.xlsx');
  file.write(base64, { encoding: EncodingType.Base64 });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Exportar Lista de Compras',
    });
  }
}
