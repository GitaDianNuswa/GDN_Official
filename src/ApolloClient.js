import { ApolloClient, InMemoryCache } from '@apollo/client';

import { split, HttpLink } from "@apollo/client";
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

const httpLink = new HttpLink({
    uri: "https://loved-stork-39.hasura.app/v1/graphql",
    headers:{
        "x-hasura-admin-secret": "559JwtdsGiWo6sUrRS6c9DgrzbIevwJzivIX2Ifl6zR3rYy3pmQD0NLXXZIp8t3h"
    }
});

const wsLink = new WebSocketLink({
    uri: "wss://loved-stork-39.hasura.app/v1/graphql",
    options: {
        reconnect: true,
        connectionParams: {
            headers:{
                "x-hasura-admin-secret": "559JwtdsGiWo6sUrRS6c9DgrzbIevwJzivIX2Ifl6zR3rYy3pmQD0NLXXZIp8t3h"
            }
        }
    }
})

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === "OperationDefinition" && definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink
);

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});

export default client;