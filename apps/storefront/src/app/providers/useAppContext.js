import { useAuthContext } from '../../entities/user/model/authContext';
import { useCartContext } from '../../entities/cart/model/cartContext';
import { useWishlistContext } from './wishlistContext';
import { useSearchContext } from './searchContext';
import { useProductContext } from './productContext';

export const useAppContext = () => {
  const auth = useAuthContext();
  const cart = useCartContext();
  const wishlist = useWishlistContext();
  const search = useSearchContext();
  const product = useProductContext();

  return {
    ...auth,
    ...cart,
    ...wishlist,
    ...search,
    ...product,
  };
};
