import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { ShoppingItem } from '../types/ShoppingItem';

interface ItemRowProps {
  item: ShoppingItem;
  onToggle: (id: string) => void;
  onPriceChange: (id: string, price: number | null) => void;
  onDelete: (id: string) => void;
}

export default function ItemRow({ item, onToggle, onPriceChange, onDelete }: ItemRowProps) {
  const [priceInput, setPriceInput] = useState(
    item.unitPrice !== null ? item.unitPrice.toFixed(2) : ''
  );

  const subtotal =
    item.checked && item.unitPrice !== null
      ? item.unitPrice * item.quantity
      : null;

  function handlePriceBlur() {
    const parsed = parseFloat(priceInput.replace(',', '.'));
    if (!isNaN(parsed) && parsed >= 0) {
      onPriceChange(item.id, parsed);
    } else {
      onPriceChange(item.id, null);
      setPriceInput('');
    }
  }

  function handleDelete() {
    Alert.alert('Excluir item', `Remover "${item.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => onDelete(item.id),
      },
    ]);
  }

  return (
    <View style={[styles.container, item.checked && styles.containerChecked]}>
      {/* Checkbox + name row */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={[styles.checkbox, item.checked && styles.checkboxChecked]}
          onPress={() => onToggle(item.id)}
          activeOpacity={0.7}
        >
          {item.checked && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>

        <View style={styles.nameContainer}>
          <Text
            style={[styles.name, item.checked && styles.nameChecked]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={styles.quantity}>Qtd: {item.quantity}</Text>
        </View>

        {subtotal !== null && (
          <Text style={styles.subtotal}>R$ {subtotal.toFixed(2)}</Text>
        )}

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.7}>
          <Text style={styles.deleteIcon}>🗑</Text>
        </TouchableOpacity>
      </View>

      {/* Inline price input when checked */}
      {item.checked && (
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Valor unitário (R$):</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="0,00"
            placeholderTextColor="#9ca3af"
            value={priceInput}
            onChangeText={setPriceInput}
            keyboardType="numeric"
            returnKeyType="done"
            onBlur={handlePriceBlur}
            onSubmitEditing={handlePriceBlur}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: '#f3f4f6',
  },
  containerChecked: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    opacity: 0.9,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  checkboxChecked: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  nameChecked: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  quantity: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  subtotal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#16a34a',
    minWidth: 80,
    textAlign: 'right',
  },
  deleteBtn: {
    padding: 4,
  },
  deleteIcon: {
    fontSize: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#d1fae5',
    gap: 10,
  },
  priceLabel: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
  },
  priceInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#16a34a',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 15,
    color: '#111827',
    width: 110,
    textAlign: 'right',
  },
});
