import { createClient } from '@/lib/supabase/server';
import SettingsClient from './SettingsClient';
import { redirect } from 'next/navigation';

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Basic Fetch
  let initialConfig = {};
  
  try {
    const { data } = await supabase.from('site_settings').select('config').eq('id', 'global').single();
    if ((data as any)?.config) {
      initialConfig = (data as any).config;
    }
  } catch (err) {
    // If the table doesn't exist yet, just pass empty config
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-brand-dark uppercase tracking-tight italic">Global Configuration</h1>
        <p className="text-gray-400 mt-2 text-sm font-bold uppercase tracking-widest">Master Headless CMS Control Panel</p>
      </div>

      <SettingsClient initialConfig={initialConfig} />
    </div>
  );
}
