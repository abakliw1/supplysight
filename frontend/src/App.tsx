import React from "react";
import { ApolloProvider } from "@apollo/client/react";
import { BrowserRouter } from "react-router-dom";
import { client } from "./connection/apolloClient";
import AppRoutes from "./routes";

export default function App(){
    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </ApolloProvider>
    )
}