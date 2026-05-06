-- =====================================================
-- RUN THIS IN YOUR SUPABASE DASHBOARD > SQL Editor
-- Populates About page content via CMS (cms_pages row in site_settings)
-- =====================================================

INSERT INTO public.site_settings (id, config)
VALUES (
  'cms_pages',
  jsonb_build_object(
    'hero', jsonb_build_object(
      'title', 'Architects of <span class=''italic text-brand-gold font-medium''>Legacy.</span>',
      'subtitle', 'We don''t just put ink on paper. We translate corporate identity into tangible assets that carry weight, texture, and authority.'
    ),
    'philosophy', jsonb_build_array(
      jsonb_build_object('title', 'Obsessive Precision', 'desc', 'In our world, a millimeter is a mile. We obsess over the grain direction, the ink density, and the foil alignment — because we know you will too.'),
      jsonb_build_object('title', 'Tangible Authority', 'desc', 'Digital is fleeting. Print is permanent. We create assets that sit on desks, stay in pockets, and remain in minds long after the screen has gone dark.'),
      jsonb_build_object('title', 'Future Heritage', 'desc', 'We combine old-world letterpress soul with new-world digital speed — creating artifacts today that will define your corporate history tomorrow.')
    ),
    'timeline', jsonb_build_array(
      jsonb_build_object(
        'year', '2015',
        'title', 'Inception',
        'desc', 'Richa Jain started AtoZ Prints with a vision to make printing affordable and accessible across India — from a single Heidelberg press in New Delhi.',
        'img', 'https://images.unsplash.com/photo-1560416313-414b33c856a9?q=80&w=1974&auto=format&fit=crop'
      ),
      jsonb_build_object(
        'year', '2018',
        'title', 'Pan-India Expansion',
        'desc', 'Integrated end-to-end logistics and supply chain. Began serving pan-India corporate giants with seamless kitting and fulfillment solutions.',
        'img', 'https://images.unsplash.com/photo-1598301257982-0cf014dcc523?q=80&w=2070&auto=format&fit=crop'
      ),
      jsonb_build_object(
        'year', '2022',
        'title', 'Eco-Luxe Launch',
        'desc', 'Launched our sustainable product line. Zero-plastic packaging and FSC-certified recycled materials became a core part of our offering.',
        'img', 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b09?q=80&w=2074&auto=format&fit=crop'
      ),
      jsonb_build_object(
        'year', '2026',
        'title', 'The Future',
        'desc', 'Integrating AI-driven design personalization and expanding our digital-first platform to serve 15 cities and growing.',
        'img', 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'
      )
    ),
    'team', jsonb_build_array(
      jsonb_build_object(
        'name', 'Richa Jain',
        'role', 'Founder & CEO',
        'bio', 'Richa started AtoZ Prints with a belief that great printing should be accessible to every business in India, not just the Fortune 500.',
        'img', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop'
      ),
      jsonb_build_object(
        'name', 'Aman Verma',
        'role', 'Head of Operations',
        'bio', 'Aman ensures every order leaves our facility on time and at the quality standard our clients have come to expect.',
        'img', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop'
      ),
      jsonb_build_object(
        'name', 'Sneha Kapoor',
        'role', 'Lead Designer',
        'bio', 'Sneha translates brand briefs into print-ready masterpieces, with a keen eye for typography and color science.',
        'img', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop'
      ),
      jsonb_build_object(
        'name', 'Rahul Mehta',
        'role', 'Marketing',
        'bio', 'Rahul drives growth and brand storytelling, ensuring AtoZ Prints'' message reaches the right decision-makers.',
        'img', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop'
      ),
      jsonb_build_object(
        'name', 'Pooja Singh',
        'role', 'Customer Support',
        'bio', 'Pooja is the friendly voice behind our support channel, turning queries into lasting client relationships.',
        'img', 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=2070&auto=format&fit=crop'
      )
    ),
    'quote', jsonb_build_object(
      'text', 'We don''t build for the transaction. We build for the legacy. Every print that leaves our press is a testament to permanence in a temporary world.',
      'author', 'Richa Jain',
      'role', 'Founder, AtoZ Prints'
    )
  )
)
ON CONFLICT (id) DO UPDATE SET
  config = EXCLUDED.config,
  updated_at = NOW();
