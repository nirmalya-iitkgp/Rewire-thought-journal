import Dexie, { type Table } from 'dexie';

export interface CheckIn {
  id?: number;
  timestamp: number;
  energy: number; // 0-2 (emoji mapping)
  connection: number; // 0-2
  mood: number; // 0-2
}

export interface Action {
  id?: number;
  timestamp: number;
  type: 'healthy' | 'unhealthy' | 'mission';
  description?: string;
  success: boolean;
}

export interface Impulse {
  id?: number;
  timestamp: number;
  intensity: number; // 0-1
  decayRate: number; // lambda
}

export interface ImpulsivityTest {
  id?: number;
  timestamp: number;
  kValue: number;
}

export interface Settings {
  id?: number;
  key: string;
  value: any;
}

export class RewireDB extends Dexie {
  checkins!: Table<CheckIn>;
  actions!: Table<Action>;
  impulses!: Table<Impulse>;
  impulsivityTests!: Table<ImpulsivityTest>;
  settings!: Table<Settings>;

  constructor() {
    super('RewireDB');
    this.version(1).stores({
      checkins: '++id, timestamp',
      actions: '++id, timestamp, type',
      impulses: '++id, timestamp',
      impulsivityTests: '++id, timestamp',
      settings: '++id, key'
    });
  }
}

export const db = new RewireDB();
