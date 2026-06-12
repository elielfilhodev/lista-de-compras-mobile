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

interface AddItemFormProps {
  onAdd: (item: ShoppingItem) => void;
}

export default function AddItemForm({ onAdd }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');

  function handleAdd() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Atenção', 'Digite o nome do produto.');
      return;
    }
    const qty = parseInt(quantity, 10);
    if (!qty || qty < 1) {
      Alert.alert('Atenção', 'A quantidade deve ser pelo menos 1.');
      return;
    }

    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: trimmedName,
      quantity: qty,
      unitPrice: null,
      checked: false,
    };

    onAdd(newItem);
    setName('');
    setQuantity('1');
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.nameInput]}
          placeholder="Nome do produto"
          placeholderTextColor="#9ca3af"
          value={name}
          onChangeText={setName}
          returnKeyType="next"
          onSubmitEditing={handleAdd}
        />
        <TextInput
          style={[styles.input, styles.qtyInput]}
          placeholder="Qtd"
          placeholderTextColor="#9ca3af"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAdd} activeOpacity={0.8}>
        <Text style={styles.buttonText}>+ Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: '#111827',
  },
  nameInput: {
    flex: 1,
  },
  qtyInput: {
    width: 70,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
});
