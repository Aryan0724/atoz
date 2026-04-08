import { createClient } from '@/lib/supabase/server';
import ContentManagerClient from './CmsClient';

export const revalidate = 0;

async function fetchConfigs() {
  const supabase = createClient();
  
  const [cmsRes, globalRes] = await Promise.all([
    supabase.from('site_settings').select('config').eq('id', 'cms_pages').single(),
    supabase.from('site_settings').select('config').eq('id', 'global').single()
  ]);

  return {
    cms: (cmsRes.data as any)?.config || {},
    global: (globalRes.data as any)?.config || {}
  };
}

export default async function CMSAdminPage() {
  const configs = await fetchConfigs();

  return (
    <div className="p-12 max-w-7xl mx-auto pb-32">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-brand-dark tracking-tighter mb-2">
          Global Core <span className="text-brand-pink">Content Manager</span>
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
          Manage all structural components, page graphics, and API keys.
        </p>
      </header>

      <ContentManagerClient 
        initialCmsConfig={configs.cms} 
        initialGlobalConfig={configs.global} 
      />
    </div>
  );
}
