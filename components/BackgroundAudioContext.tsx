import React, { createContext, useState, useContext, useEffect, useRef, ReactNode } from 'react';
import { Audio, AVPlaybackStatusToSet } from 'expo-av';

interface BackgroundAudioContextType {
  loadAudio: (audioFile: any, options?: AudioOptions) => Promise<Audio.Sound>;
  stopAudio: () => Promise<void>;
  pauseBackgroundAudio: () => Promise<void>;
  resumeBackgroundAudio: () => Promise<void>;
}

interface AudioOptions {
  shouldLoop?: boolean;
  volume?: number;
  isLooping?: boolean;
  isMuted?: boolean;
  // Add other properties from AVPlaybackStatusToSet as needed
}

const BackgroundAudioContext = createContext<BackgroundAudioContextType | undefined>(undefined);

export const useBackgroundAudio = () => {
  const context = useContext(BackgroundAudioContext);
  if (context === undefined) {
    throw new Error('useBackgroundAudio must be used within a BackgroundAudioProvider');
  }
  return context;
};

interface BackgroundAudioProviderProps {
  children: ReactNode;
}

export const BackgroundAudioProvider: React.FC<BackgroundAudioProviderProps> = ({ children }) => {
    const [sounds, setSounds] = useState<Audio.Sound[]>([]);
    const nonLoopingAudioRef = useRef<Audio.Sound | null>(null);

    useEffect(() => {
        return () => {
            sounds.forEach(sound => sound.unloadAsync());
        };
    }, []);

    const loadAudio = async (audioFile: any, options: AudioOptions = {}): Promise<Audio.Sound> => {
        const playbackOptions: AVPlaybackStatusToSet = {
            shouldPlay: true,
            isLooping: options.shouldLoop ?? true,
            volume: options.volume,
            isMuted: options.isMuted,
            // Add other properties as needed
        };

        const { sound } = await Audio.Sound.createAsync(audioFile, playbackOptions);
        setSounds(prevSounds => [...prevSounds, sound]);
        if (!options.shouldLoop) {
            nonLoopingAudioRef.current = sound;
        }
        return sound;
    };

    const stopAudio = async (): Promise<void> => {
        await Promise.all(sounds.map(async sound => {
            await sound.stopAsync();
            await sound.unloadAsync();
        }));
        setSounds([]);
        nonLoopingAudioRef.current = null;
    };

    const pauseBackgroundAudio = async (): Promise<void> => {
        await Promise.all(sounds.map(sound => sound.pauseAsync()));
    };

    const resumeBackgroundAudio = async (): Promise<void> => {
        await Promise.all(sounds.map(async sound => {
            if (sound !== nonLoopingAudioRef.current || (nonLoopingAudioRef.current && await nonLoopingAudioRef.current.getStatusAsync().then(status => status.isLoaded))) {
                await sound.playAsync();
            }
        }));
    };

    const value: BackgroundAudioContextType = {
        loadAudio,
        stopAudio,
        pauseBackgroundAudio,
        resumeBackgroundAudio,
    };

    return (
        <BackgroundAudioContext.Provider value={value}>
            {children}
        </BackgroundAudioContext.Provider>
    );
};