const knex = require('knex');
const knexfile = require('../knexfile');

// Configurar banco de dados de teste
const testConfig = knexfile.test;

const testDb = knex(testConfig);

beforeAll(async () => {
  // Executar migrations no banco de teste
  await testDb.migrate.latest();
  await testDb.seed.run();
});

afterAll(async () => {
  await testDb.destroy();
});

global.testDb = testDb; 