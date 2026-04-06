import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

type Slot = 'helm' | 'armor' | 'weapon' | 'shield';

type InventoryItem = {
  id: string;
  quantity: number;
  items: {
    id: string;
    item_name: string;
    description: string;
    image_key: string;
    slot: Slot | null;
  };
};

type Equipment = {
  helm_item_id:   string | null;
  armor_item_id:  string | null;
  weapon_item_id: string | null;
  shield_item_id: string | null;
};

const SLOT_COLUMN: Record<Slot, keyof Equipment> = {
  helm:   'helm_item_id',
  armor:  'armor_item_id',
  weapon: 'weapon_item_id',
  shield: 'shield_item_id',
};

const ITEM_IMAGES: Record<string, any> = {
  novice_sword:  require('../assets/Knight/Sword/novice_sword.png'),
  novice_shield: require('../assets/Knight/Shield/novice_shield.png'),
  novice_armor:  require('../assets/Knight/Armor/novice_armor.png'),
};

export default function InventoryScreen() {
  const navigation = useNavigation();
  const { character } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!character) return;
    const [invRes, eqRes] = await Promise.all([
      supabase
        .from('inventory')
        .select('id, quantity, items(id, item_name, description, image_key, slot)')
        .eq('character_id', character.id)
        .order('created_at'),
      supabase
        .from('equipment')
        .select('helm_item_id, armor_item_id, weapon_item_id, shield_item_id')
        .eq('character_id', character.id)
        .single(),
    ]);
    setInventory((invRes.data as any) ?? []);
    setEquipment(eqRes.data ?? null);
    setLoading(false);
  }, [character]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function toggleEquip(invItem: InventoryItem) {
    if (!character || !equipment) return;
    const { slot } = invItem.items;
    if (!slot) return;

    const col = SLOT_COLUMN[slot];
    const isEquipped = equipment[col] === invItem.items.id;
    const newValue = isEquipped ? null : invItem.items.id;

    setTogglingId(invItem.id);
    await supabase
      .from('equipment')
      .update({ [col]: newValue })
      .eq('character_id', character.id);

    setEquipment(prev => prev ? { ...prev, [col]: newValue } : prev);
    setTogglingId(null);
  }

  function isEquipped(item: InventoryItem['items']): boolean {
    if (!equipment || !item.slot) return false;
    return equipment[SLOT_COLUMN[item.slot]] === item.id;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>INVENTORY</Text>
        <View style={styles.backBtn} />
      </View>
      <View style={styles.divider} />

      {loading ? (
        <ActivityIndicator color="#c9933a" style={{ marginTop: 40 }} />
      ) : inventory.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>🎒</Text>
          <Text style={styles.emptyText}>Your inventory is empty.</Text>
          <Text style={styles.emptySubtext}>Items you find on your journey will appear here.</Text>
        </View>
      ) : (
        <FlatList
          data={inventory}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => {
            const img = item.items?.image_key ? ITEM_IMAGES[item.items.image_key] : null;
            const equipped = isEquipped(item.items);
            const hasSlot = !!item.items?.slot;
            const toggling = togglingId === item.id;

            return (
              <View style={styles.itemRow}>
                <View style={[styles.itemImageBox, equipped && styles.itemImageBoxEquipped]}>
                  {img ? (
                    <Image source={img} style={styles.itemImage} resizeMode="contain" />
                  ) : (
                    <Text style={styles.itemImagePlaceholder}>?</Text>
                  )}
                </View>

                <View style={styles.itemInfo}>
                  <View style={styles.itemNameRow}>
                    <Text style={styles.itemName}>{item.items?.item_name}</Text>
                    {equipped && (
                      <View style={styles.equippedBadge}>
                        <Text style={styles.equippedBadgeText}>EQUIPPED</Text>
                      </View>
                    )}
                  </View>
                  {item.items?.slot && (
                    <Text style={styles.itemSlot}>{item.items.slot.toUpperCase()}</Text>
                  )}
                  {item.items?.description ? (
                    <Text style={styles.itemDesc}>{item.items.description}</Text>
                  ) : null}
                </View>

                <View style={styles.rightCol}>
                  <View style={styles.quantityBadge}>
                    <Text style={styles.quantityText}>x{item.quantity}</Text>
                  </View>
                  {hasSlot && (
                    <TouchableOpacity
                      style={[styles.equipBtn, equipped && styles.unequipBtn]}
                      onPress={() => toggleEquip(item)}
                      disabled={toggling}
                      activeOpacity={0.75}
                    >
                      {toggling ? (
                        <ActivityIndicator size="small" color="#c9933a" />
                      ) : (
                        <Text style={[styles.equipBtnText, equipped && styles.unequipBtnText]}>
                          {equipped ? 'UNEQUIP' : 'EQUIP'}
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0e05',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
  },
  backText: {
    color: '#c9933a',
    fontSize: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#c9933a',
    letterSpacing: 4,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#3a2410',
    marginBottom: 16,
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    color: '#c8b090',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#7a5c35',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  separator: {
    height: 1,
    backgroundColor: '#2e1a06',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#20130a',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  itemImageBox: {
    width: 52,
    height: 52,
    backgroundColor: '#2e1a06',
    borderWidth: 1,
    borderColor: '#4a3318',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemImageBoxEquipped: {
    borderColor: '#c9933a',
    backgroundColor: '#3d2209',
  },
  itemImage: {
    width: 44,
    height: 44,
  },
  itemImagePlaceholder: {
    fontSize: 22,
    color: '#4a3318',
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  itemName: {
    color: '#c8b090',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  equippedBadge: {
    backgroundColor: '#3d2209',
    borderWidth: 1,
    borderColor: '#c9933a',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 2,
  },
  equippedBadgeText: {
    color: '#c9933a',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  itemSlot: {
    color: '#7a5c35',
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 3,
  },
  itemDesc: {
    color: '#7a5c35',
    fontSize: 11,
    fontStyle: 'italic',
    lineHeight: 15,
  },
  rightCol: {
    alignItems: 'center',
    gap: 6,
  },
  quantityBadge: {
    borderWidth: 1,
    borderColor: '#4a3318',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
    backgroundColor: '#2e1a06',
  },
  quantityText: {
    color: '#c9933a',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  equipBtn: {
    borderWidth: 1,
    borderColor: '#c9933a',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 2,
    backgroundColor: '#2e1a06',
    minWidth: 70,
    alignItems: 'center',
  },
  unequipBtn: {
    borderColor: '#7a5c35',
    backgroundColor: '#1a0e05',
  },
  equipBtnText: {
    color: '#c9933a',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  unequipBtnText: {
    color: '#7a5c35',
  },
});
