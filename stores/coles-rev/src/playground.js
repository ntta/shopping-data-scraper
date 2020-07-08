import fs from 'fs';

export const readLineFromFile = (filePath) => {
  const fileData = fs.readFileSync(filePath, 'utf8');
  return fileData.split('\n').map((line) => line.replace(/\r/g, ''));
};
