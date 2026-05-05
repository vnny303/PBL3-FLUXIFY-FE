import { useAuthContext } from '../../entities/user/model/authContext';
import { useCartContext } from '../../entities/cart/model/cartContext';

import { useSearchContext } from './searchContext';
import { useProductContext } from './productContext';

export const useAppContext = () => {
  const auth = useAuthContext();
  const cart = useCartContext();

  const search = useSearchContext();
  const product = useProductContext();

  return {
    ...auth,
    ...cart,

    ...search,
    ...product,
  };
};
