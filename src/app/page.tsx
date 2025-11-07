import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect from the root to the admin login page by default.
  // In a real app, you might have a landing page here or check
  // for an existing session cookie to redirect appropriately.
  redirect('/admin/login');
}
