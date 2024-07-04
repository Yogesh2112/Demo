import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://graphql.contentful.com/content/v1/spaces/7t7kyukz6rt1',
  headers: {
    Authorization: `Bearer mjIB6FmBNI2tyFteJAZ9FmLuDZoWWLsFEbHBAZ7FSXw`,
  },
  cache: new InMemoryCache(),
});

export default client;
