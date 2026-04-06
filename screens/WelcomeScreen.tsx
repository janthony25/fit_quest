import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: Props) {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(titleY, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(buttonOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.ornamentTop} />

      <Animated.View style={{ opacity: titleOpacity, transform: [{ translateY: titleY }] }}>
        <Text style={styles.title}>⚔️ FIT QUEST ⚔️</Text>
        <View style={styles.divider} />
      </Animated.View>

      <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
        Welcome to Fit Quest.{'\n'}This is where your journey{'\n'}on being fit begins...
      </Animated.Text>

      <Animated.View style={{ opacity: buttonOpacity }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CharacterCreation')}
          activeOpacity={0.75}
        >
          <Text style={styles.buttonText}>BEGIN YOUR QUEST</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.ornamentBottom} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0e05',
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
    backgroundColor: '#c9933a',
    marginVertical: 20,
    opacity: 0.6,
    borderRadius: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#e8d5b0',
    textAlign: 'center',
    lineHeight: 30,
    fontStyle: 'italic',
    marginBottom: 52,
    letterSpacing: 0.5,
  },
  button: {
    borderWidth: 2,
    borderColor: '#c9933a',
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: '#2e1a06',
  },
  buttonText: {
    color: '#c9933a',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 3,
  },
});
