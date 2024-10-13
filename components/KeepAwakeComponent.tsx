// KeepAwakeComponent.tsx
import { useKeepAwake } from 'expo-keep-awake';
import React from 'react';

export default function KeepAwakeComponent() {
  useKeepAwake();
  return null;
}
