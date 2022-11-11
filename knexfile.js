

module.exports = {
  test: {
    client: 'pg',
    version: '10',
    connection: {
      host: 'localhost',
      port: '5432',
      user: 'postgres',
      password: 'sandro10',
      database: 'todolist',
    },
    migrations: {
      directory: 'server/migrations',
    }
  }
}; 