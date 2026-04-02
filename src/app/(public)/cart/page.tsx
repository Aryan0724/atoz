import { redirect } from 'next/navigation';

export default function CartRedirectPage() {
  // If anyone manually navigates to /cart, instantly forward them to checkout
  // to avoid a 404 since cart is a global sliding drawer on this platform.
  redirect('/checkout');
}
