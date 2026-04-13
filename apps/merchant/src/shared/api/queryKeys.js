export const QUERY_KEYS = {
  products: {
    all: ['products'],
    details: (id) => ['products', id],
  },
  categories: {
    all: ['categories']
  },
  orders: {
    all: ['orders'],
    details: (id) => ['orders', id],
  },
  customers: {
    all: ['customers'],
    details: (id) => ['customers', id],
  }
};
