const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 4000,
    jwtSecret: process.env.SECRET || 'dskfjslkdjfm2',
    mongoUri: process.env.MONGODB_URI ||
      process.env.MONGO_HOST ||
      'mongodb://' + (process.env.IP || 'localhost') + ':' +
      (process.env.MONGO_PORT || '27017') +
      '/mernproject',
    serverUrl: process.env.serverUrl || 'http://localhost:3000'
  }
  
  export default config
  