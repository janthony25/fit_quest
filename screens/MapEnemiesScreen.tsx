import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { supabase } from '../lib/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'MapEnemies'>;

type Enemy = {
  id: string;
  name: string;
  description: string;
  lvl: number;
  hp: number;
  exp_drop: number;
  gold_drop: number;
};

const ENEMY_IMAGES: Record<string, any> = {
  'Procrastination Slime': require('../assets/Enemies/procrastination_slime.png'),
};

export default function MapEnemiesScreen({ route, navigation }: Props) {
  const { mapName, mapImage } = route.params;
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEnemies() {
      const { data, error } = await supabase
        .from('map_enemies')
        .select('enemies(id, name, description, lvl, hp, exp_drop, gold_drop), maps!inner(name)')
        .eq('maps.name', mapName);

      if (!error && data) {
        const list = data
          .map((row: any) => row.enemies)
          .filter(Boolean) as Enemy[];
        setEnemies(list);
      }
      setLoading(false);
    }
    fetchEnemies();
  }, [mapName]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with map image */}
      <View style={styles.header}>
        <Image source={mapImage} style={styles.headerImage} resizeMode="cover" />
        <View style={styles.headerOverlay}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← BACK</Text>
          </TouchableOpacity>
          <Text style={styles.mapTitle}>{mapName.toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionLabel}>ENEMIES</Text>

        {loading ? (
          <ActivityIndicator color="#c9933a" style={{ marginTop: 40 }} />
        ) : enemies.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No enemies found.</Text>
          </View>
        ) : (
          enemies.map(enemy => (
            <View key={enemy.id} style={styles.enemyCard}>
              <View style={styles.enemyLeft}>
                {ENEMY_IMAGES[enemy.name] ? (
                  <Image source={ENEMY_IMAGES[enemy.name]} style={styles.enemyImage} resizeMode="contain" />
                ) : (
                  <View style={styles.enemyImagePlaceholder}>
                    <Text style={{ fontSize: 32 }}>👾</Text>
                  </View>
                )}
              </View>

              <View style={styles.enemyInfo}>
                <Text style={styles.enemyName}>{enemy.name}</Text>
                <Text style={styles.enemyDesc} numberOfLines={2}>{enemy.description}</Text>

                <View style={styles.statsRow}>
                  <View style={styles.statBadge}>
                    <Text style={styles.statLabel}>LVL</Text>
                    <Text style={styles.statValue}>{enemy.lvl}</Text>
                  </View>
                  <View style={styles.statBadge}>
                    <Text style={styles.statLabel}>HP</Text>
                    <Text style={styles.statValue}>{enemy.hp}</Text>
                  </View>
                  <View style={styles.statBadge}>
                    <Text style={styles.statLabel}>EXP</Text>
                    <Text style={styles.statValue}>{enemy.exp_drop}</Text>
                  </View>
                  <View style={styles.statBadge}>
                    <Text style={styles.statLabel}>GOLD</Text>
                    <Text style={styles.statValue}>{enemy.gold_drop}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.battleBtn} activeOpacity={0.8}>
                <Text style={styles.battleBtnText}>BATTLE</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0e05',
  },
  header: {
    width: '100%',
    height: 160,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(18, 8, 2, 0.55)',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  backBtn: {
    position: 'absolute',
    top: 14,
    left: 16,
  },
  backText: {
    color: '#c9933a',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  mapTitle: {
    color: '#c9933a',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 3,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  sectionLabel: {
    color: '#9a7a50',
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '700',
    marginBottom: 14,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#7a5c35',
    fontSize: 13,
    fontStyle: 'italic',
  },
  enemyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#20130a',
    borderWidth: 1,
    borderColor: '#4a3318',
    borderRadius: 6,
    marginBottom: 14,
    overflow: 'hidden',
  },
  enemyLeft: {
    width: 90,
    height: 110,
    backgroundColor: '#160d04',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enemyImage: {
    width: 80,
    height: 100,
  },
  enemyImagePlaceholder: {
    width: 80,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  enemyInfo: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  enemyName: {
    color: '#e8d5b0',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
  },
  enemyDesc: {
    color: '#7a5c35',
    fontSize: 10,
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  statBadge: {
    backgroundColor: '#2e1a06',
    borderWidth: 1,
    borderColor: '#4a3318',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    alignItems: 'center',
  },
  statLabel: {
    color: '#9a7a50',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statValue: {
    color: '#c9933a',
    fontSize: 11,
    fontWeight: '900',
  },
  battleBtn: {
    backgroundColor: '#7a2e0a',
    borderLeftWidth: 1,
    borderColor: '#c9933a',
    paddingHorizontal: 14,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  battleBtnText: {
    color: '#c9933a',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
});
