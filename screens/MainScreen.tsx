import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

type Equipment = {
  weapon_item_id: string | null;
  shield_item_id: string | null;
  helm_item_id:   string | null;
  armor_item_id:  string | null;
};

// Maps item id → local image for overlays
const WEAPON_IMAGES: Record<string, any> = {
  // populated via item id at runtime — see weaponImage() below
};

const ITEM_IMAGES: Record<string, any> = {
  novice_sword:  require('../assets/Knight/Sword/novice_sword.png'),
  novice_shield: require('../assets/Knight/Shield/novice_shield.png'),
  novice_armor:  require('../assets/Knight/Armor/novice_armor.png'),
};

const CLASS_IMAGES: Record<string, any> = {
  Knight: require('../assets/Knight/base-knight.png'),
};

const STAT_LABELS: { key: string; label: string }[] = [
  { key: 'strength',         label: 'Strength' },
  { key: 'dexterity',        label: 'Dexterity' },
  { key: 'intelligence',     label: 'Intelligence' },
  { key: 'physical_attack',  label: 'Physical Attack' },
  { key: 'physical_defense', label: 'Physical Defense' },
  { key: 'mentality',        label: 'Mentality' },
];

function getExpToNext(level: number): number | null {
  const table: Record<number, number> = {
    1: 10, 2: 25, 3: 50, 4: 100, 5: 200,
    6: 350, 7: 550, 8: 800, 9: 1100,
  };
  return table[level] ?? null;
}

export default function MainScreen() {
  const { character } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [equipment, setEquipment] = useState<Equipment | null>(null);

  const fetchEquipment = useCallback(async () => {
    if (!character) return;
    const { data } = await supabase
      .from('equipment')
      .select(`
        weapon:weapon_item_id(id, image_key),
        shield:shield_item_id(id, image_key),
        armor:armor_item_id(id, image_key)
      `)
      .eq('character_id', character.id)
      .single();
    setEquipment(data as any);
  }, [character]);

  useFocusEffect(useCallback(() => { fetchEquipment(); }, [fetchEquipment]));

  if (!character) return null;

  const expNeeded = getExpToNext(character.level);
  const armorImageKey = (equipment as any)?.armor?.image_key;
  const image = armorImageKey ? ITEM_IMAGES[armorImageKey] : CLASS_IMAGES[character.class];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Character portrait */}
        <View style={styles.portraitSection}>
          <View style={styles.portraitFrame}>
            {image ? (
              <View style={styles.portraitLayerBox}>
                {/* Knight body behind */}
                <Image source={image} style={styles.portrait} resizeMode="contain" />

                {/* Weapon on top */}
                {(equipment as any)?.weapon?.image_key && (
                  <Image
                    source={ITEM_IMAGES[(equipment as any).weapon.image_key]}
                    style={styles.knightWeaponOverlay}
                    resizeMode="contain"
                  />
                )}

                {/* Shield on top */}
                {(equipment as any)?.shield?.image_key && (
                  <Image
                    source={ITEM_IMAGES[(equipment as any).shield.image_key]}
                    style={styles.knightShieldOverlay}
                    resizeMode="contain"
                  />
                )}
              </View>
            ) : (
              <Text style={styles.portraitPlaceholder}>?</Text>
            )}
          </View>
          <Text style={styles.classLabel}>{character.class.toUpperCase()}</Text>
          <Text style={styles.name}>{character.name}</Text>
          <TouchableOpacity
            style={styles.inventoryBtn}
            onPress={() => navigation.navigate('Inventory')}
            activeOpacity={0.75}
          >
            <Text style={styles.inventoryBtnText}>🎒  INVENTORY</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
        </View>

        {/* Level & XP */}
        <View style={styles.levelBox}>
          <View style={styles.levelRow}>
            <Text style={styles.levelLabel}>LEVEL</Text>
            <Text style={styles.levelValue}>{character.level}</Text>
          </View>
          <Text style={styles.xpText}>
            {expNeeded
              ? `${character.experience} / ${expNeeded} XP`
              : `${character.experience} XP — MAX LEVEL`}
          </Text>
          {expNeeded && (
            <View style={styles.xpBarBg}>
              <View
                style={[
                  styles.xpBarFill,
                  { width: `${Math.min((character.experience / expNeeded) * 100, 100)}%` },
                ]}
              />
            </View>
          )}
        </View>

        {/* Stats */}
        <Text style={styles.sectionTitle}>CHARACTER STATS</Text>
        <View style={styles.statsBox}>
          {STAT_LABELS.map(({ key, label }, i) => (
            <View
              key={key}
              style={[styles.statRow, i < STAT_LABELS.length - 1 && styles.statRowBorder]}
            >
              <Text style={styles.statLabel}>{label}</Text>
              <Text style={styles.statValue}>{(character as any)[key]}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0e05',
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  portraitSection: {
    alignItems: 'center',
    paddingTop: 24,
    marginBottom: 24,
  },
  portraitFrame: {
    width: 160,
    height: 200,
    borderWidth: 2,
    borderColor: '#c9933a',
    backgroundColor: '#20130a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  portraitLayerBox: {
    width: 150,
    height: 190,
  },
  portrait: {
    position: 'absolute',
    width: 150,
    height: 190,
  },
  knightWeaponOverlay: {
    position: 'absolute',
    width: 105,
    height: 105,
    left: 2,
    top: 62,
  },
  // Shield positioned at knight's left hand (viewer's right side, mid-lower)
  knightShieldOverlay: {
    position: 'absolute',
    width: 64,
    height: 64,
    right: 14,
    bottom: 66,
  },
  portraitPlaceholder: {
    fontSize: 48,
    color: '#4a3318',
    fontWeight: '900',
  },
  classLabel: {
    color: '#9a7a50',
    fontSize: 11,
    letterSpacing: 4,
    fontWeight: '700',
    marginBottom: 6,
  },
  name: {
    fontSize: 26,
    fontWeight: '900',
    color: '#c9933a',
    letterSpacing: 3,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  inventoryBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#c9933a',
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#2e1a06',
    borderRadius: 2,
  },
  inventoryBtnText: {
    color: '#c9933a',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  divider: {
    width: 160,
    height: 2,
    backgroundColor: '#c9933a',
    opacity: 0.4,
    marginTop: 14,
    borderRadius: 1,
  },
  levelBox: {
    backgroundColor: '#20130a',
    borderWidth: 1,
    borderColor: '#4a3318',
    borderRadius: 4,
    padding: 16,
    marginBottom: 24,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 6,
  },
  levelLabel: {
    color: '#9a7a50',
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '700',
  },
  levelValue: {
    color: '#c9933a',
    fontSize: 28,
    fontWeight: '900',
  },
  xpText: {
    color: '#7a5c35',
    fontSize: 12,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  xpBarBg: {
    height: 4,
    backgroundColor: '#2e1a06',
    borderRadius: 2,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: 4,
    backgroundColor: '#c9933a',
    borderRadius: 2,
  },
  sectionTitle: {
    color: '#9a7a50',
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '700',
    marginBottom: 10,
  },
  statsBox: {
    backgroundColor: '#20130a',
    borderWidth: 1,
    borderColor: '#4a3318',
    borderRadius: 4,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  statRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#2e1a06',
  },
  statLabel: {
    color: '#c8b090',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  statValue: {
    color: '#c9933a',
    fontSize: 15,
    fontWeight: '800',
  },
});
