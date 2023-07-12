export const DNC = 'DNC';
export const DNQ = 'DNQ';

const notCts = [DNC, 'OOD'];

export const cameToStartingArea = (code: string) => !notCts.includes(code);
