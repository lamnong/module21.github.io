const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./Schemas');

const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

app.use(routes);

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (err) => {
      console.log(err);
    },
    context: authMiddleware
  });
  await server.start();
  server.applyMiddleware({ app })

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
    console.log(`Apollor Server at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`Test Query at https://studio.apollographql.com/sandbox/explorer point to ${server.graphqlPath}`)
  });
};

startServer();
