const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const pathToFile = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(pathToFile);

stdout.write('Enter tour text:\n');
stdin.on('data', data => {
  data = data.toString().trim();
  if (data == 'exit') process.exit();
  output.write(data + '\n');
})

process.on('exit', () => {
  stdout.write('Process was stopped. Goodbye!')
})

