import type { WorkoutBlock } from '../types';
import { plannedSets } from './prescription';

/** Use the lower bound of a range such as "90–120 s" for the countdown. */
export const parseRestSeconds = (rest?: string): number | undefined => {
  const match = rest?.trim().match(/^(\d+(?:[.,]\d+)?)\s*(?:[-–—]\s*\d+(?:[.,]\d+)?)?\s*(min(?:utos?)?|m\b|s\b|seg(?:undos?)?)?/i);
  if (!match) return undefined;
  const value = Number(match[1]!.replace(',', '.'));
  return Math.round(value * (match[2] && /^(min|m$)/i.test(match[2]) ? 60 : 1));
};

export const restForItem = (itemRest?: string, blockRest?: string): number =>
  parseRestSeconds(itemRest) ?? parseRestSeconds(blockRest) ?? 60;

/** Navigate original item indices so prescription keys and persisted set rows never change. */
export const nextStrengthSet = (
  block: WorkoutBlock,
  activeIndexes: number[],
  currentIndex: number,
  setIndex: number,
): { nextIndex?: number; nextSet: number; pause: boolean } => {
  const position = activeIndexes.indexOf(currentIndex);
  if (position < 0) return { nextSet: setIndex, pause: false };
  const current = block.items[currentIndex]!;
  const letter = current.order?.match(/^([A-Za-z]+)\d+$/)?.[1];
  const sameGroup = (index: number) =>
    !!letter && block.items[index]?.order?.match(/^([A-Za-z]+)\d+$/)?.[1] === letter;

  // A1 → A2 (→ A3 ...) at the same set number; explicit item rest still applies.
  let end = position;
  while (end + 1 < activeIndexes.length && sameGroup(activeIndexes[end + 1]!)) {
    end++;
    const following = activeIndexes[end]!;
    if (setIndex < plannedSets(block.items[following]!, block))
      return { nextIndex: following, nextSet: setIndex, pause: !!current.rest };
  }

  // At the end of the group, return to its first item with an unfinished next set.
  let start = position;
  while (start > 0 && sameGroup(activeIndexes[start - 1]!)) start--;
  for (let p = start; p <= end; p++) {
    const index = activeIndexes[p]!;
    if (setIndex + 1 < plannedSets(block.items[index]!, block))
      return { nextIndex: index, nextSet: setIndex + 1, pause: true };
  }

  // A standalone exercise repeats before moving to the next letter.
  if (!letter && setIndex + 1 < plannedSets(current, block))
    return { nextIndex: currentIndex, nextSet: setIndex + 1, pause: true };

  const nextIndex = activeIndexes[end + 1];
  return nextIndex === undefined
    ? { nextSet: 0, pause: false }
    : { nextIndex, nextSet: 0, pause: true };
};