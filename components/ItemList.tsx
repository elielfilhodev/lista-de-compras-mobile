import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { ShoppingItem } from '../types/ShoppingItem';
import ItemRow from './ItemRow';

interface ItemListProps {
  items: ShoppingItem[];
  onToggle: (id: string) => void;
  onPriceChange: (id: string, price: number | null) => void;
  onDelete: (id: string) => void;
}

export default function ItemList({ items, onToggle, onPriceChange, onDelete }: ItemListProps) {
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>Lista vazia</Text>
        <Text style={styles.emptySubtitle}>Adicione produtos acima para começar</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ItemRow
          item={item}
          onToggle={onToggle}
          onPriceChange={onPriceChange}
          onDelete={onDelete}
        />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 120,
    paddingTop: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});
