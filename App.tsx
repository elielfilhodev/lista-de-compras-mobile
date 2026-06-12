import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { ShoppingItem } from './types/ShoppingItem';
import { loadItems, saveItems } from './utils/storage';
import AddItemForm from './components/AddItemForm';
import ItemList from './components/ItemList';
import SummaryModal from './components/SummaryModal';

export default function App() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [summaryVisible, setSummaryVisible] = useState(false);

  // Load persisted items on mount
  useEffect(() => {
    loadItems().then(setItems);
  }, []);

  // Persist whenever items change
  useEffect(() => {
    saveItems(items);
  }, [items]);

  const total = items
    .filter((i) => i.checked && i.unitPrice !== null)
    .reduce((sum, i) => sum + (i.unitPrice ?? 0) * i.quantity, 0);

  const handleAdd = useCallback((item: ShoppingItem) => {
    setItems((prev) => [item, ...prev]);
  }, []);

  const handleToggle = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  const handlePriceChange = useCallback((id: string, price: number | null) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, unitPrice: price } : item
      )
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#15803d" />

      {/* App Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🛒 Lista de Compras</Text>
          <Text style={styles.headerSubtitle}>
            {items.length} {items.length === 1 ? 'item' : 'itens'} •{' '}
            {checkedCount} {checkedCount === 1 ? 'marcado' : 'marcados'}
          </Text>
        </View>
        {total > 0 && (
          <View style={styles.totalBadge}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
          </View>
        )}
      </View>

      {/* Add form */}
      <AddItemForm onAdd={handleAdd} />

      {/* Divider */}
      <View style={styles.sectionLabel}>
        <Text style={styles.sectionText}>Itens da lista</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={() => setItems([])} activeOpacity={0.7}>
            <Text style={styles.clearText}>Limpar tudo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      <View style={styles.listContainer}>
        <ItemList
          items={items}
          onToggle={handleToggle}
          onPriceChange={handlePriceChange}
          onDelete={handleDelete}
        />
      </View>

      {/* Finalizar Compra button */}
      {items.length > 0 && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.finalizeBtn}
            onPress={() => setSummaryVisible(true)}
            activeOpacity={0.85}
          >
            <Text style={styles.finalizeBtnText}>✅  Finalizar Compra</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Summary Modal */}
      <SummaryModal
        visible={summaryVisible}
        items={items}
        onClose={() => setSummaryVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#15803d',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#bbf7d0',
    marginTop: 3,
  },
  totalBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 11,
    color: '#dcfce7',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  sectionLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 6,
  },
  sectionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  clearText: {
    fontSize: 13,
    color: '#ef4444',
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  finalizeBtn: {
    backgroundColor: '#15803d',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#15803d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  finalizeBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: 0.3,
  },
});
