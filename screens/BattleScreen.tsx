import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

const MAPS = [
  {
    key: 'town_of_beginning',
    name: 'Town of Beginning',
    description: 'Your journey starts here.',
    image: require('../assets/maps/town_of_beginning.png'),
    current: true,
  },
];

export default function BattleScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <Text style={styles.title}>BATTLE</Text>
        <View style={styles.divider} />

        {/* Quest section */}
        <Text style={styles.sectionLabel}>QUEST</Text>
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>📜</Text>
          <Text style={styles.emptyText}>No quests available yet.</Text>
          <Text style={styles.emptySubtext}>Check back soon, adventurer.</Text>
        </View>

        {/* Maps section */}
        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>MAPS</Text>
        {MAPS.map(map => (
          <TouchableOpacity
            key={map.key}
            style={styles.mapCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('MapEnemies', { mapName: map.name, mapImage: map.image })}
          >
            <Image source={map.image} style={styles.mapImage} resizeMode="cover" />
            <View style={styles.mapOverlay}>
              <View style={styles.mapMeta}>
                <Text style={styles.mapName}>{map.name}</Text>
                <Text style={styles.mapDesc}>{map.description}</Text>
              </View>
              {map.current && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>CURRENT</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

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
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#c9933a',
    letterSpacing: 4,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  divider: {
    width: 160,
    height: 2,
    backgroundColor: '#c9933a',
    opacity: 0.4,
    marginTop: 12,
    marginBottom: 28,
    borderRadius: 1,
    alignSelf: 'center',
  },
  sectionLabel: {
    color: '#9a7a50',
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyBox: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a3318',
    backgroundColor: '#20130a',
    borderRadius: 4,
    paddingVertical: 28,
    paddingHorizontal: 32,
    width: '100%',
    marginBottom: 4,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  emptyText: {
    color: '#c8b090',
    fontSize: 13,
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySubtext: {
    color: '#7a5c35',
    fontSize: 11,
    fontStyle: 'italic',
  },
  mapCard: {
    width: '100%',
    height: 180,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#4a3318',
    marginBottom: 16,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(18, 8, 2, 0.75)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapMeta: {
    flex: 1,
  },
  mapName: {
    color: '#c9933a',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  mapDesc: {
    color: '#9a7a50',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 2,
  },
  currentBadge: {
    borderWidth: 1,
    borderColor: '#c9933a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
    backgroundColor: '#2e1a06',
  },
  currentBadgeText: {
    color: '#c9933a',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 2,
  },
});
