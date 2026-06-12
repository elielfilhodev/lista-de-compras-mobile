import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ShoppingItem } from '../types/ShoppingItem';
import { exportToExcel } from '../utils/exportExcel';
import { exportToPdf } from '../utils/exportPdf';

interface SummaryModalProps {
  visible: boolean;
  items: ShoppingItem[];
  onClose: () => void;
}

export default function SummaryModal({ visible, items, onClose }: SummaryModalProps) {
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const checkedItems = items.filter((i) => i.checked && i.unitPrice !== null);
  const total = checkedItems.reduce(
    (sum, item) => sum + (item.unitPrice ?? 0) * item.quantity,
    0
  );

  async function handleExportExcel() {
    setLoadingExcel(true);
    try {
      await exportToExcel(items);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível exportar o Excel.');
    } finally {
      setLoadingExcel(false);
    }
  }

  async function handleExportPdf() {
    setLoadingPdf(true);
    try {
      await exportToPdf(items);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível exportar o PDF.');
    } finally {
      setLoadingPdf(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Resumo da Compra</Text>
            <Text style={styles.headerSubtitle}>{checkedItems.length} itens marcados</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Items table */}
        <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
          {/* Table header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Produto</Text>
            <Text style={[styles.tableHeaderText, styles.colCenter]}>Qtd</Text>
            <Text style={[styles.tableHeaderText, styles.colRight]}>Unit.</Text>
            <Text style={[styles.tableHeaderText, styles.colRight]}>Subtotal</Text>
          </View>

          {checkedItems.length === 0 ? (
            <View style={styles.emptyMsg}>
              <Text style={styles.emptyText}>
                Nenhum item marcado com preço preenchido.
              </Text>
            </View>
          ) : (
            checkedItems.map((item, index) => {
              const subtotal = (item.unitPrice ?? 0) * item.quantity;
              return (
                <View
                  key={item.id}
                  style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
                >
                  <Text style={[styles.tableCell, { flex: 2 }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[styles.tableCell, styles.colCenter]}>{item.quantity}</Text>
                  <Text style={[styles.tableCell, styles.colRight]}>
                    R$ {(item.unitPrice ?? 0).toFixed(2)}
                  </Text>
                  <Text style={[styles.tableCell, styles.colRight, styles.subtotalCell]}>
                    R$ {subtotal.toFixed(2)}
                  </Text>
                </View>
              );
            })
          )}

          {/* Total row */}
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { flex: 2 }]}>Total Geral</Text>
            <Text style={[styles.totalLabel, styles.colCenter]} />
            <Text style={[styles.totalLabel, styles.colRight]} />
            <Text style={[styles.totalValue, styles.colRight]}>R$ {total.toFixed(2)}</Text>
          </View>
        </ScrollView>

        {/* Export buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.exportBtn, styles.excelBtn, loadingExcel && styles.btnDisabled]}
            onPress={handleExportExcel}
            activeOpacity={0.8}
            disabled={loadingExcel || loadingPdf}
          >
            {loadingExcel ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.exportBtnText}>📊  Exportar Excel</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.exportBtn, styles.pdfBtn, loadingPdf && styles.btnDisabled]}
            onPress={handleExportPdf}
            activeOpacity={0.8}
            disabled={loadingExcel || loadingPdf}
          >
            {loadingPdf ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.exportBtnText}>📄  Exportar PDF</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
    marginTop: 12,
    marginHorizontal: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  tableHeaderText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
    minWidth: 60,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  tableRowAlt: {
    backgroundColor: '#f0fdf4',
  },
  tableCell: {
    fontSize: 14,
    color: '#374151',
    minWidth: 60,
  },
  colCenter: {
    textAlign: 'center',
    minWidth: 36,
  },
  colRight: {
    textAlign: 'right',
    minWidth: 80,
  },
  subtotalCell: {
    color: '#16a34a',
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    paddingVertical: 13,
    paddingHorizontal: 12,
    marginTop: 8,
    backgroundColor: '#dcfce7',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#16a34a',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#15803d',
    minWidth: 60,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#15803d',
    minWidth: 80,
  },
  emptyMsg: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  exportBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  excelBtn: {
    backgroundColor: '#16a34a',
  },
  pdfBtn: {
    backgroundColor: '#2563eb',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  exportBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
});
