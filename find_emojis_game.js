const fs = require('fs');
const path = require('path');

const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F1E6}-\u{1F1FF}]|[\u{1F191}-\u{1F251}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F0F5}]|[\u{1F300}-\u{1F5FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]/gu;

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git') {
        walkDir(dirPath, callback);
      }
    } else {
      if (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.css')) {
        callback(dirPath);
      }
    }
  });
}

const results = [];

walkDir('/home/khang/Documents/chinese-pixel-game/src', (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  let match;
  // Reset regex index
  emojiRegex.lastIndex = 0;
  while ((match = emojiRegex.exec(content)) !== null) {
    const lines = content.substring(0, match.index).split('\n');
    const lineNum = lines.length;
    const colNum = lines[lines.length - 1].length + 1;
    results.push({
      file: filePath.replace('/home/khang/Documents/chinese-pixel-game/', ''),
      line: lineNum,
      col: colNum,
      emoji: match[0],
      context: content.split('\n')[lineNum - 1].trim()
    });
  }
});

console.log(JSON.stringify(results, null, 2));
