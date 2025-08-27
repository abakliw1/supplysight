import { gql } from "@apollo/client";

export const GET_WAREHOUSES = gql`
  query Warehouses {
    warehouses {
      code
      name
    }
  }
`;

export const GET_KPIS = gql`
  query KPIs($range: String!) {
    kpis(range: $range) {
      date
      stock
      demand
    }
  }
`;

export const GET_PRODUCTS = gql`
  query Products($search: String, $warehouse: String, $status: String) {
    products(search: $search, warehouse: $warehouse, status: $status) {
      id
      name
      sku
      warehouse
      stock
      demand
    }
  }
`;

export const UPDATE_DEMAND = gql`
  mutation UpdateDemand($id: ID!, $warehouse: String!, $demand: Int!) {
    updateDemand(id: $id, warehouse: $warehouse, demand: $demand) {
      id
      name
      sku
      warehouse
      stock
      demand
    }
  }
`;

export const TRANSFER_STOCK = gql`
  mutation Transfer($id: ID!, $from: String!, $to: String!, $qty: Int!) {
    transferStock(id: $id, from: $from, to: $to, qty: $qty) {
      id
      name
      sku
      warehouse
      stock
      demand
    }
  }
`;
