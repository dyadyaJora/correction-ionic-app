let fs = require('fs');

function readWriteSync() {
  let env = process.env.IONIC_ENV;

  if (!process.env.IONIC_ENV) {
    env = 'dev';  
  }
  let data = fs.readFileSync(`src/environments/environment.${env}.ts`, 'utf-8');
  fs.writeFileSync('src/environments/environment.ts', data, 'utf-8');
  console.log('env config complete');
}

readWriteSync();