const normalizeNewlines = (input: string): string => input.replace(/\\\\n/g, '\n').replace(/\r?\n/g, '\n');

export { normalizeNewlines };
