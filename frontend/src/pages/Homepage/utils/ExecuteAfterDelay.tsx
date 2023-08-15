export const executeAfterDelay = (f: () => void, delayMs: number): void => {
  setTimeout(f, delayMs);
};
