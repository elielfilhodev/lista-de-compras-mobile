import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ShoppingItem } from '../types/ShoppingItem';
import XLSX from 'xlsx';

export async function exportToExcel(items: ShoppingItem[]): Promise<void> {
  const checkedItems = items.filter((i) => i.checked && i.unitPrice !== null);

  const rows = checkedItems.map((item) => ({
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
  } as any);

  const ws = XLSX.utils.json_to_sheet(rows);

  // Set column widths
  ws['!cols'] = [{ wch: 25 }, { wch: 12 }, { wch: 20 }, { wch: 15 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Lista de Compras');

  const base64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

  const uri = `${FileSystem.cacheDirectory}lista_compras.xlsx`;
  await FileSystem.writeAsStringAsync(uri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Exportar Lista de Compras',
    });
  }
}
