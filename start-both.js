const { spawn } = require('child_process');
const path = require('path');

console.log('====================================================');
console.log('   🚀 Launching SmartPrice Full-Stack Application');
console.log('====================================================');

const serverDir = path.join(__dirname, 'server');
const clientDir = path.join(__dirname, 'client');

const runCmd = (cmd, dir) => {
  if (process.platform === 'win32') {
    return spawn('cmd.exe', ['/c', cmd], { cwd: dir, stdio: 'inherit' });
  }
  return spawn('sh', ['-c', cmd], { cwd: dir, stdio: 'inherit' });
};

console.log('[1/2] Starting Backend Server (Port 5000)...');
const serverProcess = runCmd('npm run dev', serverDir);

setTimeout(() => {
  console.log('[2/2] Starting Frontend Client (Port 5173)...');
  const clientProcess = runCmd('npm run dev', clientDir);

  const cleanup = () => {
    console.log('\nStopping servers...');
    try { serverProcess.kill(); } catch {}
    try { clientProcess.kill(); } catch {}
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}, 1500);
