const notCts = ['DNC', 'OOD'];

export const cameToStartingArea = (code: string) => !notCts.includes(code);
