import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { ShoppingItem } from '../types/ShoppingItem';

export async function exportToPdf(items: ShoppingItem[]): Promise<void> {
  const checkedItems = items.filter((i) => i.checked && i.unitPrice !== null);

  const total = checkedItems.reduce(
    (sum, item) => sum + (item.unitPrice ?? 0) * item.quantity,
    0
  );

  const rows = checkedItems
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td style="text-align:center">${item.quantity}</td>
        <td style="text-align:right">R$ ${(item.unitPrice ?? 0).toFixed(2)}</td>
        <td style="text-align:right">R$ ${((item.unitPrice ?? 0) * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          margin: 40px;
          color: #1a1a2e;
        }
        h1 {
          text-align: center;
          font-size: 26px;
          color: #16a34a;
          margin-bottom: 4px;
        }
        p.subtitle {
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 28px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        thead tr {
          background-color: #16a34a;
          color: white;
        }
        thead th {
          padding: 10px 14px;
          text-align: left;
          font-weight: 600;
        }
        thead th:nth-child(2) { text-align: center; }
        thead th:nth-child(3), thead th:nth-child(4) { text-align: right; }
        tbody tr:nth-child(even) { background-color: #f9fafb; }
        tbody td {
          padding: 9px 14px;
          border-bottom: 1px solid #e5e7eb;
        }
        .total-row td {
          font-weight: 700;
          font-size: 15px;
          background-color: #dcfce7;
          padding: 11px 14px;
          border-top: 2px solid #16a34a;
        }
        .total-row td:last-child { text-align: right; }
        .footer {
          text-align: center;
          margin-top: 32px;
          font-size: 11px;
          color: #9ca3af;
        }
      </style>
    </head>
    <body>
      <h1>🛒 Lista de Compras</h1>
      <p class="subtitle">Gerado em ${new Date().toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'long', year: 'numeric',
      })}</p>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Qtd</th>
            <th>Valor Unit.</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr class="total-row">
            <td colspan="3">Total Geral</td>
            <td>R$ ${total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <p class="footer">Lista de Compras App</p>
    </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Exportar Lista de Compras',
      UTI: 'com.adobe.pdf',
    });
  }
}
