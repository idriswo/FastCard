const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replacements = [
  [/(?<!dark:)text-black/g, 'text-black dark:text-white'],
  [/(?<!dark:)bg-white/g, 'bg-white dark:bg-zinc-900'],
  [/(?<!dark:)text-zinc-900/g, 'text-zinc-900 dark:text-white'],
  [/(?<!dark:)text-gray-900/g, 'text-gray-900 dark:text-white'],
  [/(?<!dark:)text-gray-800/g, 'text-gray-800 dark:text-zinc-100'],
  [/(?<!dark:)text-gray-700/g, 'text-gray-700 dark:text-zinc-200'],
  [/(?<!dark:)text-gray-600/g, 'text-gray-600 dark:text-zinc-300'],
  [/(?<!dark:)text-gray-500/g, 'text-gray-500 dark:text-zinc-400'],
  [/(?<!dark:)text-zinc-500/g, 'text-zinc-500 dark:text-zinc-400'],
  [/(?<!dark:)text-zinc-400/g, 'text-zinc-400 dark:text-zinc-500'],
  
  [/(?<!dark:)bg-\[\#F5F5F5\]/g, 'bg-[#F5F5F5] dark:bg-zinc-800'],
  [/(?<!dark:)bg-gray-50/g, 'bg-gray-50 dark:bg-zinc-800'],
  [/(?<!dark:)bg-zinc-100/g, 'bg-zinc-100 dark:bg-zinc-800'],
  [/(?<!dark:)bg-zinc-50/g, 'bg-zinc-50 dark:bg-zinc-800'],
  
  [/(?<!dark:)border-gray-200/g, 'border-gray-200 dark:border-zinc-700'],
  [/(?<!dark:)border-gray-300/g, 'border-gray-300 dark:border-zinc-700'],
  [/(?<!dark:)border-black/g, 'border-black dark:border-zinc-700'],
  [/(?<!dark:)border-zinc-400/g, 'border-zinc-400 dark:border-zinc-700'],
  [/(?<!dark:)border-zinc-800/g, 'border-zinc-800 dark:border-zinc-700'],
  
  [/(?<!dark:)hover:bg-zinc-100/g, 'hover:bg-zinc-100 dark:hover:bg-zinc-800'],
  [/(?<!dark:)hover:bg-gray-50/g, 'hover:bg-gray-50 dark:hover:bg-zinc-800'],
  [/(?<!dark:)hover:text-black/g, 'hover:text-black dark:hover:text-white'],
];

let filesModified = 0;

walkDir('src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    replacements.forEach(([regex, replacement]) => {
      content = content.replace(regex, replacement);
    });
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesModified++;
      console.log(`Modified ${filePath}`);
    }
  }
});

console.log(`Total files modified: ${filesModified}`);
