import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoppingItem } from '../types/ShoppingItem';

const STORAGE_KEY = '@lista_compras_items';

export async function loadItems(): Promise<ShoppingItem[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function saveItems(items: ShoppingItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // silently fail
  }
}
