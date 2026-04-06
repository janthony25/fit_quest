import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { supabase } from '../lib/supabase';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CharacterCreation'>;
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 64) / 3;

export type ClassRow = {
  name: string;
  available: boolean;
  description: string;
};

export default function CharacterCreationScreen({ navigation }: Props) {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loadingClasses, setLoadingClasses] = useState(true);

  useEffect(() => {
    supabase
      .from('classes')
      .select('name, available, description')
      .order('id')
      .then(({ data }) => {
        if (data) setClasses(data);
        setLoadingClasses(false);
      });
  }, []);

  const selectedClass = classes.find(c => c.name === selected);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>CHOOSE YOUR CLASS</Text>
      <View style={styles.headingDivider} />
      <Text style={styles.subheading}>Who will you become?</Text>

      {loadingClasses ? (
        <ActivityIndicator color="#c9933a" style={{ marginTop: 40 }} />
      ) : (
        <View style={styles.cardsRow}>
          {classes.map(({ name, available }) => {
            const isSelected = selected === name;
            return (
              <TouchableOpacity
                key={name}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                  !available && styles.cardLocked,
                ]}
                onPress={() => available && setSelected(name)}
                activeOpacity={available ? 0.8 : 1}
              >
                <View style={[styles.imageBox, isSelected && styles.imageBoxSelected]}>
                  {name === 'Knight' ? (
                    <Image
                      source={require('../assets/Knight/base-knight.png')}
                      style={styles.characterImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text style={styles.comingSoon}>?</Text>
                  )}
                </View>
                <View style={[styles.titleBadge, isSelected && styles.titleBadgeSelected]}>
                  <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                    {name.toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {selectedClass && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{selectedClass.description}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.confirmBtn, !selected && styles.confirmBtnDisabled]}
        onPress={() => {
          if (!selected) return;
          navigation.navigate('CharacterName', { characterClass: selected as any });
        }}
        disabled={!selected}
        activeOpacity={0.75}
      >
        <Text style={[styles.confirmText, !selected && styles.confirmTextDisabled]}>
          CONFIRM CLASS
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0e05',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: '900',
    color: '#c9933a',
    letterSpacing: 4,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  headingDivider: {
    width: 200,
    height: 2,
    backgroundColor: '#c9933a',
    opacity: 0.5,
    marginVertical: 10,
    borderRadius: 1,
  },
  subheading: {
    color: '#9a7a50',
    fontSize: 13,
    letterSpacing: 2,
    marginBottom: 32,
    fontStyle: 'italic',
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  card: {
    width: CARD_WIDTH,
    borderWidth: 1,
    borderColor: '#4a3318',
    backgroundColor: '#24140a',
    alignItems: 'center',
    paddingBottom: 12,
    borderRadius: 4,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#c9933a',
    backgroundColor: '#2e1a08',
  },
  cardLocked: {
    opacity: 0.55,
  },
  imageBox: {
    width: '100%',
    height: CARD_WIDTH * 1.5,
    backgroundColor: '#1a0e05',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#3a2410',
    marginBottom: 10,
  },
  imageBoxSelected: {
    backgroundColor: '#20130a',
    borderBottomColor: '#8a6020',
  },
  characterImage: {
    width: CARD_WIDTH - 12,
    height: CARD_WIDTH * 1.4,
  },
  comingSoon: {
    fontSize: 36,
    color: '#4a3318',
    fontWeight: '900',
  },
  titleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#4a3318',
    borderRadius: 2,
  },
  titleBadgeSelected: {
    borderColor: '#c9933a',
    backgroundColor: '#3d2209',
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7a5c35',
    letterSpacing: 2,
  },
  cardTitleSelected: {
    color: '#c9933a',
  },
  infoBox: {
    marginTop: 28,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#4a3318',
    backgroundColor: '#20130a',
    maxWidth: 320,
    borderRadius: 4,
  },
  infoText: {
    color: '#c8b090',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  confirmBtn: {
    marginTop: 'auto',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#c9933a',
    paddingVertical: 14,
    paddingHorizontal: 48,
    backgroundColor: '#2e1a06',
  },
  confirmBtnDisabled: {
    borderColor: '#4a3318',
    backgroundColor: '#1a0e05',
  },
  confirmText: {
    color: '#c9933a',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 3,
  },
  confirmTextDisabled: {
    color: '#4a3318',
  },
});
