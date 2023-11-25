import yargs from 'yargs';

async function run() {
  const argv = await yargs(process.argv.slice(2))
    .option('name', {
      alias: 'n',
      describe: 'Your name',
      type: 'string',
    })
    .option('age', {
      alias: 'a',
      describe: 'Your age',
      type: 'number',
    })
    .help()
    .alias('h', 'help')
    .argv;

  console.log('Hello from TypeScript script!');
  console.log('Arguments:', argv);

  if (argv.name) {
    console.log('Name:', argv.name);
  }

  if (argv.age) {
    console.log('Age:', argv.age);
  }
}

run();