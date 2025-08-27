import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const httpLink = createHttpLink({
  uri: API_URL,
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Product: { keyFields: ["id", "warehouse"] },
      Warehouse: { keyFields: ["code"] },
      KPI: { keyFields: ["date"] },

      Query: {
        fields: {
          products: {
            keyArgs: ["search", "warehouse", "status", "group"],
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});
