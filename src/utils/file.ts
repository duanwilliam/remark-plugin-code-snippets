import * as fs from 'fs';

export const fileExists = async (path: string) => await fs.promises.access(path).then(() => true).catch(() => false);