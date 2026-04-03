const fs = require('fs');
const path = require('path');

const fixMap = {
    'ðŸ˜¢': '😢',
    'ðŸ—‘ï¸': '🗑️',
    'ðŸ¥º': '🥺',
    'ðŸ“„': '📄',
    'ðŸ“Š': '📊',
    'âœ…': '✅'
}

function processFiles(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processFiles(fullPath);
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            for(let [bad, good] of Object.entries(fixMap)) {
                content = content.split(bad).join(good);
            }
            if(content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Fixed', fullPath);
            }
        }
    });
}
processFiles(path.join(__dirname, 'admin'));
processFiles(path.join(__dirname, 'js'));
