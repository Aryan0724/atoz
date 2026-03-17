import { redirect } from 'next/navigation';

export default function CustomizeRedirect() {
  // Redirect to products catalog since customization requires a product selection
  redirect('/products');
  return null;
}
