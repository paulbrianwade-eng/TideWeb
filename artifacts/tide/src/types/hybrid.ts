import type { WorkoutBlock } from './index';

export interface RoundSplit {
  round: number;
  elapsedSec: number;
  splitSec: number;
  recordedAt: string;
  source: 'tap' | 'manual';
}
export interface HybridEvent {
  type: string;
  at: string;
  elapsedSec: number;
  reason?: string;
  before?: unknown;
  after?: unknown;
}
export interface HybridResult {
  workoutDefinitionId: string;
  workoutVersion: number;
  /** Full canonical prescription (including substitutions and actual loads) for comparisons. */
  definition: WorkoutBlock;
  format: 'amrap' | 'for_time' | 'rounds_for_time' | 'chipper' | 'ladder' | 'interval';
  targetSec?: number;
  targetRounds?: number;
  status: 'idle' | 'running' | 'paused' | 'finished';
  activeElapsedSec: number;
  pausedSec: number;
  /** Epoch milliseconds: a running timer continues in the background and across reloads. */
  runningSince?: number;
  pausedSince?: number;
  startedAt?: string;
  finishedAt?: string;
  splits: RoundSplit[];
  completedRounds: number;
  partialReps: number;
  partialDetails?: { exerciseId: string; value: number; unit: string }[];
  notes?: string;
  dnf?: boolean;
  events: HybridEvent[];
}
