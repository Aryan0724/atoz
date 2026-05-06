const { Client } = require('pg');

const password = 'kh2DY-bZg_RC&ir';
const encodedPassword = encodeURIComponent(password);
const projectRef = 'fgtxaeyrsrtktazithwl';
const host = '[2406:da1a:6b0:f61a:246c:752d:c203:3634]'; // From migrate_ipv6.js

const blogs = [
  {
    title: "Top 10 Custom Corporate Gift Ideas for 2026: The Ultimate Guide",
    slug: "top-10-custom-corporate-gift-ideas-2026",
    type: "Blog",
    status: "published",
    excerpt: "Discover the best custom corporate gift ideas for 2026. From tech gadgets to eco-friendly stationery, learn how to impress clients and employees with AtoZ Prints.",
    meta_description: "Discover the best custom corporate gift ideas for 2026. From tech gadgets to eco-friendly stationery, learn how to impress clients and employees with AtoZ Prints.",
    featured_image: "https://images.unsplash.com/photo-1549463591-147604343a30?q=80&w=2070&auto=format&fit=crop",
    content: `Corporate gifting has evolved beyond simple pens and calendars. In 2026, the focus is on personalization, utility, and sustainability. A well-chosen gift not only expresses gratitude but also strengthens brand identity and fosters long-term relationships.

Here are the top 10 custom corporate gift ideas that are trending this year:

1. Personalized Tech Organizers
With remote and hybrid work remaining standard, high-quality tech organizers are more valuable than ever. Customizing these with your brand's logo adds a touch of professional elegance.

2. Eco-Friendly Stationery Kits
Sustainability is at the forefront of corporate responsibility. Recycled paper diaries and bamboo pens are not just functional; they send a message about your brand's values.

3. Premium Branded Apparel
Moving beyond generic t-shirts, premium hoodies and jackets with subtle, high-quality embroidery are becoming a favorite for employee kits.

4. Customized Drinkware
High-quality insulated bottles and ceramic mugs remain a staple. At AtoZ Prints, we offer laser engraving that ensures your logo never fades.

5. Desktop Succulent Sets
Add a touch of nature to the workspace. Custom-printed pots with low-maintenance plants are a refreshing gift that stays on a client's desk for years.

6. Wellness & Self-Care Boxes
In 2026, employee mental health is a priority. Custom boxes containing scented candles, eye masks, and herbal teas are highly appreciated.

7. Smart Notebooks
Digital-physical hybrid notebooks that sync with cloud services are the ultimate gift for the modern professional.

8. Custom Leatherette Passport Holders
For the frequent flyer, a customized passport holder in premium leatherette is both stylish and useful.

9. Artisanal Coffee Blends
Curated coffee beans with a custom-branded mug make for a delightful morning routine for your clients.

10. Modular Desk Lamps
Sleek, modern desk lamps with wireless charging bases are the peak of functional corporate gifting.

Conclusion
Choosing the right corporate gift requires a balance of brand representation and recipient value. By opting for high-quality, customized items from AtoZ Prints, you ensure that your brand remains top-of-mind for all the right reasons.`,
    tags: ["Corporate Gifting", "Custom Prints", "Marketing Trends"],
    reading_time: 6,
    author_name: "Richa Jain"
  },
  {
    title: "Why Custom T-Shirts are the Best Marketing Tool for Small Businesses",
    slug: "why-custom-t-shirts-best-marketing-tool-small-businesses",
    type: "Blog",
    status: "published",
    excerpt: "Learn why custom branded T-shirts are a cost-effective and powerful marketing tool for startups and small businesses in India.",
    meta_description: "Learn why custom branded T-shirts are a cost-effective and powerful marketing tool for startups and small businesses in India.",
    featured_image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop",
    content: `In the digital age, it's easy to overlook physical marketing tools. However, custom t-shirts remain one of the most effective and affordable ways to build brand awareness. For small businesses, they act as "walking billboards" that can reach hundreds of potential customers daily.

Why T-Shirts Work
Unlike a digital ad that disappears after a click, a high-quality t-shirt lasts for years. It provides repeated brand exposure at a one-time cost. When your employees or loyal customers wear your branded apparel, they are providing a silent but powerful endorsement of your business.

Key Benefits for Small Businesses:

1. Cost-Effective Branding
Compared to billboard advertising or social media campaigns, bulk printing t-shirts offers a much higher ROI. The cost per impression is incredibly low over the lifespan of the garment.

2. Building Team Unity
Providing your team with custom-designed t-shirts creates a sense of belonging and professionalism. It makes your business appear established and trustworthy.

3. Customer Loyalty & Incentives
Giving away limited-edition branded t-shirts can turn customers into brand advocates. People love high-quality freebies, and wearing your brand makes them feel like part of a community.

4. Versatile Design Options
Whether you want a minimalist logo or a bold, artistic design, modern printing technology at AtoZ Prints allows for limitless creativity. You can match your brand's personality perfectly.

5. Sparking Conversations
A unique or well-designed t-shirt often starts a conversation. It's a natural icebreaker that allows you to talk about your business in a non-intrusive way.

Maximizing the Impact
To make your custom t-shirts successful, focus on quality. A t-shirt that is comfortable and looks good is much more likely to be worn frequently. Use premium cotton and high-fidelity printing to ensure the colors stay vibrant.

At AtoZ Prints, we specialize in helping small businesses across India bring their brand to life. From fabric selection to the final print, we ensure your marketing tool is of the highest caliber.

Start your branding journey today with a custom t-shirt run that makes your business stand out.`,
    tags: ["Branding", "Apparel", "Small Business"],
    reading_time: 5,
    author_name: "Aman Verma"
  }
];

async function seed() {
  const connString = `postgres://postgres.${projectRef}:${encodedPassword}@${host}:5432/postgres`;
  const client = new Client({ 
    connectionString: connString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log(`Connected to database via IPv6`);

    for (const blog of blogs) {
      await client.query(`
        INSERT INTO public.cms_content (
          title, slug, type, status, excerpt, meta_description, featured_image, content, tags, reading_time, author_name
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          excerpt = EXCLUDED.excerpt,
          meta_description = EXCLUDED.meta_description,
          featured_image = EXCLUDED.featured_image,
          content = EXCLUDED.content,
          tags = EXCLUDED.tags,
          reading_time = EXCLUDED.reading_time,
          author_name = EXCLUDED.author_name
      `, [
        blog.title, blog.slug, blog.type, blog.status, blog.excerpt, 
        blog.meta_description, blog.featured_image, blog.content, 
        blog.tags, blog.reading_time, blog.author_name
      ]);
      console.log(`Upserted blog: ${blog.title}`);
    }

    console.log('--- BLOG SEEDING COMPLETE ---');
  } catch (err) {
    console.error(`Error: ${err.message}`);
  } finally {
    await client.end();
  }
}

seed();
