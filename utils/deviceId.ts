// utils/deviceId.ts
// ─────────────────────────────────────────────────────────────────────────────
// Generates and persists a stable anonymous device ID in localStorage.
// This is Pillar C from the sync architecture — the "Player ID" that
// exists before the user ever creates an account.
//
// On Day 1: stays in localStorage, identifies the device.
// On Day 2: when the user signs up, this ID is linked to their account
//           and all local matches are claimed by that account.
//
// Never changes for a given device/browser unless localStorage is cleared.
// ─────────────────────────────────────────────────────────────────────────────

import { generateUUID } from './uuid';

const DEVICE_ID_KEY = 'psp_device_id';

export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server';

  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = `device_${generateUUID()}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}
