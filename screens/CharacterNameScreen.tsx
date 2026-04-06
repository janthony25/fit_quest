import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CharacterName'>;
  route: RouteProp<RootStackParamList, 'CharacterName'>;
};

export default function CharacterNameScreen({ navigation, route }: Props) {
  const { characterClass } = route.params;
  const { user, refreshCharacter } = useAuth();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleConfirm() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a name.');
      return;
    }
    if (!user) return;

    setError('');
    setLoading(true);

    // Check uniqueness
    const { data: existing } = await supabase
      .from('characters')
      .select('id')
      .eq('name', trimmed)
      .maybeSingle();

    if (existing) {
      setError('That name is already taken. Choose another.');
      setLoading(false);
      return;
    }

    // Fetch base stats from the classes table
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('base_strength, base_dexterity, base_intelligence, base_physical_attack, base_physical_defense, base_mentality')
      .eq('name', characterClass)
      .single();

    if (classError || !classData) {
      setError('Failed to load class data. Please try again.');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('characters').insert({
      user_id: user.id,
      name: trimmed,
      class: characterClass,
      strength: classData.base_strength,
      dexterity: classData.base_dexterity,
      intelligence: classData.base_intelligence,
      physical_attack: classData.base_physical_attack,
      physical_defense: classData.base_physical_defense,
      mentality: classData.base_mentality,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // Fetch the new character id to create its equipment row
    const { data: newChar } = await supabase
      .from('characters')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (newChar) {
      await supabase.from('equipment').insert({ character_id: newChar.id });
    }

    await refreshCharacter();
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.classLabel}>{characterClass.toUpperCase()}</Text>
        <Text style={styles.title}>NAME YOUR{'\n'}HERO</Text>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>Your name is permanent and unique across all realms.</Text>

        <Text style={styles.fieldLabel}>CHARACTER NAME</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={t => { setName(t); setError(''); }}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={24}
          placeholder="e.g. DarkKnight99"
          placeholderTextColor="#4a3318"
        />
        <Text style={styles.charCount}>{name.trim().length}/24</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, (!name.trim() || loading) && styles.buttonDisabled]}
          onPress={handleConfirm}
          disabled={!name.trim() || loading}
          activeOpacity={0.75}
        >
          {loading ? (
            <ActivityIndicator color="#c9933a" />
          ) : (
            <Text style={styles.buttonText}>BEGIN YOUR QUEST</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Change Class</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0e05',
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  classLabel: {
    color: '#9a7a50',
    fontSize: 11,
    letterSpacing: 4,
    fontWeight: '700',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#c9933a',
    textAlign: 'center',
    letterSpacing: 4,
    lineHeight: 40,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  divider: {
    width: 160,
    height: 2,
    backgroundColor: '#c9933a',
    opacity: 0.5,
    marginVertical: 16,
    borderRadius: 1,
  },
  subtitle: {
    color: '#7a5c35',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 32,
    lineHeight: 18,
  },
  fieldLabel: {
    alignSelf: 'flex-start',
    color: '#9a7a50',
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#4a3318',
    backgroundColor: '#20130a',
    color: '#e8d5b0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    letterSpacing: 1,
  },
  charCount: {
    alignSelf: 'flex-end',
    color: '#4a3318',
    fontSize: 11,
    marginTop: 4,
    marginBottom: 16,
  },
  errorText: {
    color: '#c0392b',
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#c9933a',
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#2e1a06',
    marginTop: 8,
  },
  buttonDisabled: {
    borderColor: '#4a3318',
    backgroundColor: '#1a0e05',
  },
  buttonText: {
    color: '#c9933a',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 3,
  },
  backBtn: {
    marginTop: 24,
  },
  backText: {
    color: '#7a5c35',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
