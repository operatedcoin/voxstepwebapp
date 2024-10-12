// SoundContext.tsx
import React, { createContext, useContext, useRef, useEffect } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';

type SoundContextType = {
  preloadSounds: () => Promise<void>;
  playSound: (soundName: string) => Promise<void>;
  stopSound: (soundName: string) => Promise<void>;
  fadeOutSound: (soundName: string, duration?: number) => Promise<void>;
  setOnPlaybackStatusUpdate: (
    soundName: string,
    callback: (status: AVPlaybackStatus) => void
  ) => void;
};

const SoundContext = createContext<SoundContextType | null>(null);

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const soundObjects = useRef<{ [key: string]: Audio.Sound }>({});

  useEffect(() => {
    // Preload sounds when the SoundProvider mounts
    preloadSounds();
    return () => {
      // Unload all sounds when the SoundProvider unmounts
      Object.values(soundObjects.current).forEach((sound) => {
        sound.unloadAsync();
      });
    };
  }, []);

  const preloadSounds = async () => {
    try {
      // Preload the audio files
      const soundNames = [
        { name: 'samba', file: require('../assets/audio/samba.mp3') },
        { name: 'mystery', file: require('../assets/audio/mystery.mp3') },
        { name: 'escape', file: require('../assets/audio/escape.m4a') },
        // Add more sounds as needed
      ];

      for (const { name, file } of soundNames) {
        const sound = new Audio.Sound();
        await sound.loadAsync(file);
        soundObjects.current[name] = sound;
      }
    } catch (error) {
      console.log('Error preloading sounds:', error);
    }
  };

  const playSound = async (soundName: string) => {
    const sound = soundObjects.current[soundName];
    if (sound) {
      try {
        await sound.replayAsync(); // Use replayAsync to play from the start
      } catch (error) {
        console.log(`Error playing sound ${soundName}:`, error);
      }
    } else {
      console.log(`Sound ${soundName} not preloaded.`);
    }
  };

  const stopSound = async (soundName: string) => {
    const sound = soundObjects.current[soundName];
    if (sound) {
      try {
        await sound.stopAsync();
      } catch (error) {
        console.log(`Error stopping sound ${soundName}:`, error);
      }
    }
  };

  const fadeOutSound = async (soundName: string, duration: number = 2000) => {
    const sound = soundObjects.current[soundName];
    if (sound) {
      try {
        const steps = 20; // Number of steps for the fade-out
        const interval = duration / steps; // Interval duration per step
        const volumeStep = 1 / steps; // Decrease in volume per step

        for (let i = 0; i < steps; i++) {
          const currentVolume = 1 - volumeStep * i;
          await sound.setVolumeAsync(currentVolume);
          await new Promise((resolve) => setTimeout(resolve, interval));
        }

        // Stop the sound after fading out
        await sound.stopAsync();
        // Reset volume to 1 for next play
        await sound.setVolumeAsync(1);
      } catch (error) {
        console.log(`Error fading out sound ${soundName}:`, error);
      }
    }
  };

  const setOnPlaybackStatusUpdate = (
    soundName: string,
    callback: (status: AVPlaybackStatus) => void
  ) => {
    const sound = soundObjects.current[soundName];
    if (sound) {
      sound.setOnPlaybackStatusUpdate(callback);
    }
  };

  return (
    <SoundContext.Provider
      value={{ preloadSounds, playSound, stopSound, fadeOutSound, setOnPlaybackStatusUpdate }}
    >
      {children}
    </SoundContext.Provider>
  );
};
