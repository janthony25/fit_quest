import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit() {
    setError('');
    setMessage('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage('Check your email for a confirmation link, then log in.');
        setMode('login');
      }
    }

    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
      style={styles.inner}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.ornamentTop} />

      <Text style={styles.title}>⚔️ FIT QUEST ⚔️</Text>
      <View style={styles.divider} />

      <Text style={styles.modeLabel}>
        {mode === 'login' ? 'ENTER THE REALM' : 'JOIN THE REALM'}
      </Text>

      <View style={styles.form}>
        <Text style={styles.fieldLabel}>EMAIL</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#4a3318"
          placeholder="hero@kingdom.com"
        />

        <Text style={styles.fieldLabel}>PASSWORD</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#4a3318"
          placeholder="••••••••"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {message ? <Text style={styles.messageText}>{message}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          activeOpacity={0.75}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#c9933a" />
          ) : (
            <Text style={styles.buttonText}>
              {mode === 'login' ? 'ENTER' : 'CREATE ACCOUNT'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setMessage(''); }}>
        <Text style={styles.switchText}>
          {mode === 'login'
            ? "No account? Register here"
            : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>

      <View style={styles.ornamentBottom} />
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
  ornamentTop: {
    position: 'absolute',
    top: 0,
    width,
    height: 6,
    backgroundColor: '#c9933a',
  },
  ornamentBottom: {
    position: 'absolute',
    bottom: 0,
    width,
    height: 6,
    backgroundColor: '#c9933a',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#c9933a',
    textAlign: 'center',
    letterSpacing: 4,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  divider: {
    height: 2,
    width: 200,
    backgroundColor: '#c9933a',
    marginVertical: 16,
    opacity: 0.6,
    borderRadius: 1,
  },
  modeLabel: {
    color: '#9a7a50',
    fontSize: 13,
    letterSpacing: 3,
    fontStyle: 'italic',
    marginBottom: 32,
  },
  form: {
    width: '100%',
    maxWidth: 340,
  },
  fieldLabel: {
    color: '#9a7a50',
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#4a3318',
    backgroundColor: '#20130a',
    color: '#e8d5b0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  button: {
    borderWidth: 2,
    borderColor: '#c9933a',
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#2e1a06',
    marginTop: 4,
  },
  buttonText: {
    color: '#c9933a',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 3,
  },
  errorText: {
    color: '#c0392b',
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  messageText: {
    color: '#7a9a50',
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
    fontStyle: 'italic',
  },
  switchText: {
    color: '#7a5c35',
    fontSize: 13,
    marginTop: 24,
    letterSpacing: 0.5,
    textDecorationLine: 'underline',
  },
});
