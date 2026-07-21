import { Product } from '../supabase/types';

// ── Helper to encode SVG into a data URI ────────────────────────────────
const svgUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

export const mockProducts: Product[] = [
  {
    "id": "cee3fb84-9b5f-4110-a839-d997b80340c1",
    "name": "Premium Heavyweight Hoodie",
    "slug": "premium-heavyweight-hoodie",
    "description": "High-grade 400GSM fleece hoodie with luxury finish and double-stitched seams.",
    "category": "Apparel",
    "base_price": 1250,
    "moq": 10,
    "delivery_days": "7-10 Days",
    "images": [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format"
    ],
    "template_images": [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format"
    ],
    "quality_levels": [
      "Standard",
      "Premium",
      "Luxury"
    ],
    "customization_fields": [
      "Chest Print",
      "Back Print",
      "Sleeve Print"
    ],
    "packaging_options": [],
    "supported_views": [
      "front",
      "back"
    ],
    "features": [],
    "specifications": {},
    "stock_quantity": 0,
    "is_active": true,
    "created_at": "2026-04-01T15:16:29.137546+00:00",
    "wireframe_images": [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format"
    ],
    "design_areas": {
      "front": {
        "h": 320,
        "w": 200,
        "x": 150,
        "y": 120
      }
    },
    "quality_prices": {},
    "color_variants": [],
    "design_mode": "standard",
    "design_config": {
      "safe_zones": {
        "back": {
          "h": 320,
          "w": 200,
          "x": 150,
          "y": 120
        },
        "front": {
          "h": 320,
          "w": 200,
          "x": 150,
          "y": 120
        }
      },
      "aspect_ratio": "4:5",
      "canvas_width": 500,
      "canvas_height": 625
    },
    "bulk_discount_rules": []
  },
  {
    "id": "9ba91f7b-1d48-41fc-b859-7dea90fb319c",
    "name": "Premium Coffee Mug",
    "slug": "premium-coffee-mug",
    "description": "Sleek 11oz ceramic mug with vibrant color reproduction and microwave safe ceramic.",
    "category": "Drinkware",
    "base_price": 180,
    "moq": 50,
    "delivery_days": "5-7 Days",
    "images": [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format"
    ],
    "template_images": [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format"
    ],
    "quality_levels": [
      "Standard",
      "Premium"
    ],
    "customization_fields": [
      "Wrap Layout",
      "Double Side"
    ],
    "packaging_options": [],
    "supported_views": [
      "front",
      "back"
    ],
    "features": [],
    "specifications": {},
    "stock_quantity": 0,
    "is_active": true,
    "created_at": "2026-04-01T15:16:29.137546+00:00",
    "wireframe_images": [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format"
    ],
    "design_areas": {
      "front": {
        "h": 320,
        "w": 200,
        "x": 150,
        "y": 120
      }
    },
    "quality_prices": {},
    "color_variants": [],
    "design_mode": "standard",
    "design_config": {},
    "bulk_discount_rules": []
  },
  {
    "id": "56ec3570-7e0c-4c1b-bb72-37cd184a1fa7",
    "name": "Executive Notebook",
    "slug": "executive-notebook",
    "description": "Premium A5 leather-bound notebook with high-quality 100GSM paper.",
    "category": "Stationery",
    "base_price": 350,
    "moq": 20,
    "delivery_days": "7 Days",
    "images": [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=1000&auto=format"
    ],
    "template_images": [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=1000&auto=format"
    ],
    "quality_levels": [
      "Standard",
      "Gold Embossed"
    ],
    "customization_fields": [
      "Front Cover Logo",
      "Initialing"
    ],
    "packaging_options": [],
    "supported_views": [
      "front",
      "back"
    ],
    "features": [],
    "specifications": {},
    "stock_quantity": 0,
    "is_active": true,
    "created_at": "2026-04-01T15:16:29.137546+00:00",
    "wireframe_images": [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=1000&auto=format"
    ],
    "design_areas": {
      "front": {
        "h": 320,
        "w": 200,
        "x": 150,
        "y": 120
      }
    },
    "quality_prices": {},
    "color_variants": [],
    "design_mode": "standard",
    "design_config": {},
    "bulk_discount_rules": []
  },
  {
    "id": "ef90cf90-7258-44eb-94b0-cca651774c45",
    "name": "Calendar",
    "slug": "calendar-custom",
    "description": "Fully customized, professional-quality product suitable for branding and promotional use.",
    "category": "stationary",
    "base_price": 199,
    "moq": 50,
    "delivery_days": "7–10 Working Days",
    "images": [
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=800&auto=format&fit=crop"
    ],
    "template_images": [],
    "quality_levels": [
      "Basic",
      "Standard",
      "Premium",
      "Luxury"
    ],
    "customization_fields": [
      "Logo",
      "Name",
      "Text",
      "Color"
    ],
    "packaging_options": [
      "Standard",
      "Premium"
    ],
    "supported_views": [
      "front"
    ],
    "features": [],
    "specifications": {},
    "stock_quantity": 0,
    "is_active": true,
    "created_at": "2026-04-15T18:48:49.01512+00:00",
    "wireframe_images": [
      "data:image/svg+xml;utf8,<svg viewBox=\"0 0 500 500\" xmlns=\"http://www.w3.org/2000/svg\">\r\n      <polygon points=\"50,450 450,450 400,100 100,100\" fill=\"none\" stroke=\"#222\" stroke-width=\"4\"/>\r\n      <rect x=\"70\" y=\"120\" width=\"360\" height=\"300\" fill=\"#ffffff\" stroke=\"#222\" stroke-width=\"4\" rx=\"8\"/>\r\n      <rect x=\"100\" y=\"100\" width=\"20\" height=\"40\" fill=\"none\" stroke=\"#222\" stroke-width=\"4\" rx=\"10\"/>\r\n      <rect x=\"150\" y=\"100\" width=\"20\" height=\"40\" fill=\"none\" stroke=\"#222\" stroke-width=\"4\" rx=\"10\"/>\r\n      <rect x=\"200\" y=\"100\" width=\"20\" height=\"40\" fill=\"none\" stroke=\"#222\" stroke-width=\"4\" rx=\"10\"/>\r\n      <rect x=\"250\" y=\"100\" width=\"20\" height=\"40\" fill=\"none\" stroke=\"#222\" stroke-width=\"4\" rx=\"10\"/>\r\n      <rect x=\"300\" y=\"100\" width=\"20\" height=\"40\" fill=\"none\" stroke=\"#222\" stroke-width=\"4\" rx=\"10\"/>\r\n      <rect x=\"350\" y=\"100\" width=\"20\" height=\"40\" fill=\"none\" stroke=\"#222\" stroke-width=\"4\" rx=\"10\"/>\r\n      <line x1=\"70\" y1=\"200\" x2=\"430\" y2=\"200\" stroke=\"#ccc\" stroke-width=\"3\"/>\r\n      <line x1=\"70\" y1=\"250\" x2=\"430\" y2=\"250\" stroke=\"#ccc\" stroke-width=\"3\"/>\r\n      <line x1=\"70\" y1=\"300\" x2=\"430\" y2=\"300\" stroke=\"#ccc\" stroke-width=\"3\"/>\r\n      <line x1=\"140\" y1=\"200\" x2=\"140\" y2=\"420\" stroke=\"#ccc\" stroke-width=\"3\"/>\r\n      <line x1=\"210\" y1=\"200\" x2=\"210\" y2=\"420\" stroke=\"#ccc\" stroke-width=\"3\"/>\r\n      <line x1=\"280\" y1=\"200\" x2=\"280\" y2=\"420\" stroke=\"#ccc\" stroke-width=\"3\"/>\r\n      <line x1=\"350\" y1=\"200\" x2=\"350\" y2=\"420\" stroke=\"#ccc\" stroke-width=\"3\"/>\r\n    </svg>"
    ],
    "design_areas": {
      "front": {
        "h": 320,
        "w": 200,
        "x": 150,
        "y": 120
      }
    },
    "quality_prices": {},
    "color_variants": [],
    "design_mode": "standard",
    "design_config": {},
    "bulk_discount_rules": []
  },
  {
    "id": "07f58d45-14fc-4197-8041-c4ba537dc35a",
    "name": "Wedding Card",
    "slug": "wedding-card-custom",
    "description": "Fully customized, professional-quality product suitable for branding and promotional use.",
    "category": "stationary",
    "base_price": 49,
    "moq": 50,
    "delivery_days": "7–10 Working Days",
    "images": [
      "/images/products/wedding-card.png"
    ],
    "template_images": [],
    "quality_levels": [
      "Basic",
      "Standard",
      "Premium",
      "Luxury"
    ],
    "customization_fields": [
      "Logo",
      "Name",
      "Text",
      "Color"
    ],
    "packaging_options": [
      "Standard",
      "Premium"
    ],
    "supported_views": [
      "front"
    ],
    "features": [],
    "specifications": {},
    "stock_quantity": 0,
    "is_active": true,
    "created_at": "2026-04-15T18:48:49.01512+00:00",
    "wireframe_images": [
      "data:image/svg+xml;utf8,<svg viewBox=\"0 0 500 500\" xmlns=\"http://www.w3.org/2000/svg\">\r\n      <rect x=\"50\" y=\"50\" width=\"200\" height=\"400\" fill=\"#ffffff\" stroke=\"#222\" stroke-width=\"4\" rx=\"10\"/>\r\n      <polygon points=\"250,50 450,100 450,450 250,450\" fill=\"#ffffff\" stroke=\"#222\" stroke-width=\"4\" stroke-linejoin=\"round\"/>\r\n      <circle cx=\"350\" cy=\"250\" r=\"40\" fill=\"none\" stroke=\"#222\" stroke-width=\"3\" stroke-dasharray=\"10 5\"/>\r\n      <circle cx=\"350\" cy=\"250\" r=\"30\" fill=\"none\" stroke=\"#222\" stroke-width=\"2\"/>\r\n      <line x1=\"290\" y1=\"320\" x2=\"410\" y2=\"320\" stroke=\"#ccc\" stroke-width=\"2\"/>\r\n      <line x1=\"310\" y1=\"340\" x2=\"390\" y2=\"340\" stroke=\"#ccc\" stroke-width=\"2\"/>\r\n    </svg>"
    ],
    "design_areas": {
      "front": {
        "h": 320,
        "w": 200,
        "x": 150,
        "y": 120
      }
    },
    "quality_prices": {},
    "color_variants": [
      {
        "name": "Elite Doli 11",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/11/front.svg",
          "/templates/wc/11/back.svg"
        ]
      },
      {
        "name": "Elite Ganesha 12",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/12/front.svg",
          "/templates/wc/12/back.svg"
        ]
      },
      {
        "name": "Elite Kalash 13",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/13/front.svg",
          "/templates/wc/13/back.svg"
        ]
      },
      {
        "name": "Elite Peacock 14",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/14/front.svg",
          "/templates/wc/14/back.svg"
        ]
      },
      {
        "name": "Elite Mandala 15",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/15/front.svg",
          "/templates/wc/15/back.svg"
        ]
      },
      {
        "name": "Elite Doli 16",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/16/front.svg",
          "/templates/wc/16/back.svg"
        ]
      },
      {
        "name": "Elite Ganesha 17",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/17/front.svg",
          "/templates/wc/17/back.svg"
        ]
      },
      {
        "name": "Elite Kalash 18",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/18/front.svg",
          "/templates/wc/18/back.svg"
        ]
      },
      {
        "name": "Elite Peacock 19",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/19/front.svg",
          "/templates/wc/19/back.svg"
        ]
      },
      {
        "name": "Elite Mandala 20",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/20/front.svg",
          "/templates/wc/20/back.svg"
        ]
      },
      {
        "name": "Elite Doli 21",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/21/front.svg",
          "/templates/wc/21/back.svg"
        ]
      },
      {
        "name": "Elite Ganesha 22",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/22/front.svg",
          "/templates/wc/22/back.svg"
        ]
      },
      {
        "name": "Elite Kalash 23",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/23/front.svg",
          "/templates/wc/23/back.svg"
        ]
      },
      {
        "name": "Elite Peacock 24",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/24/front.svg",
          "/templates/wc/24/back.svg"
        ]
      },
      {
        "name": "Elite Mandala 25",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/25/front.svg",
          "/templates/wc/25/back.svg"
        ]
      },
      {
        "name": "Elite Doli 26",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/26/front.svg",
          "/templates/wc/26/back.svg"
        ]
      },
      {
        "name": "Elite Ganesha 27",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/27/front.svg",
          "/templates/wc/27/back.svg"
        ]
      },
      {
        "name": "Elite Kalash 28",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/28/front.svg",
          "/templates/wc/28/back.svg"
        ]
      },
      {
        "name": "Elite Peacock 29",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/29/front.svg",
          "/templates/wc/29/back.svg"
        ]
      },
      {
        "name": "Elite Mandala 30",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/30/front.svg",
          "/templates/wc/30/back.svg"
        ]
      },
      {
        "name": "Elite Doli 31",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/31/front.svg",
          "/templates/wc/31/back.svg"
        ]
      },
      {
        "name": "Elite Ganesha 32",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/32/front.svg",
          "/templates/wc/32/back.svg"
        ]
      },
      {
        "name": "Elite Kalash 33",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/33/front.svg",
          "/templates/wc/33/back.svg"
        ]
      },
      {
        "name": "Elite Peacock 34",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/34/front.svg",
          "/templates/wc/34/back.svg"
        ]
      },
      {
        "name": "Elite Mandala 35",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/35/front.svg",
          "/templates/wc/35/back.svg"
        ]
      },
      {
        "name": "Elite Doli 36",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/36/front.svg",
          "/templates/wc/36/back.svg"
        ]
      },
      {
        "name": "Elite Ganesha 37",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/37/front.svg",
          "/templates/wc/37/back.svg"
        ]
      },
      {
        "name": "Elite Kalash 38",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/38/front.svg",
          "/templates/wc/38/back.svg"
        ]
      },
      {
        "name": "Elite Peacock 39",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/39/front.svg",
          "/templates/wc/39/back.svg"
        ]
      },
      {
        "name": "Elite Mandala 40",
        "hex": "#D4AF37",
        "wireframe_images": [
          "/templates/wc/40/front.svg",
          "/templates/wc/40/back.svg"
        ]
      }
    ],
    "design_mode": "template_form",
    "design_config": {
      "mappings": {
        "0_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "0_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "1_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "1_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "2_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "2_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "3_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "3_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "4_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "4_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "5_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "5_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "6_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "6_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "7_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "7_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "8_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "8_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "9_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "9_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "10_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "10_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "11_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "11_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "12_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "12_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "13_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "13_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "14_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "14_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "15_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "15_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "16_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "16_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "17_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "17_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "18_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "18_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "19_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "19_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "20_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "20_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "21_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "21_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "22_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "22_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "23_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "23_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "24_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "24_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "25_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "25_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "26_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "26_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "27_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "27_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "28_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "28_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        },
        "29_0": {
          "mantra": {
            "x": 50,
            "y": 12,
            "fontSize": 24,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "italic": true
          },
          "title": {
            "x": 50,
            "y": 22,
            "fontSize": 48,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "subtitle": {
            "x": 50,
            "y": 32,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "groom": {
            "x": 50,
            "y": 48,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "ampersand": {
            "x": 50,
            "y": 58,
            "fontSize": 40,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700"
          },
          "bride": {
            "x": 50,
            "y": 68,
            "fontSize": 80,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700",
            "fontFamily": "serif"
          },
          "date": {
            "x": 50,
            "y": 88,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          }
        },
        "29_1": {
          "invite_body": {
            "x": 50,
            "y": 25,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 80
          },
          "parents": {
            "x": 50,
            "y": 45,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 85
          },
          "venue_header": {
            "x": 50,
            "y": 65,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "venue": {
            "x": 50,
            "y": 72,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center",
            "color": "#FFD700",
            "maxWidth": 90
          },
          "time": {
            "x": 50,
            "y": 85,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFD700"
          },
          "rsvp": {
            "x": 15,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "color": "#FFD700"
          },
          "hashtag": {
            "x": 85,
            "y": 94,
            "fontSize": 16,
            "fontWeight": "bold",
            "align": "right",
            "color": "#FFD700"
          }
        }
      },
      "fields": [
        {
          "id": "mantra",
          "label": "Sacred Mantra (Front)",
          "type": "text",
          "placeholder": "|| Shri Ganeshaya Namah ||"
        },
        {
          "id": "title",
          "label": "Main Title (Front)",
          "type": "text",
          "placeholder": "SAVE THE DATE"
        },
        {
          "id": "subtitle",
          "label": "Subtitle (Front)",
          "type": "text",
          "placeholder": "THE WEDDING OF"
        },
        {
          "id": "groom",
          "label": "Groom Name (Front)",
          "type": "text",
          "placeholder": "Prashant Sharma"
        },
        {
          "id": "bride",
          "label": "Bride Name (Front)",
          "type": "text",
          "placeholder": "Anjali Verma"
        },
        {
          "id": "date",
          "label": "Wedding Date (Front)",
          "type": "text",
          "placeholder": "SUNDAY, 15TH OCTOBER 2024"
        },
        {
          "id": "invite_body",
          "label": "Invitation Text (Back)",
          "type": "textarea",
          "placeholder": "Together with their families, we request the honor of your presence."
        },
        {
          "id": "parents",
          "label": "Family Details (Back)",
          "type": "textarea",
          "placeholder": "Son of Mr. & Mrs. Sharma \n Daughter of Mr. & Mrs. Verma"
        },
        {
          "id": "venue_header",
          "label": "Venue Header (Back)",
          "type": "text",
          "placeholder": "LOCATION"
        },
        {
          "id": "venue",
          "label": "Full Address (Back)",
          "type": "textarea",
          "placeholder": "The Grand Regency, MG Road, New Delhi"
        },
        {
          "id": "time",
          "label": "Event Time (Back)",
          "type": "text",
          "placeholder": "AT 8:00 PM ONWARDS"
        },
        {
          "id": "rsvp",
          "label": "RSVP Info (Back)",
          "type": "text",
          "placeholder": "RSVP: +91 9876543210"
        },
        {
          "id": "hashtag",
          "label": "Hashtag (Back)",
          "type": "text",
          "placeholder": "#PrashantWedsAnjali"
        }
      ]
    },
    "bulk_discount_rules": []
  },
  {
    "id": "cb899af0-c2fe-4852-8fe6-d73484ed0c69",
    "name": "Employee Joining Kit",
    "slug": "employee-joining-kit",
    "description": "Fully customized, professional-quality product suitable for branding and promotional use.",
    "category": "corporate",
    "base_price": 1499,
    "moq": 50,
    "delivery_days": "7–10 Working Days",
    "images": [
      "/images/products/employee-joining-kit.png"
    ],
    "template_images": [],
    "quality_levels": [
      "Basic",
      "Standard",
      "Premium",
      "Luxury"
    ],
    "customization_fields": [
      "Logo",
      "Name",
      "Text",
      "Color"
    ],
    "packaging_options": [
      "Standard",
      "Premium"
    ],
    "supported_views": [
      "front"
    ],
    "features": [],
    "specifications": {},
    "stock_quantity": 0,
    "is_active": true,
    "created_at": "2026-04-15T18:48:49.01512+00:00",
    "wireframe_images": [
      "data:image/svg+xml;utf8,<svg viewBox=\"0 0 500 500\" xmlns=\"http://www.w3.org/2000/svg\">\r\n      <rect x=\"40\" y=\"40\" width=\"420\" height=\"420\" fill=\"#ffffff\" stroke=\"#222\" stroke-width=\"6\" rx=\"20\"/>\r\n      <rect x=\"70\" y=\"70\" width=\"180\" height=\"250\" fill=\"#ffffff\" stroke=\"#222\" stroke-width=\"3\" rx=\"10\"/>\r\n      <line x1=\"90\" y1=\"70\" x2=\"90\" y2=\"320\" stroke=\"#222\" stroke-width=\"3\"/>\r\n      <rect x=\"280\" y=\"70\" width=\"30\" height=\"200\" fill=\"#ffffff\" stroke=\"#222\" stroke-width=\"3\" rx=\"15\"/>\r\n      <line x1=\"285\" y1=\"100\" x2=\"305\" y2=\"100\" stroke=\"#222\" stroke-width=\"2\"/>\r\n      <circle cx=\"370\" cy=\"170\" r=\"50\" fill=\"#ffffff\" stroke=\"#222\" stroke-width=\"3\"/>\r\n      <circle cx=\"370\" cy=\"170\" r=\"30\" fill=\"none\" stroke=\"#222\" stroke-width=\"2\"/>\r\n      <rect x=\"70\" y=\"340\" width=\"360\" height=\"80\" fill=\"#ffffff\" stroke=\"#222\" stroke-width=\"3\" rx=\"10\"/>\r\n      <path d=\"M220,340 Q250,370 280,340\" fill=\"none\" stroke=\"#222\" stroke-width=\"3\"/>\r\n    </svg>"
    ],
    "design_areas": {
      "front": {
        "h": 320,
        "w": 200,
        "x": 150,
        "y": 120
      }
    },
    "quality_prices": {},
    "color_variants": [],
    "design_mode": "standard",
    "design_config": {},
    "bulk_discount_rules": []
  },
  {
    "id": "865304fd-7582-49ee-8fc8-9d1393c17cb4",
    "name": "Diary with Logo",
    "slug": "diary-with-logo",
    "description": "Fully customized, professional-quality product suitable for branding and promotional use.",
    "category": "stationary",
    "base_price": 249,
    "moq": 50,
    "delivery_days": "7–10 Working Days",
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop"
    ],
    "template_images": [],
    "quality_levels": [
      "Basic",
      "Standard",
      "Premium",
      "Luxury"
    ],
    "customization_fields": [
      "Logo",
      "Name",
      "Text",
      "Color"
    ],
    "packaging_options": [
      "Standard",
      "Premium"
    ],
    "supported_views": [
      "front"
    ],
    "features": [],
    "specifications": {},
    "stock_quantity": 0,
    "is_active": true,
    "created_at": "2026-04-15T18:48:49.01512+00:00",
    "wireframe_images": [
      "data:image/svg+xml;utf8,<svg viewBox=\"0 0 400 500\" xmlns=\"http://www.w3.org/2000/svg\">\r\n      <rect x=\"40\" y=\"30\" width=\"40\" height=\"440\" fill=\"none\" stroke=\"#222\" stroke-width=\"5\" rx=\"5\"/>\r\n      <rect x=\"80\" y=\"30\" width=\"280\" height=\"440\" fill=\"#ffffff\" stroke=\"#222\" stroke-width=\"5\" rx=\"8\"/>\r\n      <line x1=\"100\" y1=\"30\" x2=\"100\" y2=\"470\" stroke=\"#ccc\" stroke-width=\"2\"/>\r\n      <path d=\"M120,470 L120,500 L135,485 L150,500 L150,470 Z\" fill=\"none\" stroke=\"#222\" stroke-width=\"3\"/>\r\n      <rect x=\"330\" y=\"30\" width=\"15\" height=\"440\" fill=\"none\" stroke=\"#222\" stroke-width=\"2\"/>\r\n    </svg>"
    ],
    "design_areas": {
      "front": {
        "h": 320,
        "w": 200,
        "x": 150,
        "y": 120
      }
    },
    "quality_prices": {},
    "color_variants": [],
    "design_mode": "standard",
    "design_config": {},
    "bulk_discount_rules": []
  },
  {
    "id": "08588f6f-984b-432f-9d42-368a615b9f16",
    "name": "ID Card",
    "slug": "id-card-custom",
    "description": "Fully customized, professional-quality product suitable for branding and promotional use.",
    "category": "stationary",
    "base_price": 29,
    "moq": 50,
    "delivery_days": "7–10 Working Days",
    "images": [
      "/images/products/id-card-front.png",
      "/images/products/id-card-back.jpeg"
    ],
    "template_images": [],
    "quality_levels": [
      "Basic",
      "Standard",
      "Premium",
      "Luxury"
    ],
    "customization_fields": [
      "Logo",
      "Name",
      "Text",
      "Color"
    ],
    "packaging_options": [
      "Standard",
      "Premium"
    ],
    "supported_views": [
      "front"
    ],
    "features": [],
    "specifications": {},
    "stock_quantity": 0,
    "is_active": true,
    "created_at": "2026-04-15T18:48:49.01512+00:00",
    "wireframe_images": [
      "data:image/svg+xml;utf8,<svg viewBox=\"0 0 300 500\" xmlns=\"http://www.w3.org/2000/svg\">\r\n      <rect x=\"130\" y=\"10\" width=\"40\" height=\"30\" fill=\"none\" stroke=\"#222\" stroke-width=\"4\" rx=\"10\"/>\r\n      <circle cx=\"150\" cy=\"65\" r=\"15\" fill=\"none\" stroke=\"#222\" stroke-width=\"3\"/>\r\n      <rect x=\"40\" y=\"50\" width=\"220\" height=\"350\" fill=\"#ffffff\" stroke=\"#222\" stroke-width=\"5\" rx=\"15\"/>\r\n      <rect x=\"100\" y=\"130\" width=\"100\" height=\"100\" fill=\"none\" stroke=\"#222\" stroke-width=\"3\" rx=\"10\"/>\r\n      <circle cx=\"150\" cy=\"165\" r=\"20\" fill=\"none\" stroke=\"#222\" stroke-width=\"2\"/>\r\n      <path d=\"M110,230 Q150,190 190,230\" fill=\"none\" stroke=\"#222\" stroke-width=\"2\"/>\r\n      <line x1=\"100\" y1=\"260\" x2=\"200\" y2=\"260\" stroke=\"#222\" stroke-width=\"4\"/>\r\n      <line x1=\"120\" y1=\"280\" x2=\"180\" y2=\"280\" stroke=\"#ccc\" stroke-width=\"3\"/>\r\n      <line x1=\"70\" y1=\"320\" x2=\"230\" y2=\"320\" stroke=\"#ccc\" stroke-width=\"2\"/>\r\n      <line x1=\"70\" y1=\"340\" x2=\"230\" y2=\"340\" stroke=\"#ccc\" stroke-width=\"2\"/>\r\n    </svg>"
    ],
    "design_areas": {
      "front": {
        "h": 320,
        "w": 200,
        "x": 150,
        "y": 120
      }
    },
    "quality_prices": {},
    "color_variants": [
      {
        "name": "Minimalist Elite 11",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/11/front.svg",
          "/templates/id/11/back.svg"
        ]
      },
      {
        "name": "Tech Elite 12",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/12/front.svg",
          "/templates/id/12/back.svg"
        ]
      },
      {
        "name": "Creative Elite 13",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/13/front.svg",
          "/templates/id/13/back.svg"
        ]
      },
      {
        "name": "Corporate Elite 14",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/14/front.svg",
          "/templates/id/14/back.svg"
        ]
      },
      {
        "name": "Abstract Elite 15",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/15/front.svg",
          "/templates/id/15/back.svg"
        ]
      },
      {
        "name": "Minimalist Elite 16",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/16/front.svg",
          "/templates/id/16/back.svg"
        ]
      },
      {
        "name": "Tech Elite 17",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/17/front.svg",
          "/templates/id/17/back.svg"
        ]
      },
      {
        "name": "Creative Elite 18",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/18/front.svg",
          "/templates/id/18/back.svg"
        ]
      },
      {
        "name": "Corporate Elite 19",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/19/front.svg",
          "/templates/id/19/back.svg"
        ]
      },
      {
        "name": "Abstract Elite 20",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/20/front.svg",
          "/templates/id/20/back.svg"
        ]
      },
      {
        "name": "Minimalist Elite 21",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/21/front.svg",
          "/templates/id/21/back.svg"
        ]
      },
      {
        "name": "Tech Elite 22",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/22/front.svg",
          "/templates/id/22/back.svg"
        ]
      },
      {
        "name": "Creative Elite 23",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/23/front.svg",
          "/templates/id/23/back.svg"
        ]
      },
      {
        "name": "Corporate Elite 24",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/24/front.svg",
          "/templates/id/24/back.svg"
        ]
      },
      {
        "name": "Abstract Elite 25",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/25/front.svg",
          "/templates/id/25/back.svg"
        ]
      },
      {
        "name": "Minimalist Elite 26",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/26/front.svg",
          "/templates/id/26/back.svg"
        ]
      },
      {
        "name": "Tech Elite 27",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/27/front.svg",
          "/templates/id/27/back.svg"
        ]
      },
      {
        "name": "Creative Elite 28",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/28/front.svg",
          "/templates/id/28/back.svg"
        ]
      },
      {
        "name": "Corporate Elite 29",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/29/front.svg",
          "/templates/id/29/back.svg"
        ]
      },
      {
        "name": "Abstract Elite 30",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/30/front.svg",
          "/templates/id/30/back.svg"
        ]
      },
      {
        "name": "Minimalist Elite 31",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/31/front.svg",
          "/templates/id/31/back.svg"
        ]
      },
      {
        "name": "Tech Elite 32",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/32/front.svg",
          "/templates/id/32/back.svg"
        ]
      },
      {
        "name": "Creative Elite 33",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/33/front.svg",
          "/templates/id/33/back.svg"
        ]
      },
      {
        "name": "Corporate Elite 34",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/34/front.svg",
          "/templates/id/34/back.svg"
        ]
      },
      {
        "name": "Abstract Elite 35",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/35/front.svg",
          "/templates/id/35/back.svg"
        ]
      },
      {
        "name": "Minimalist Elite 36",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/36/front.svg",
          "/templates/id/36/back.svg"
        ]
      },
      {
        "name": "Tech Elite 37",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/37/front.svg",
          "/templates/id/37/back.svg"
        ]
      },
      {
        "name": "Creative Elite 38",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/38/front.svg",
          "/templates/id/38/back.svg"
        ]
      },
      {
        "name": "Corporate Elite 39",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/39/front.svg",
          "/templates/id/39/back.svg"
        ]
      },
      {
        "name": "Abstract Elite 40",
        "hex": "#1E3A8A",
        "wireframe_images": [
          "/templates/id/40/front.svg",
          "/templates/id/40/back.svg"
        ]
      }
    ],
    "design_mode": "template_form",
    "design_config": {
      "mappings": {
        "0_0": {
          "logo": {
            "x": 50,
            "y": 8,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "center"
          },
          "company_name": {
            "x": 28,
            "y": 8,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "left"
          },
          "photo": {
            "x": 42.5,
            "y": 21,
            "w": 40,
            "h": 28,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 62.5,
            "y": 58,
            "fontSize": 36,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 62.5,
            "y": 66,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 62.5,
            "y": 76,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "0_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "1_0": {
          "logo": {
            "x": 42,
            "y": 6,
            "w": 16,
            "h": 8,
            "type": "image",
            "align": "center"
          },
          "company_name": {
            "x": 50,
            "y": 16,
            "fontSize": 22,
            "fontWeight": "bold",
            "align": "center"
          },
          "photo": {
            "x": 30,
            "y": 20,
            "w": 40,
            "h": 28,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 50,
            "y": 62,
            "fontSize": 34,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 50,
            "y": 70,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 50,
            "y": 82,
            "fontSize": 20,
            "fontWeight": "bold",
            "align": "center",
            "color": "#F59E0B"
          }
        },
        "1_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "2_0": {
          "logo": {
            "x": 5,
            "y": 5,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "left"
          },
          "company_name": {
            "x": 20,
            "y": 9,
            "fontSize": 26,
            "fontWeight": "bold",
            "align": "left",
            "color": "#FFFFFF"
          },
          "photo": {
            "x": 6.25,
            "y": 29.5,
            "w": 43.75,
            "h": 29.5,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 55,
            "y": 42,
            "fontSize": 38,
            "fontWeight": "bold",
            "align": "left"
          },
          "designation": {
            "x": 55,
            "y": 50,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "left"
          },
          "id_no": {
            "x": 55,
            "y": 60,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "left"
          }
        },
        "2_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "3_0": {
          "logo": {
            "x": 40,
            "y": 8,
            "w": 20,
            "h": 10,
            "type": "image",
            "align": "center"
          },
          "company_name": {
            "x": 50,
            "y": 20,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center"
          },
          "photo": {
            "x": 31,
            "y": 23,
            "w": 38,
            "h": 28,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 50,
            "y": 60,
            "fontSize": 34,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 50,
            "y": 68,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 50,
            "y": 78,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "3_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "4_0": {
          "logo": {
            "x": 10,
            "y": 6,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "left"
          },
          "company_name": {
            "x": 50,
            "y": 15,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center"
          },
          "photo": {
            "x": 22,
            "y": 25,
            "w": 56,
            "h": 33,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 50,
            "y": 66,
            "fontSize": 38,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 50,
            "y": 74,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 50,
            "y": 84,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "4_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "5_0": {
          "logo": {
            "x": 50,
            "y": 8,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "center"
          },
          "company_name": {
            "x": 28,
            "y": 8,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "left"
          },
          "photo": {
            "x": 42.5,
            "y": 21,
            "w": 40,
            "h": 28,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 62.5,
            "y": 58,
            "fontSize": 36,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 62.5,
            "y": 66,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 62.5,
            "y": 76,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "5_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "6_0": {
          "logo": {
            "x": 42,
            "y": 6,
            "w": 16,
            "h": 8,
            "type": "image",
            "align": "center"
          },
          "company_name": {
            "x": 50,
            "y": 16,
            "fontSize": 22,
            "fontWeight": "bold",
            "align": "center"
          },
          "photo": {
            "x": 30,
            "y": 20,
            "w": 40,
            "h": 28,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 50,
            "y": 62,
            "fontSize": 34,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 50,
            "y": 70,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 50,
            "y": 82,
            "fontSize": 20,
            "fontWeight": "bold",
            "align": "center",
            "color": "#F59E0B"
          }
        },
        "6_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "7_0": {
          "logo": {
            "x": 5,
            "y": 5,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "left"
          },
          "company_name": {
            "x": 20,
            "y": 9,
            "fontSize": 26,
            "fontWeight": "bold",
            "align": "left",
            "color": "#FFFFFF"
          },
          "photo": {
            "x": 6.25,
            "y": 29.5,
            "w": 43.75,
            "h": 29.5,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 55,
            "y": 42,
            "fontSize": 38,
            "fontWeight": "bold",
            "align": "left"
          },
          "designation": {
            "x": 55,
            "y": 50,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "left"
          },
          "id_no": {
            "x": 55,
            "y": 60,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "left"
          }
        },
        "7_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "8_0": {
          "logo": {
            "x": 40,
            "y": 8,
            "w": 20,
            "h": 10,
            "type": "image",
            "align": "center"
          },
          "company_name": {
            "x": 50,
            "y": 20,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center"
          },
          "photo": {
            "x": 31,
            "y": 23,
            "w": 38,
            "h": 28,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 50,
            "y": 60,
            "fontSize": 34,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 50,
            "y": 68,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 50,
            "y": 78,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "8_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "9_0": {
          "logo": {
            "x": 10,
            "y": 6,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "left"
          },
          "company_name": {
            "x": 50,
            "y": 15,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center"
          },
          "photo": {
            "x": 22,
            "y": 25,
            "w": 56,
            "h": 33,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 50,
            "y": 66,
            "fontSize": 38,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 50,
            "y": 74,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 50,
            "y": 84,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "9_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "10_0": {
          "logo": {
            "x": 50,
            "y": 8,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "center"
          },
          "company_name": {
            "x": 28,
            "y": 8,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "left"
          },
          "photo": {
            "x": 42.5,
            "y": 21,
            "w": 40,
            "h": 28,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 62.5,
            "y": 58,
            "fontSize": 36,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 62.5,
            "y": 66,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 62.5,
            "y": 76,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "10_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "11_0": {
          "logo": {
            "x": 42,
            "y": 6,
            "w": 16,
            "h": 8,
            "type": "image",
            "align": "center"
          },
          "company_name": {
            "x": 50,
            "y": 16,
            "fontSize": 22,
            "fontWeight": "bold",
            "align": "center"
          },
          "photo": {
            "x": 30,
            "y": 20,
            "w": 40,
            "h": 28,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 50,
            "y": 62,
            "fontSize": 34,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 50,
            "y": 70,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 50,
            "y": 82,
            "fontSize": 20,
            "fontWeight": "bold",
            "align": "center",
            "color": "#F59E0B"
          }
        },
        "11_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "12_0": {
          "logo": {
            "x": 5,
            "y": 5,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "left"
          },
          "company_name": {
            "x": 20,
            "y": 9,
            "fontSize": 26,
            "fontWeight": "bold",
            "align": "left",
            "color": "#FFFFFF"
          },
          "photo": {
            "x": 6.25,
            "y": 29.5,
            "w": 43.75,
            "h": 29.5,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 55,
            "y": 42,
            "fontSize": 38,
            "fontWeight": "bold",
            "align": "left"
          },
          "designation": {
            "x": 55,
            "y": 50,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "left"
          },
          "id_no": {
            "x": 55,
            "y": 60,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "left"
          }
        },
        "12_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "13_0": {
          "logo": {
            "x": 40,
            "y": 8,
            "w": 20,
            "h": 10,
            "type": "image",
            "align": "center"
          },
          "company_name": {
            "x": 50,
            "y": 20,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center"
          },
          "photo": {
            "x": 31,
            "y": 23,
            "w": 38,
            "h": 28,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 50,
            "y": 60,
            "fontSize": 34,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 50,
            "y": 68,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 50,
            "y": 78,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "13_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "14_0": {
          "logo": {
            "x": 10,
            "y": 6,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "left"
          },
          "company_name": {
            "x": 50,
            "y": 15,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center"
          },
          "photo": {
            "x": 22,
            "y": 25,
            "w": 56,
            "h": 33,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 50,
            "y": 66,
            "fontSize": 38,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 50,
            "y": 74,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 50,
            "y": 84,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "14_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "15_0": {
          "logo": {
            "x": 50,
            "y": 8,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "center"
          },
          "company_name": {
            "x": 28,
            "y": 8,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "left"
          },
          "photo": {
            "x": 42.5,
            "y": 21,
            "w": 40,
            "h": 28,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 62.5,
            "y": 58,
            "fontSize": 36,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 62.5,
            "y": 66,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 62.5,
            "y": 76,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "15_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "16_0": {
          "logo": {
            "x": 42,
            "y": 6,
            "w": 16,
            "h": 8,
            "type": "image",
            "align": "center"
          },
          "company_name": {
            "x": 50,
            "y": 16,
            "fontSize": 22,
            "fontWeight": "bold",
            "align": "center"
          },
          "photo": {
            "x": 30,
            "y": 20,
            "w": 40,
            "h": 28,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 50,
            "y": 62,
            "fontSize": 34,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 50,
            "y": 70,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 50,
            "y": 82,
            "fontSize": 20,
            "fontWeight": "bold",
            "align": "center",
            "color": "#F59E0B"
          }
        },
        "16_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "17_0": {
          "logo": {
            "x": 5,
            "y": 5,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "left"
          },
          "company_name": {
            "x": 20,
            "y": 9,
            "fontSize": 26,
            "fontWeight": "bold",
            "align": "left",
            "color": "#FFFFFF"
          },
          "photo": {
            "x": 6.25,
            "y": 29.5,
            "w": 43.75,
            "h": 29.5,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 55,
            "y": 42,
            "fontSize": 38,
            "fontWeight": "bold",
            "align": "left"
          },
          "designation": {
            "x": 55,
            "y": 50,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "left"
          },
          "id_no": {
            "x": 55,
            "y": 60,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "left"
          }
        },
        "17_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "18_0": {
          "logo": {
            "x": 40,
            "y": 8,
            "w": 20,
            "h": 10,
            "type": "image",
            "align": "center"
          },
          "company_name": {
            "x": 50,
            "y": 20,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center"
          },
          "photo": {
            "x": 31,
            "y": 23,
            "w": 38,
            "h": 28,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 50,
            "y": 60,
            "fontSize": 34,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 50,
            "y": 68,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 50,
            "y": 78,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "18_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "19_0": {
          "logo": {
            "x": 10,
            "y": 6,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "left"
          },
          "company_name": {
            "x": 50,
            "y": 15,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center"
          },
          "photo": {
            "x": 22,
            "y": 25,
            "w": 56,
            "h": 33,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 50,
            "y": 66,
            "fontSize": 38,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 50,
            "y": 74,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 50,
            "y": 84,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "19_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "20_0": {
          "logo": {
            "x": 50,
            "y": 8,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "center"
          },
          "company_name": {
            "x": 28,
            "y": 8,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "left"
          },
          "photo": {
            "x": 42.5,
            "y": 21,
            "w": 40,
            "h": 28,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 62.5,
            "y": 58,
            "fontSize": 36,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 62.5,
            "y": 66,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 62.5,
            "y": 76,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "20_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "21_0": {
          "logo": {
            "x": 42,
            "y": 6,
            "w": 16,
            "h": 8,
            "type": "image",
            "align": "center"
          },
          "company_name": {
            "x": 50,
            "y": 16,
            "fontSize": 22,
            "fontWeight": "bold",
            "align": "center"
          },
          "photo": {
            "x": 30,
            "y": 20,
            "w": 40,
            "h": 28,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 50,
            "y": 62,
            "fontSize": 34,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 50,
            "y": 70,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 50,
            "y": 82,
            "fontSize": 20,
            "fontWeight": "bold",
            "align": "center",
            "color": "#F59E0B"
          }
        },
        "21_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "22_0": {
          "logo": {
            "x": 5,
            "y": 5,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "left"
          },
          "company_name": {
            "x": 20,
            "y": 9,
            "fontSize": 26,
            "fontWeight": "bold",
            "align": "left",
            "color": "#FFFFFF"
          },
          "photo": {
            "x": 6.25,
            "y": 29.5,
            "w": 43.75,
            "h": 29.5,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 55,
            "y": 42,
            "fontSize": 38,
            "fontWeight": "bold",
            "align": "left"
          },
          "designation": {
            "x": 55,
            "y": 50,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "left"
          },
          "id_no": {
            "x": 55,
            "y": 60,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "left"
          }
        },
        "22_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "23_0": {
          "logo": {
            "x": 40,
            "y": 8,
            "w": 20,
            "h": 10,
            "type": "image",
            "align": "center"
          },
          "company_name": {
            "x": 50,
            "y": 20,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center"
          },
          "photo": {
            "x": 31,
            "y": 23,
            "w": 38,
            "h": 28,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 50,
            "y": 60,
            "fontSize": 34,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 50,
            "y": 68,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 50,
            "y": 78,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "23_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "24_0": {
          "logo": {
            "x": 10,
            "y": 6,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "left"
          },
          "company_name": {
            "x": 50,
            "y": 15,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center"
          },
          "photo": {
            "x": 22,
            "y": 25,
            "w": 56,
            "h": 33,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 50,
            "y": 66,
            "fontSize": 38,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 50,
            "y": 74,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 50,
            "y": 84,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "24_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "25_0": {
          "logo": {
            "x": 50,
            "y": 8,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "center"
          },
          "company_name": {
            "x": 28,
            "y": 8,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "left"
          },
          "photo": {
            "x": 42.5,
            "y": 21,
            "w": 40,
            "h": 28,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 62.5,
            "y": 58,
            "fontSize": 36,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 62.5,
            "y": 66,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 62.5,
            "y": 76,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "25_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "26_0": {
          "logo": {
            "x": 42,
            "y": 6,
            "w": 16,
            "h": 8,
            "type": "image",
            "align": "center"
          },
          "company_name": {
            "x": 50,
            "y": 16,
            "fontSize": 22,
            "fontWeight": "bold",
            "align": "center"
          },
          "photo": {
            "x": 30,
            "y": 20,
            "w": 40,
            "h": 28,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 50,
            "y": 62,
            "fontSize": 34,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 50,
            "y": 70,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 50,
            "y": 82,
            "fontSize": 20,
            "fontWeight": "bold",
            "align": "center",
            "color": "#F59E0B"
          }
        },
        "26_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "27_0": {
          "logo": {
            "x": 5,
            "y": 5,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "left"
          },
          "company_name": {
            "x": 20,
            "y": 9,
            "fontSize": 26,
            "fontWeight": "bold",
            "align": "left",
            "color": "#FFFFFF"
          },
          "photo": {
            "x": 6.25,
            "y": 29.5,
            "w": 43.75,
            "h": 29.5,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 55,
            "y": 42,
            "fontSize": 38,
            "fontWeight": "bold",
            "align": "left"
          },
          "designation": {
            "x": 55,
            "y": 50,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "left"
          },
          "id_no": {
            "x": 55,
            "y": 60,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "left"
          }
        },
        "27_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "28_0": {
          "logo": {
            "x": 40,
            "y": 8,
            "w": 20,
            "h": 10,
            "type": "image",
            "align": "center"
          },
          "company_name": {
            "x": 50,
            "y": 20,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center"
          },
          "photo": {
            "x": 31,
            "y": 23,
            "w": 38,
            "h": 28,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 50,
            "y": 60,
            "fontSize": 34,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 50,
            "y": 68,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 50,
            "y": 78,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "28_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        },
        "29_0": {
          "logo": {
            "x": 10,
            "y": 6,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "left"
          },
          "company_name": {
            "x": 50,
            "y": 15,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "center"
          },
          "photo": {
            "x": 22,
            "y": 25,
            "w": 56,
            "h": 33,
            "type": "image",
            "align": "center"
          },
          "name": {
            "x": 50,
            "y": 66,
            "fontSize": 38,
            "fontWeight": "bold",
            "align": "center"
          },
          "designation": {
            "x": 50,
            "y": 74,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "center"
          },
          "id_no": {
            "x": 50,
            "y": 84,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "29_1": {
          "phone": {
            "x": 50,
            "y": 15,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 22,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "blood_group": {
            "x": 50,
            "y": 35,
            "fontSize": 18,
            "fontWeight": "bold",
            "align": "center"
          },
          "emergency": {
            "x": 50,
            "y": 45,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 62,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center",
            "maxWidth": 85
          },
          "qr_code": {
            "x": 34,
            "y": 75,
            "w": 32,
            "h": 20,
            "type": "image",
            "align": "center"
          }
        }
      },
      "fields": [
        {
          "id": "logo",
          "label": "Company Logo",
          "type": "image",
          "placeholder": "/placeholder-logo.png"
        },
        {
          "id": "company_name",
          "label": "Company Name",
          "type": "text",
          "placeholder": "TECH SOLUTIONS INC."
        },
        {
          "id": "photo",
          "label": "Employee Photo",
          "type": "image",
          "placeholder": "/placeholder-photo.png"
        },
        {
          "id": "name",
          "label": "Full Name",
          "type": "text",
          "placeholder": "Johnathan Doe"
        },
        {
          "id": "designation",
          "label": "Designation",
          "type": "text",
          "placeholder": "Senior Software Engineer"
        },
        {
          "id": "id_no",
          "label": "Employee ID",
          "type": "text",
          "placeholder": "EMP-2024-001"
        },
        {
          "id": "phone",
          "label": "Mobile No.",
          "type": "text",
          "placeholder": "+91 98765 43210"
        },
        {
          "id": "email",
          "label": "Email ID",
          "type": "text",
          "placeholder": "john.doe@company.com"
        },
        {
          "id": "blood_group",
          "label": "Blood Group",
          "type": "text",
          "placeholder": "B+ Positive"
        },
        {
          "id": "emergency",
          "label": "Emergency Contact",
          "type": "text",
          "placeholder": "Mrs. Jane Doe: +91 99999 88888"
        },
        {
          "id": "address",
          "label": "Full Address",
          "type": "textarea",
          "placeholder": "B-42, Corporate Park, Sector 62, Noida, UP"
        },
        {
          "id": "qr_code",
          "label": "QR Code/Signature",
          "type": "image",
          "placeholder": "/placeholder-qr.png"
        }
      ]
    },
    "bulk_discount_rules": []
  },
  {
    "id": "f819bd11-5636-4061-bafc-2da39ba31c50",
    "name": "Letter Head",
    "slug": "letter-head-custom",
    "description": "Fully customized, professional-quality product suitable for branding and promotional use.",
    "category": "stationary",
    "base_price": 9,
    "moq": 50,
    "delivery_days": "7–10 Working Days",
    "images": [
      "/images/products/letterhead.png"
    ],
    "template_images": [],
    "quality_levels": [
      "Basic",
      "Standard",
      "Premium",
      "Luxury"
    ],
    "customization_fields": [
      "Logo",
      "Name",
      "Text",
      "Color"
    ],
    "packaging_options": [
      "Standard",
      "Premium"
    ],
    "supported_views": [
      "front"
    ],
    "features": [],
    "specifications": {},
    "stock_quantity": 0,
    "is_active": true,
    "created_at": "2026-04-15T18:48:49.01512+00:00",
    "wireframe_images": [
      "data:image/svg+xml;utf8,<svg viewBox=\"0 0 400 550\" xmlns=\"http://www.w3.org/2000/svg\">\r\n      <rect x=\"30\" y=\"20\" width=\"340\" height=\"510\" fill=\"#ffffff\" stroke=\"#222\" stroke-width=\"3\"/>\r\n      <rect x=\"50\" y=\"40\" width=\"60\" height=\"60\" fill=\"none\" stroke=\"#222\" stroke-width=\"2\"/>\r\n      <line x1=\"200\" y1=\"50\" x2=\"350\" y2=\"50\" stroke=\"#222\" stroke-width=\"3\"/>\r\n      <line x1=\"280\" y1=\"70\" x2=\"350\" y2=\"70\" stroke=\"#ccc\" stroke-width=\"2\"/>\r\n      <line x1=\"50\" y1=\"120\" x2=\"350\" y2=\"120\" stroke=\"#222\" stroke-width=\"4\"/>\r\n      <line x1=\"50\" y1=\"160\" x2=\"150\" y2=\"160\" stroke=\"#ccc\" stroke-width=\"2\"/>\r\n      <line x1=\"50\" y1=\"200\" x2=\"350\" y2=\"200\" stroke=\"#ccc\" stroke-width=\"2\"/>\r\n      <line x1=\"50\" y1=\"230\" x2=\"330\" y2=\"230\" stroke=\"#ccc\" stroke-width=\"2\"/>\r\n      <line x1=\"50\" y1=\"260\" x2=\"340\" y2=\"260\" stroke=\"#ccc\" stroke-width=\"2\"/>\r\n      <line x1=\"50\" y1=\"290\" x2=\"200\" y2=\"290\" stroke=\"#ccc\" stroke-width=\"2\"/>\r\n      <line x1=\"50\" y1=\"350\" x2=\"120\" y2=\"350\" stroke=\"#ccc\" stroke-width=\"2\"/>\r\n      <line x1=\"50\" y1=\"480\" x2=\"350\" y2=\"480\" stroke=\"#ccc\" stroke-width=\"2\"/>\r\n      <line x1=\"150\" y1=\"500\" x2=\"250\" y2=\"500\" stroke=\"#ccc\" stroke-width=\"2\"/>\r\n    </svg>"
    ],
    "design_areas": {
      "front": {
        "h": 320,
        "w": 200,
        "x": 150,
        "y": 120
      }
    },
    "quality_prices": {},
    "color_variants": [
      {
        "name": "Executive Elite 11",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/11/front.svg",
          "/templates/lh/11/back.svg"
        ]
      },
      {
        "name": "Sidebar Elite 12",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/12/front.svg",
          "/templates/lh/12/back.svg"
        ]
      },
      {
        "name": "Tech Elite 13",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/13/front.svg",
          "/templates/lh/13/back.svg"
        ]
      },
      {
        "name": "Artistic Elite 14",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/14/front.svg",
          "/templates/lh/14/back.svg"
        ]
      },
      {
        "name": "Industrial Elite 15",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/15/front.svg",
          "/templates/lh/15/back.svg"
        ]
      },
      {
        "name": "Executive Elite 16",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/16/front.svg",
          "/templates/lh/16/back.svg"
        ]
      },
      {
        "name": "Sidebar Elite 17",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/17/front.svg",
          "/templates/lh/17/back.svg"
        ]
      },
      {
        "name": "Tech Elite 18",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/18/front.svg",
          "/templates/lh/18/back.svg"
        ]
      },
      {
        "name": "Artistic Elite 19",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/19/front.svg",
          "/templates/lh/19/back.svg"
        ]
      },
      {
        "name": "Industrial Elite 20",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/20/front.svg",
          "/templates/lh/20/back.svg"
        ]
      },
      {
        "name": "Executive Elite 21",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/21/front.svg",
          "/templates/lh/21/back.svg"
        ]
      },
      {
        "name": "Sidebar Elite 22",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/22/front.svg",
          "/templates/lh/22/back.svg"
        ]
      },
      {
        "name": "Tech Elite 23",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/23/front.svg",
          "/templates/lh/23/back.svg"
        ]
      },
      {
        "name": "Artistic Elite 24",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/24/front.svg",
          "/templates/lh/24/back.svg"
        ]
      },
      {
        "name": "Industrial Elite 25",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/25/front.svg",
          "/templates/lh/25/back.svg"
        ]
      },
      {
        "name": "Executive Elite 26",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/26/front.svg",
          "/templates/lh/26/back.svg"
        ]
      },
      {
        "name": "Sidebar Elite 27",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/27/front.svg",
          "/templates/lh/27/back.svg"
        ]
      },
      {
        "name": "Tech Elite 28",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/28/front.svg",
          "/templates/lh/28/back.svg"
        ]
      },
      {
        "name": "Artistic Elite 29",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/29/front.svg",
          "/templates/lh/29/back.svg"
        ]
      },
      {
        "name": "Industrial Elite 30",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/30/front.svg",
          "/templates/lh/30/back.svg"
        ]
      },
      {
        "name": "Executive Elite 31",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/31/front.svg",
          "/templates/lh/31/back.svg"
        ]
      },
      {
        "name": "Sidebar Elite 32",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/32/front.svg",
          "/templates/lh/32/back.svg"
        ]
      },
      {
        "name": "Tech Elite 33",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/33/front.svg",
          "/templates/lh/33/back.svg"
        ]
      },
      {
        "name": "Artistic Elite 34",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/34/front.svg",
          "/templates/lh/34/back.svg"
        ]
      },
      {
        "name": "Industrial Elite 35",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/35/front.svg",
          "/templates/lh/35/back.svg"
        ]
      },
      {
        "name": "Executive Elite 36",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/36/front.svg",
          "/templates/lh/36/back.svg"
        ]
      },
      {
        "name": "Sidebar Elite 37",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/37/front.svg",
          "/templates/lh/37/back.svg"
        ]
      },
      {
        "name": "Tech Elite 38",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/38/front.svg",
          "/templates/lh/38/back.svg"
        ]
      },
      {
        "name": "Artistic Elite 39",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/39/front.svg",
          "/templates/lh/39/back.svg"
        ]
      },
      {
        "name": "Industrial Elite 40",
        "hex": "#F3F4F6",
        "wireframe_images": [
          "/templates/lh/40/front.svg",
          "/templates/lh/40/back.svg"
        ]
      }
    ],
    "design_mode": "template_form",
    "design_config": {
      "mappings": {
        "0_0": {
          "logo": {
            "x": 44,
            "y": 5,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 50,
            "y": 15,
            "fontSize": 32,
            "fontWeight": "bold",
            "align": "center"
          },
          "tagline": {
            "x": 50,
            "y": 20,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center",
            "opacity": 0.7
          },
          "phone": {
            "x": 20,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 50,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 80,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "right"
          }
        },
        "0_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "1_0": {
          "logo": {
            "x": 5,
            "y": 5,
            "w": 10,
            "h": 7,
            "type": "image",
            "align": "left"
          },
          "company": {
            "x": 18,
            "y": 8,
            "fontSize": 28,
            "fontWeight": "bold",
            "align": "left"
          },
          "tagline": {
            "x": 18,
            "y": 13,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "left"
          },
          "address": {
            "x": 5,
            "y": 93,
            "fontSize": 11,
            "fontWeight": "normal",
            "align": "left"
          },
          "phone": {
            "x": 5,
            "y": 96,
            "fontSize": 11,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 30,
            "y": 96,
            "fontSize": 11,
            "fontWeight": "normal",
            "align": "left"
          }
        },
        "1_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "2_0": {
          "logo": {
            "x": 80,
            "y": 5,
            "w": 15,
            "h": 10,
            "type": "image",
            "align": "right"
          },
          "company": {
            "x": 10,
            "y": 8,
            "fontSize": 30,
            "fontWeight": "bold",
            "align": "left"
          },
          "tagline": {
            "x": 10,
            "y": 14,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "opacity": 0.6
          },
          "address": {
            "x": 90,
            "y": 94,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "right"
          },
          "phone": {
            "x": 90,
            "y": 96,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "right"
          }
        },
        "2_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "3_0": {
          "logo": {
            "x": 8,
            "y": 8,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "left"
          },
          "company": {
            "x": 50,
            "y": 10,
            "fontSize": 34,
            "fontWeight": "bold",
            "align": "center"
          },
          "tagline": {
            "x": 50,
            "y": 16,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 92,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 96,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "3_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "4_0": {
          "logo": {
            "x": 8,
            "y": 6,
            "w": 10,
            "h": 6,
            "type": "image",
            "align": "left"
          },
          "company": {
            "x": 50,
            "y": 8,
            "fontSize": 26,
            "fontWeight": "bold",
            "align": "center"
          },
          "tagline": {
            "x": 90,
            "y": 8,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "right"
          },
          "address": {
            "x": 50,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "4_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "5_0": {
          "logo": {
            "x": 44,
            "y": 5,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 50,
            "y": 15,
            "fontSize": 32,
            "fontWeight": "bold",
            "align": "center"
          },
          "tagline": {
            "x": 50,
            "y": 20,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center",
            "opacity": 0.7
          },
          "phone": {
            "x": 20,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 50,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 80,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "right"
          }
        },
        "5_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "6_0": {
          "logo": {
            "x": 5,
            "y": 5,
            "w": 10,
            "h": 7,
            "type": "image",
            "align": "left"
          },
          "company": {
            "x": 18,
            "y": 8,
            "fontSize": 28,
            "fontWeight": "bold",
            "align": "left"
          },
          "tagline": {
            "x": 18,
            "y": 13,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "left"
          },
          "address": {
            "x": 5,
            "y": 93,
            "fontSize": 11,
            "fontWeight": "normal",
            "align": "left"
          },
          "phone": {
            "x": 5,
            "y": 96,
            "fontSize": 11,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 30,
            "y": 96,
            "fontSize": 11,
            "fontWeight": "normal",
            "align": "left"
          }
        },
        "6_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "7_0": {
          "logo": {
            "x": 80,
            "y": 5,
            "w": 15,
            "h": 10,
            "type": "image",
            "align": "right"
          },
          "company": {
            "x": 10,
            "y": 8,
            "fontSize": 30,
            "fontWeight": "bold",
            "align": "left"
          },
          "tagline": {
            "x": 10,
            "y": 14,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "opacity": 0.6
          },
          "address": {
            "x": 90,
            "y": 94,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "right"
          },
          "phone": {
            "x": 90,
            "y": 96,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "right"
          }
        },
        "7_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "8_0": {
          "logo": {
            "x": 8,
            "y": 8,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "left"
          },
          "company": {
            "x": 50,
            "y": 10,
            "fontSize": 34,
            "fontWeight": "bold",
            "align": "center"
          },
          "tagline": {
            "x": 50,
            "y": 16,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 92,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 96,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "8_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "9_0": {
          "logo": {
            "x": 8,
            "y": 6,
            "w": 10,
            "h": 6,
            "type": "image",
            "align": "left"
          },
          "company": {
            "x": 50,
            "y": 8,
            "fontSize": 26,
            "fontWeight": "bold",
            "align": "center"
          },
          "tagline": {
            "x": 90,
            "y": 8,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "right"
          },
          "address": {
            "x": 50,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "9_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "10_0": {
          "logo": {
            "x": 44,
            "y": 5,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 50,
            "y": 15,
            "fontSize": 32,
            "fontWeight": "bold",
            "align": "center"
          },
          "tagline": {
            "x": 50,
            "y": 20,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center",
            "opacity": 0.7
          },
          "phone": {
            "x": 20,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 50,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 80,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "right"
          }
        },
        "10_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "11_0": {
          "logo": {
            "x": 5,
            "y": 5,
            "w": 10,
            "h": 7,
            "type": "image",
            "align": "left"
          },
          "company": {
            "x": 18,
            "y": 8,
            "fontSize": 28,
            "fontWeight": "bold",
            "align": "left"
          },
          "tagline": {
            "x": 18,
            "y": 13,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "left"
          },
          "address": {
            "x": 5,
            "y": 93,
            "fontSize": 11,
            "fontWeight": "normal",
            "align": "left"
          },
          "phone": {
            "x": 5,
            "y": 96,
            "fontSize": 11,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 30,
            "y": 96,
            "fontSize": 11,
            "fontWeight": "normal",
            "align": "left"
          }
        },
        "11_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "12_0": {
          "logo": {
            "x": 80,
            "y": 5,
            "w": 15,
            "h": 10,
            "type": "image",
            "align": "right"
          },
          "company": {
            "x": 10,
            "y": 8,
            "fontSize": 30,
            "fontWeight": "bold",
            "align": "left"
          },
          "tagline": {
            "x": 10,
            "y": 14,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "opacity": 0.6
          },
          "address": {
            "x": 90,
            "y": 94,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "right"
          },
          "phone": {
            "x": 90,
            "y": 96,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "right"
          }
        },
        "12_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "13_0": {
          "logo": {
            "x": 8,
            "y": 8,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "left"
          },
          "company": {
            "x": 50,
            "y": 10,
            "fontSize": 34,
            "fontWeight": "bold",
            "align": "center"
          },
          "tagline": {
            "x": 50,
            "y": 16,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 92,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 96,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "13_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "14_0": {
          "logo": {
            "x": 8,
            "y": 6,
            "w": 10,
            "h": 6,
            "type": "image",
            "align": "left"
          },
          "company": {
            "x": 50,
            "y": 8,
            "fontSize": 26,
            "fontWeight": "bold",
            "align": "center"
          },
          "tagline": {
            "x": 90,
            "y": 8,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "right"
          },
          "address": {
            "x": 50,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "14_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "15_0": {
          "logo": {
            "x": 44,
            "y": 5,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 50,
            "y": 15,
            "fontSize": 32,
            "fontWeight": "bold",
            "align": "center"
          },
          "tagline": {
            "x": 50,
            "y": 20,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center",
            "opacity": 0.7
          },
          "phone": {
            "x": 20,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 50,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 80,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "right"
          }
        },
        "15_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "16_0": {
          "logo": {
            "x": 5,
            "y": 5,
            "w": 10,
            "h": 7,
            "type": "image",
            "align": "left"
          },
          "company": {
            "x": 18,
            "y": 8,
            "fontSize": 28,
            "fontWeight": "bold",
            "align": "left"
          },
          "tagline": {
            "x": 18,
            "y": 13,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "left"
          },
          "address": {
            "x": 5,
            "y": 93,
            "fontSize": 11,
            "fontWeight": "normal",
            "align": "left"
          },
          "phone": {
            "x": 5,
            "y": 96,
            "fontSize": 11,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 30,
            "y": 96,
            "fontSize": 11,
            "fontWeight": "normal",
            "align": "left"
          }
        },
        "16_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "17_0": {
          "logo": {
            "x": 80,
            "y": 5,
            "w": 15,
            "h": 10,
            "type": "image",
            "align": "right"
          },
          "company": {
            "x": 10,
            "y": 8,
            "fontSize": 30,
            "fontWeight": "bold",
            "align": "left"
          },
          "tagline": {
            "x": 10,
            "y": 14,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "opacity": 0.6
          },
          "address": {
            "x": 90,
            "y": 94,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "right"
          },
          "phone": {
            "x": 90,
            "y": 96,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "right"
          }
        },
        "17_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "18_0": {
          "logo": {
            "x": 8,
            "y": 8,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "left"
          },
          "company": {
            "x": 50,
            "y": 10,
            "fontSize": 34,
            "fontWeight": "bold",
            "align": "center"
          },
          "tagline": {
            "x": 50,
            "y": 16,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 92,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 96,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "18_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "19_0": {
          "logo": {
            "x": 8,
            "y": 6,
            "w": 10,
            "h": 6,
            "type": "image",
            "align": "left"
          },
          "company": {
            "x": 50,
            "y": 8,
            "fontSize": 26,
            "fontWeight": "bold",
            "align": "center"
          },
          "tagline": {
            "x": 90,
            "y": 8,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "right"
          },
          "address": {
            "x": 50,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "19_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "20_0": {
          "logo": {
            "x": 44,
            "y": 5,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 50,
            "y": 15,
            "fontSize": 32,
            "fontWeight": "bold",
            "align": "center"
          },
          "tagline": {
            "x": 50,
            "y": 20,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center",
            "opacity": 0.7
          },
          "phone": {
            "x": 20,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 50,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 80,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "right"
          }
        },
        "20_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "21_0": {
          "logo": {
            "x": 5,
            "y": 5,
            "w": 10,
            "h": 7,
            "type": "image",
            "align": "left"
          },
          "company": {
            "x": 18,
            "y": 8,
            "fontSize": 28,
            "fontWeight": "bold",
            "align": "left"
          },
          "tagline": {
            "x": 18,
            "y": 13,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "left"
          },
          "address": {
            "x": 5,
            "y": 93,
            "fontSize": 11,
            "fontWeight": "normal",
            "align": "left"
          },
          "phone": {
            "x": 5,
            "y": 96,
            "fontSize": 11,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 30,
            "y": 96,
            "fontSize": 11,
            "fontWeight": "normal",
            "align": "left"
          }
        },
        "21_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "22_0": {
          "logo": {
            "x": 80,
            "y": 5,
            "w": 15,
            "h": 10,
            "type": "image",
            "align": "right"
          },
          "company": {
            "x": 10,
            "y": 8,
            "fontSize": 30,
            "fontWeight": "bold",
            "align": "left"
          },
          "tagline": {
            "x": 10,
            "y": 14,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "opacity": 0.6
          },
          "address": {
            "x": 90,
            "y": 94,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "right"
          },
          "phone": {
            "x": 90,
            "y": 96,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "right"
          }
        },
        "22_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "23_0": {
          "logo": {
            "x": 8,
            "y": 8,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "left"
          },
          "company": {
            "x": 50,
            "y": 10,
            "fontSize": 34,
            "fontWeight": "bold",
            "align": "center"
          },
          "tagline": {
            "x": 50,
            "y": 16,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 92,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 96,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "23_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "24_0": {
          "logo": {
            "x": 8,
            "y": 6,
            "w": 10,
            "h": 6,
            "type": "image",
            "align": "left"
          },
          "company": {
            "x": 50,
            "y": 8,
            "fontSize": 26,
            "fontWeight": "bold",
            "align": "center"
          },
          "tagline": {
            "x": 90,
            "y": 8,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "right"
          },
          "address": {
            "x": 50,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "24_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "25_0": {
          "logo": {
            "x": 44,
            "y": 5,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 50,
            "y": 15,
            "fontSize": 32,
            "fontWeight": "bold",
            "align": "center"
          },
          "tagline": {
            "x": 50,
            "y": 20,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center",
            "opacity": 0.7
          },
          "phone": {
            "x": 20,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 50,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 80,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "right"
          }
        },
        "25_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "26_0": {
          "logo": {
            "x": 5,
            "y": 5,
            "w": 10,
            "h": 7,
            "type": "image",
            "align": "left"
          },
          "company": {
            "x": 18,
            "y": 8,
            "fontSize": 28,
            "fontWeight": "bold",
            "align": "left"
          },
          "tagline": {
            "x": 18,
            "y": 13,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "left"
          },
          "address": {
            "x": 5,
            "y": 93,
            "fontSize": 11,
            "fontWeight": "normal",
            "align": "left"
          },
          "phone": {
            "x": 5,
            "y": 96,
            "fontSize": 11,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 30,
            "y": 96,
            "fontSize": 11,
            "fontWeight": "normal",
            "align": "left"
          }
        },
        "26_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "27_0": {
          "logo": {
            "x": 80,
            "y": 5,
            "w": 15,
            "h": 10,
            "type": "image",
            "align": "right"
          },
          "company": {
            "x": 10,
            "y": 8,
            "fontSize": 30,
            "fontWeight": "bold",
            "align": "left"
          },
          "tagline": {
            "x": 10,
            "y": 14,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left",
            "opacity": 0.6
          },
          "address": {
            "x": 90,
            "y": 94,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "right"
          },
          "phone": {
            "x": 90,
            "y": 96,
            "fontSize": 12,
            "fontWeight": "normal",
            "align": "right"
          }
        },
        "27_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "28_0": {
          "logo": {
            "x": 8,
            "y": 8,
            "w": 12,
            "h": 8,
            "type": "image",
            "align": "left"
          },
          "company": {
            "x": 50,
            "y": 10,
            "fontSize": 34,
            "fontWeight": "bold",
            "align": "center"
          },
          "tagline": {
            "x": 50,
            "y": 16,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 92,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 96,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "28_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        },
        "29_0": {
          "logo": {
            "x": 8,
            "y": 6,
            "w": 10,
            "h": 6,
            "type": "image",
            "align": "left"
          },
          "company": {
            "x": 50,
            "y": 8,
            "fontSize": 26,
            "fontWeight": "bold",
            "align": "center"
          },
          "tagline": {
            "x": 90,
            "y": 8,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "right"
          },
          "address": {
            "x": 50,
            "y": 95,
            "fontSize": 12,
            "fontWeight": "bold",
            "align": "center"
          }
        },
        "29_1": {
          "back_pattern": {
            "x": 50,
            "y": 50,
            "fontSize": 40,
            "opacity": 0.05,
            "align": "center"
          }
        }
      },
      "fields": [
        {
          "id": "logo",
          "label": "Company Logo",
          "type": "image",
          "placeholder": "/placeholder-logo.png"
        },
        {
          "id": "company",
          "label": "Company Name",
          "type": "text",
          "placeholder": "A to Z Prints"
        },
        {
          "id": "tagline",
          "label": "Business Tagline",
          "type": "text",
          "placeholder": "Your Vision, Our Print"
        },
        {
          "id": "phone",
          "label": "Contact Phone",
          "type": "text",
          "placeholder": "+91 98765 43210"
        },
        {
          "id": "email",
          "label": "Official Email",
          "type": "text",
          "placeholder": "contact@atozprints.com"
        },
        {
          "id": "website",
          "label": "Website",
          "type": "text",
          "placeholder": "www.atozprints.com"
        },
        {
          "id": "address",
          "label": "Company Address",
          "type": "textarea",
          "placeholder": "B-42, Corporate Park, Sector 62, Noida, UP"
        },
        {
          "id": "reg_info",
          "label": "Registration/Tax ID",
          "type": "text",
          "placeholder": "GSTIN: 09AAAAA0000A1Z5"
        }
      ]
    },
    "bulk_discount_rules": []
  },
  {
    "id": "e76a592b-8523-4c37-800e-3678ade5a20c",
    "name": "Bottle",
    "slug": "bottle-custom",
    "description": "Fully customized, professional-quality product suitable for branding and promotional use.",
    "category": "corporate",
    "base_price": 499,
    "moq": 50,
    "delivery_days": "7–10 Working Days",
    "images": [
      "/images/products/bottle.png"
    ],
    "template_images": [],
    "quality_levels": [
      "Basic",
      "Standard",
      "Premium",
      "Luxury"
    ],
    "customization_fields": [
      "Logo",
      "Name",
      "Text",
      "Color"
    ],
    "packaging_options": [
      "Standard",
      "Premium"
    ],
    "supported_views": [
      "front"
    ],
    "features": [],
    "specifications": {},
    "stock_quantity": 0,
    "is_active": true,
    "created_at": "2026-04-15T18:48:49.01512+00:00",
    "wireframe_images": [
      "data:image/svg+xml;utf8,<svg viewBox=\"0 0 200 500\" xmlns=\"http://www.w3.org/2000/svg\">\r\n      <rect x=\"65\" y=\"20\" width=\"70\" height=\"50\" fill=\"none\" stroke=\"#222\" stroke-width=\"4\" rx=\"5\"/>\r\n      <line x1=\"65\" y1=\"35\" x2=\"135\" y2=\"35\" stroke=\"#ccc\" stroke-width=\"2\"/>\r\n      <line x1=\"65\" y1=\"50\" x2=\"135\" y2=\"50\" stroke=\"#ccc\" stroke-width=\"2\"/>\r\n      <rect x=\"75\" y=\"70\" width=\"50\" height=\"30\" fill=\"none\" stroke=\"#222\" stroke-width=\"4\"/>\r\n      <path d=\"M75,100 C 40,120 40,150 40,180 L40,460 C 40,480 160,480 160,460 L160,180 C 160,150 125,120 125,100 Z\" fill=\"#ffffff\" stroke=\"#222\" stroke-width=\"5\" stroke-linejoin=\"round\"/>\r\n    </svg>"
    ],
    "design_areas": {
      "front": {
        "h": 320,
        "w": 200,
        "x": 150,
        "y": 120
      }
    },
    "quality_prices": {},
    "color_variants": [],
    "design_mode": "standard",
    "design_config": {},
    "bulk_discount_rules": []
  },
  {
    "id": "1bc2b46e-14f1-4202-a63e-032b08721048",
    "name": "Headphone",
    "slug": "headphone-custom",
    "description": "Fully customized, professional-quality product suitable for branding and promotional use.",
    "category": "accessories",
    "base_price": 1999,
    "moq": 50,
    "delivery_days": "7–10 Working Days",
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"
    ],
    "template_images": [],
    "quality_levels": [
      "Basic",
      "Standard",
      "Premium",
      "Luxury"
    ],
    "customization_fields": [
      "Logo",
      "Name",
      "Text",
      "Color"
    ],
    "packaging_options": [
      "Standard",
      "Premium"
    ],
    "supported_views": [
      "front"
    ],
    "features": [],
    "specifications": {},
    "stock_quantity": 0,
    "is_active": true,
    "created_at": "2026-04-15T18:48:49.01512+00:00",
    "wireframe_images": [
      "data:image/svg+xml;utf8,<svg viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\">\r\n      <path d=\"M100,200 C 100,50 300,50 300,200\" fill=\"none\" stroke=\"#222\" stroke-width=\"30\" stroke-linecap=\"round\"/>\r\n      <path d=\"M100,200 C 100,50 300,50 300,200\" fill=\"none\" stroke=\"#ffffff\" stroke-width=\"24\" stroke-linecap=\"round\"/>\r\n      <rect x=\"50\" y=\"160\" width=\"50\" height=\"120\" fill=\"none\" stroke=\"#222\" stroke-width=\"5\" rx=\"20\"/>\r\n      <rect x=\"40\" y=\"170\" width=\"20\" height=\"100\" fill=\"#ffffff\" stroke=\"#222\" stroke-width=\"4\" rx=\"10\"/>\r\n      <rect x=\"100\" y=\"170\" width=\"20\" height=\"100\" fill=\"#ffffff\" stroke=\"#222\" stroke-width=\"3\" rx=\"5\"/>\r\n      <rect x=\"300\" y=\"160\" width=\"50\" height=\"120\" fill=\"none\" stroke=\"#222\" stroke-width=\"5\" rx=\"20\"/>\r\n      <rect x=\"340\" y=\"170\" width=\"20\" height=\"100\" fill=\"#ffffff\" stroke=\"#222\" stroke-width=\"4\" rx=\"10\"/>\r\n      <rect x=\"280\" y=\"170\" width=\"20\" height=\"100\" fill=\"#ffffff\" stroke=\"#222\" stroke-width=\"3\" rx=\"5\"/>\r\n    </svg>"
    ],
    "design_areas": {
      "front": {
        "h": 320,
        "w": 200,
        "x": 150,
        "y": 120
      }
    },
    "quality_prices": {},
    "color_variants": [],
    "design_mode": "standard",
    "design_config": {},
    "bulk_discount_rules": []
  },
  {
    "id": "403e1ced-e15d-442f-804b-6a10eb9c3478",
    "name": "Pen",
    "slug": "pen-custom",
    "description": "Fully customized, professional-quality product suitable for branding and promotional use.",
    "category": "stationary",
    "base_price": 39,
    "moq": 50,
    "delivery_days": "7–10 Working Days",
    "images": [
      "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?q=80&w=800&auto=format&fit=crop",
      "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776884890309-Gemini_Generated_Image_ols3f5ols3f5ols3.png"
    ],
    "template_images": [],
    "quality_levels": [
      "Basic",
      "Standard",
      "Premium",
      "Luxury"
    ],
    "customization_fields": [
      "Logo",
      "Name",
      "Text",
      "Color"
    ],
    "packaging_options": [
      "Standard",
      "Premium"
    ],
    "supported_views": [
      "front"
    ],
    "features": [],
    "specifications": {},
    "stock_quantity": 0,
    "is_active": true,
    "created_at": "2026-04-15T18:48:49.01512+00:00",
    "wireframe_images": [
      "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776884583132-Gemini_Generated_Image_jeauytjeauytjeau.png",
      "",
      "",
      ""
    ],
    "design_areas": {
      "front": {
        "h": 20,
        "w": 336,
        "x": 81,
        "y": 301
      }
    },
    "quality_prices": {},
    "color_variants": [
      {
        "hex": "#000000",
        "name": "black",
        "wireframe_images": [
          "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776884583132-Gemini_Generated_Image_jeauytjeauytjeau.png",
          "",
          "",
          ""
        ]
      },
      {
        "hex": "#ffffff",
        "name": "white ",
        "wireframe_images": [
          "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776884827780-Gemini_Generated_Image_rznwj0rznwj0rznw.png",
          "",
          "",
          ""
        ]
      }
    ],
    "design_mode": "standard",
    "design_config": {},
    "bulk_discount_rules": []
  },
  {
    "id": "7a08ff4a-91dd-4be4-8531-c8d8f324000d",
    "name": "Custom Premium T-Shirt",
    "slug": "custom-premium-tshirt",
    "description": "100% Organic cotton t-shirt with premium weight and breathable fabric.",
    "category": "Apparel",
    "base_price": 599,
    "moq": 1,
    "delivery_days": "3-5 Days",
    "images": [
          "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776262582550-Gemini_Generated_Image_q63cfzq63cfzq63c__1_-removebg-preview.png",
          "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776262603579-Gemini_Generated_Image_q63cfzq63cfzq63c%20(1).png"
    ],
    "template_images": [],
    "quality_levels": [
      "Standard",
      "Premium",
      "Luxury"
    ],
    "customization_fields": [
      "Front Print",
      "Back Print",
      "Pocket Logo"
    ],
    "packaging_options": [],
    "supported_views": [
      "front",
      "back"
    ],
    "features": [],
    "specifications": {},
    "stock_quantity": 0,
    "is_active": true,
    "created_at": "2026-04-02T14:47:12.159814+00:00",
    "wireframe_images": [
      "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776262582550-Gemini_Generated_Image_q63cfzq63cfzq63c__1_-removebg-preview.png",
      "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776262603579-Gemini_Generated_Image_q63cfzq63cfzq63c%20(1).png",
      "",
      ""
    ],
    "design_areas": {
      "back": {
        "h": 168,
        "w": 133,
        "x": 184,
        "y": 250
      },
      "front": {
        "h": 164,
        "w": 128,
        "x": 186,
        "y": 257
      }
    },
    "quality_prices": {
      "Luxury": 455,
      "Premium": 400,
      "Standard": 85
    },
    "color_variants": [],
    "design_mode": "standard",
    "design_config": {
      "safe_zones": {
        "back": {
          "h": 320,
          "w": 200,
          "x": 150,
          "y": 120
        },
        "front": {
          "h": 320,
          "w": 200,
          "x": 150,
          "y": 120
        }
      },
      "aspect_ratio": "4:5",
      "canvas_width": 500,
      "canvas_height": 625
    },
    "bulk_discount_rules": []
  },
  {
    "id": "f31bd213-9d18-411e-b938-bfac59c8fc35",
    "name": "Business Card",
    "slug": "business-card-custom",
    "description": "Fully customized, professional-quality product suitable for branding and promotional use.",
    "category": "stationary",
    "base_price": 4.99,
    "moq": 50,
    "delivery_days": "7–10 Working Days",
    "images": [
      "/images/products/business-card-front.png",
      "/images/products/business-card-back.jpeg",
      "/images/products/business-card-showcase.jpeg"
    ],
    "template_images": [],
    "quality_levels": [
      "Basic",
      "Standard",
      "Premium",
      "Luxury"
    ],
    "customization_fields": [
      "Logo",
      "Name",
      "Text",
      "Color"
    ],
    "packaging_options": [
      "Standard",
      "Premium"
    ],
    "supported_views": [
      "front"
    ],
    "features": [],
    "specifications": {},
    "stock_quantity": 0,
    "is_active": true,
    "created_at": "2026-04-15T18:48:49.01512+00:00",
    "wireframe_images": [
      "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776885191115-Gemini_Generated_Image_ntvy1dntvy1dntvy.png",
      "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776885262932-Gemini_Generated_Image_sj415zsj415zsj41.png",
      "",
      ""
    ],
    "design_areas": {
      "back": {
        "h": 118,
        "w": 256,
        "x": 126,
        "y": 257
      },
      "front": {
        "h": 320,
        "w": 200,
        "x": 150,
        "y": 120
      }
    },
    "quality_prices": {},
    "color_variants": [
      {
        "name": "Luxury Elite 11",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/11/front.svg",
          "/templates/bc/11/back.svg"
        ]
      },
      {
        "name": "Split Elite 12",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/12/front.svg",
          "/templates/bc/12/back.svg"
        ]
      },
      {
        "name": "Tech Elite 13",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/13/front.svg",
          "/templates/bc/13/back.svg"
        ]
      },
      {
        "name": "Creative Elite 14",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/14/front.svg",
          "/templates/bc/14/back.svg"
        ]
      },
      {
        "name": "Industrial Elite 15",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/15/front.svg",
          "/templates/bc/15/back.svg"
        ]
      },
      {
        "name": "Luxury Elite 16",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/16/front.svg",
          "/templates/bc/16/back.svg"
        ]
      },
      {
        "name": "Split Elite 17",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/17/front.svg",
          "/templates/bc/17/back.svg"
        ]
      },
      {
        "name": "Tech Elite 18",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/18/front.svg",
          "/templates/bc/18/back.svg"
        ]
      },
      {
        "name": "Creative Elite 19",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/19/front.svg",
          "/templates/bc/19/back.svg"
        ]
      },
      {
        "name": "Industrial Elite 20",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/20/front.svg",
          "/templates/bc/20/back.svg"
        ]
      },
      {
        "name": "Luxury Elite 21",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/21/front.svg",
          "/templates/bc/21/back.svg"
        ]
      },
      {
        "name": "Split Elite 22",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/22/front.svg",
          "/templates/bc/22/back.svg"
        ]
      },
      {
        "name": "Tech Elite 23",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/23/front.svg",
          "/templates/bc/23/back.svg"
        ]
      },
      {
        "name": "Creative Elite 24",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/24/front.svg",
          "/templates/bc/24/back.svg"
        ]
      },
      {
        "name": "Industrial Elite 25",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/25/front.svg",
          "/templates/bc/25/back.svg"
        ]
      },
      {
        "name": "Luxury Elite 26",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/26/front.svg",
          "/templates/bc/26/back.svg"
        ]
      },
      {
        "name": "Split Elite 27",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/27/front.svg",
          "/templates/bc/27/back.svg"
        ]
      },
      {
        "name": "Tech Elite 28",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/28/front.svg",
          "/templates/bc/28/back.svg"
        ]
      },
      {
        "name": "Creative Elite 29",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/29/front.svg",
          "/templates/bc/29/back.svg"
        ]
      },
      {
        "name": "Industrial Elite 30",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/30/front.svg",
          "/templates/bc/30/back.svg"
        ]
      },
      {
        "name": "Luxury Elite 31",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/31/front.svg",
          "/templates/bc/31/back.svg"
        ]
      },
      {
        "name": "Split Elite 32",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/32/front.svg",
          "/templates/bc/32/back.svg"
        ]
      },
      {
        "name": "Tech Elite 33",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/33/front.svg",
          "/templates/bc/33/back.svg"
        ]
      },
      {
        "name": "Creative Elite 34",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/34/front.svg",
          "/templates/bc/34/back.svg"
        ]
      },
      {
        "name": "Industrial Elite 35",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/35/front.svg",
          "/templates/bc/35/back.svg"
        ]
      },
      {
        "name": "Luxury Elite 36",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/36/front.svg",
          "/templates/bc/36/back.svg"
        ]
      },
      {
        "name": "Split Elite 37",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/37/front.svg",
          "/templates/bc/37/back.svg"
        ]
      },
      {
        "name": "Tech Elite 38",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/38/front.svg",
          "/templates/bc/38/back.svg"
        ]
      },
      {
        "name": "Creative Elite 39",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/39/front.svg",
          "/templates/bc/39/back.svg"
        ]
      },
      {
        "name": "Industrial Elite 40",
        "hex": "#1A1A1A",
        "wireframe_images": [
          "/templates/bc/40/front.svg",
          "/templates/bc/40/back.svg"
        ]
      }
    ],
    "design_mode": "template_form",
    "design_config": {
      "mappings": {
        "0_0": {
          "logo": {
            "x": 44,
            "y": 20,
            "w": 12,
            "h": 20,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 50,
            "y": 45,
            "fontSize": 28,
            "fontWeight": "bold",
            "align": "center",
            "color": "#D4AF37"
          },
          "name": {
            "x": 50,
            "y": 65,
            "fontSize": 36,
            "fontWeight": "bold",
            "align": "center"
          },
          "title": {
            "x": 50,
            "y": 75,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center",
            "opacity": 0.8
          }
        },
        "0_1": {
          "phone": {
            "x": 10,
            "y": 30,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 10,
            "y": 40,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "website": {
            "x": 10,
            "y": 50,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "address": {
            "x": 10,
            "y": 70,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "left",
            "maxWidth": 60
          }
        },
        "1_0": {
          "logo": {
            "x": 8,
            "y": 40,
            "w": 15,
            "h": 25,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 40,
            "y": 30,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "left"
          },
          "name": {
            "x": 40,
            "y": 55,
            "fontSize": 42,
            "fontWeight": "bold",
            "align": "left"
          },
          "title": {
            "x": 40,
            "y": 68,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "left"
          }
        },
        "1_1": {
          "phone": {
            "x": 50,
            "y": 40,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 50,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 75,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "2_0": {
          "logo": {
            "x": 80,
            "y": 15,
            "w": 12,
            "h": 20,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 10,
            "y": 15,
            "fontSize": 22,
            "fontWeight": "bold",
            "align": "left",
            "color": "#10B981"
          },
          "name": {
            "x": 10,
            "y": 55,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "left"
          },
          "title": {
            "x": 10,
            "y": 68,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "left"
          }
        },
        "2_1": {
          "phone": {
            "x": 90,
            "y": 30,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "right"
          },
          "email": {
            "x": 90,
            "y": 40,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "right"
          },
          "address": {
            "x": 90,
            "y": 65,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "right",
            "maxWidth": 50
          }
        },
        "3_0": {
          "logo": {
            "x": 11,
            "y": 20,
            "w": 10,
            "h": 18,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 10,
            "y": 45,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "left"
          },
          "name": {
            "x": 50,
            "y": 40,
            "fontSize": 44,
            "fontWeight": "bold",
            "align": "center"
          },
          "title": {
            "x": 50,
            "y": 55,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "3_1": {
          "phone": {
            "x": 50,
            "y": 30,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 45,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 70,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "4_0": {
          "logo": {
            "x": 44,
            "y": 35,
            "w": 12,
            "h": 20,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 50,
            "y": 12,
            "fontSize": 26,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFFFFF"
          },
          "name": {
            "x": 50,
            "y": 68,
            "fontSize": 38,
            "fontWeight": "bold",
            "align": "center"
          },
          "title": {
            "x": 50,
            "y": 78,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "4_1": {
          "phone": {
            "x": 10,
            "y": 75,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 10,
            "y": 85,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "address": {
            "x": 90,
            "y": 80,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "right",
            "maxWidth": 40
          }
        },
        "5_0": {
          "logo": {
            "x": 44,
            "y": 20,
            "w": 12,
            "h": 20,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 50,
            "y": 45,
            "fontSize": 28,
            "fontWeight": "bold",
            "align": "center",
            "color": "#D4AF37"
          },
          "name": {
            "x": 50,
            "y": 65,
            "fontSize": 36,
            "fontWeight": "bold",
            "align": "center"
          },
          "title": {
            "x": 50,
            "y": 75,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center",
            "opacity": 0.8
          }
        },
        "5_1": {
          "phone": {
            "x": 10,
            "y": 30,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 10,
            "y": 40,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "website": {
            "x": 10,
            "y": 50,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "address": {
            "x": 10,
            "y": 70,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "left",
            "maxWidth": 60
          }
        },
        "6_0": {
          "logo": {
            "x": 8,
            "y": 40,
            "w": 15,
            "h": 25,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 40,
            "y": 30,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "left"
          },
          "name": {
            "x": 40,
            "y": 55,
            "fontSize": 42,
            "fontWeight": "bold",
            "align": "left"
          },
          "title": {
            "x": 40,
            "y": 68,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "left"
          }
        },
        "6_1": {
          "phone": {
            "x": 50,
            "y": 40,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 50,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 75,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "7_0": {
          "logo": {
            "x": 80,
            "y": 15,
            "w": 12,
            "h": 20,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 10,
            "y": 15,
            "fontSize": 22,
            "fontWeight": "bold",
            "align": "left",
            "color": "#10B981"
          },
          "name": {
            "x": 10,
            "y": 55,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "left"
          },
          "title": {
            "x": 10,
            "y": 68,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "left"
          }
        },
        "7_1": {
          "phone": {
            "x": 90,
            "y": 30,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "right"
          },
          "email": {
            "x": 90,
            "y": 40,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "right"
          },
          "address": {
            "x": 90,
            "y": 65,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "right",
            "maxWidth": 50
          }
        },
        "8_0": {
          "logo": {
            "x": 11,
            "y": 20,
            "w": 10,
            "h": 18,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 10,
            "y": 45,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "left"
          },
          "name": {
            "x": 50,
            "y": 40,
            "fontSize": 44,
            "fontWeight": "bold",
            "align": "center"
          },
          "title": {
            "x": 50,
            "y": 55,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "8_1": {
          "phone": {
            "x": 50,
            "y": 30,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 45,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 70,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "9_0": {
          "logo": {
            "x": 44,
            "y": 35,
            "w": 12,
            "h": 20,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 50,
            "y": 12,
            "fontSize": 26,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFFFFF"
          },
          "name": {
            "x": 50,
            "y": 68,
            "fontSize": 38,
            "fontWeight": "bold",
            "align": "center"
          },
          "title": {
            "x": 50,
            "y": 78,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "9_1": {
          "phone": {
            "x": 10,
            "y": 75,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 10,
            "y": 85,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "address": {
            "x": 90,
            "y": 80,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "right",
            "maxWidth": 40
          }
        },
        "10_0": {
          "logo": {
            "x": 44,
            "y": 20,
            "w": 12,
            "h": 20,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 50,
            "y": 45,
            "fontSize": 28,
            "fontWeight": "bold",
            "align": "center",
            "color": "#D4AF37"
          },
          "name": {
            "x": 50,
            "y": 65,
            "fontSize": 36,
            "fontWeight": "bold",
            "align": "center"
          },
          "title": {
            "x": 50,
            "y": 75,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center",
            "opacity": 0.8
          }
        },
        "10_1": {
          "phone": {
            "x": 10,
            "y": 30,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 10,
            "y": 40,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "website": {
            "x": 10,
            "y": 50,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "address": {
            "x": 10,
            "y": 70,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "left",
            "maxWidth": 60
          }
        },
        "11_0": {
          "logo": {
            "x": 8,
            "y": 40,
            "w": 15,
            "h": 25,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 40,
            "y": 30,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "left"
          },
          "name": {
            "x": 40,
            "y": 55,
            "fontSize": 42,
            "fontWeight": "bold",
            "align": "left"
          },
          "title": {
            "x": 40,
            "y": 68,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "left"
          }
        },
        "11_1": {
          "phone": {
            "x": 50,
            "y": 40,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 50,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 75,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "12_0": {
          "logo": {
            "x": 80,
            "y": 15,
            "w": 12,
            "h": 20,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 10,
            "y": 15,
            "fontSize": 22,
            "fontWeight": "bold",
            "align": "left",
            "color": "#10B981"
          },
          "name": {
            "x": 10,
            "y": 55,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "left"
          },
          "title": {
            "x": 10,
            "y": 68,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "left"
          }
        },
        "12_1": {
          "phone": {
            "x": 90,
            "y": 30,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "right"
          },
          "email": {
            "x": 90,
            "y": 40,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "right"
          },
          "address": {
            "x": 90,
            "y": 65,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "right",
            "maxWidth": 50
          }
        },
        "13_0": {
          "logo": {
            "x": 11,
            "y": 20,
            "w": 10,
            "h": 18,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 10,
            "y": 45,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "left"
          },
          "name": {
            "x": 50,
            "y": 40,
            "fontSize": 44,
            "fontWeight": "bold",
            "align": "center"
          },
          "title": {
            "x": 50,
            "y": 55,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "13_1": {
          "phone": {
            "x": 50,
            "y": 30,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 45,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 70,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "14_0": {
          "logo": {
            "x": 44,
            "y": 35,
            "w": 12,
            "h": 20,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 50,
            "y": 12,
            "fontSize": 26,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFFFFF"
          },
          "name": {
            "x": 50,
            "y": 68,
            "fontSize": 38,
            "fontWeight": "bold",
            "align": "center"
          },
          "title": {
            "x": 50,
            "y": 78,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "14_1": {
          "phone": {
            "x": 10,
            "y": 75,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 10,
            "y": 85,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "address": {
            "x": 90,
            "y": 80,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "right",
            "maxWidth": 40
          }
        },
        "15_0": {
          "logo": {
            "x": 44,
            "y": 20,
            "w": 12,
            "h": 20,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 50,
            "y": 45,
            "fontSize": 28,
            "fontWeight": "bold",
            "align": "center",
            "color": "#D4AF37"
          },
          "name": {
            "x": 50,
            "y": 65,
            "fontSize": 36,
            "fontWeight": "bold",
            "align": "center"
          },
          "title": {
            "x": 50,
            "y": 75,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center",
            "opacity": 0.8
          }
        },
        "15_1": {
          "phone": {
            "x": 10,
            "y": 30,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 10,
            "y": 40,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "website": {
            "x": 10,
            "y": 50,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "address": {
            "x": 10,
            "y": 70,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "left",
            "maxWidth": 60
          }
        },
        "16_0": {
          "logo": {
            "x": 8,
            "y": 40,
            "w": 15,
            "h": 25,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 40,
            "y": 30,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "left"
          },
          "name": {
            "x": 40,
            "y": 55,
            "fontSize": 42,
            "fontWeight": "bold",
            "align": "left"
          },
          "title": {
            "x": 40,
            "y": 68,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "left"
          }
        },
        "16_1": {
          "phone": {
            "x": 50,
            "y": 40,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 50,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 75,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "17_0": {
          "logo": {
            "x": 80,
            "y": 15,
            "w": 12,
            "h": 20,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 10,
            "y": 15,
            "fontSize": 22,
            "fontWeight": "bold",
            "align": "left",
            "color": "#10B981"
          },
          "name": {
            "x": 10,
            "y": 55,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "left"
          },
          "title": {
            "x": 10,
            "y": 68,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "left"
          }
        },
        "17_1": {
          "phone": {
            "x": 90,
            "y": 30,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "right"
          },
          "email": {
            "x": 90,
            "y": 40,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "right"
          },
          "address": {
            "x": 90,
            "y": 65,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "right",
            "maxWidth": 50
          }
        },
        "18_0": {
          "logo": {
            "x": 11,
            "y": 20,
            "w": 10,
            "h": 18,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 10,
            "y": 45,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "left"
          },
          "name": {
            "x": 50,
            "y": 40,
            "fontSize": 44,
            "fontWeight": "bold",
            "align": "center"
          },
          "title": {
            "x": 50,
            "y": 55,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "18_1": {
          "phone": {
            "x": 50,
            "y": 30,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 45,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 70,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "19_0": {
          "logo": {
            "x": 44,
            "y": 35,
            "w": 12,
            "h": 20,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 50,
            "y": 12,
            "fontSize": 26,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFFFFF"
          },
          "name": {
            "x": 50,
            "y": 68,
            "fontSize": 38,
            "fontWeight": "bold",
            "align": "center"
          },
          "title": {
            "x": 50,
            "y": 78,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "19_1": {
          "phone": {
            "x": 10,
            "y": 75,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 10,
            "y": 85,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "address": {
            "x": 90,
            "y": 80,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "right",
            "maxWidth": 40
          }
        },
        "20_0": {
          "logo": {
            "x": 44,
            "y": 20,
            "w": 12,
            "h": 20,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 50,
            "y": 45,
            "fontSize": 28,
            "fontWeight": "bold",
            "align": "center",
            "color": "#D4AF37"
          },
          "name": {
            "x": 50,
            "y": 65,
            "fontSize": 36,
            "fontWeight": "bold",
            "align": "center"
          },
          "title": {
            "x": 50,
            "y": 75,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center",
            "opacity": 0.8
          }
        },
        "20_1": {
          "phone": {
            "x": 10,
            "y": 30,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 10,
            "y": 40,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "website": {
            "x": 10,
            "y": 50,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "address": {
            "x": 10,
            "y": 70,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "left",
            "maxWidth": 60
          }
        },
        "21_0": {
          "logo": {
            "x": 8,
            "y": 40,
            "w": 15,
            "h": 25,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 40,
            "y": 30,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "left"
          },
          "name": {
            "x": 40,
            "y": 55,
            "fontSize": 42,
            "fontWeight": "bold",
            "align": "left"
          },
          "title": {
            "x": 40,
            "y": 68,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "left"
          }
        },
        "21_1": {
          "phone": {
            "x": 50,
            "y": 40,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 50,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 75,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "22_0": {
          "logo": {
            "x": 80,
            "y": 15,
            "w": 12,
            "h": 20,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 10,
            "y": 15,
            "fontSize": 22,
            "fontWeight": "bold",
            "align": "left",
            "color": "#10B981"
          },
          "name": {
            "x": 10,
            "y": 55,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "left"
          },
          "title": {
            "x": 10,
            "y": 68,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "left"
          }
        },
        "22_1": {
          "phone": {
            "x": 90,
            "y": 30,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "right"
          },
          "email": {
            "x": 90,
            "y": 40,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "right"
          },
          "address": {
            "x": 90,
            "y": 65,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "right",
            "maxWidth": 50
          }
        },
        "23_0": {
          "logo": {
            "x": 11,
            "y": 20,
            "w": 10,
            "h": 18,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 10,
            "y": 45,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "left"
          },
          "name": {
            "x": 50,
            "y": 40,
            "fontSize": 44,
            "fontWeight": "bold",
            "align": "center"
          },
          "title": {
            "x": 50,
            "y": 55,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "23_1": {
          "phone": {
            "x": 50,
            "y": 30,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 45,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 70,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "24_0": {
          "logo": {
            "x": 44,
            "y": 35,
            "w": 12,
            "h": 20,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 50,
            "y": 12,
            "fontSize": 26,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFFFFF"
          },
          "name": {
            "x": 50,
            "y": 68,
            "fontSize": 38,
            "fontWeight": "bold",
            "align": "center"
          },
          "title": {
            "x": 50,
            "y": 78,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "24_1": {
          "phone": {
            "x": 10,
            "y": 75,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 10,
            "y": 85,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "address": {
            "x": 90,
            "y": 80,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "right",
            "maxWidth": 40
          }
        },
        "25_0": {
          "logo": {
            "x": 44,
            "y": 20,
            "w": 12,
            "h": 20,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 50,
            "y": 45,
            "fontSize": 28,
            "fontWeight": "bold",
            "align": "center",
            "color": "#D4AF37"
          },
          "name": {
            "x": 50,
            "y": 65,
            "fontSize": 36,
            "fontWeight": "bold",
            "align": "center"
          },
          "title": {
            "x": 50,
            "y": 75,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center",
            "opacity": 0.8
          }
        },
        "25_1": {
          "phone": {
            "x": 10,
            "y": 30,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 10,
            "y": 40,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "website": {
            "x": 10,
            "y": 50,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "address": {
            "x": 10,
            "y": 70,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "left",
            "maxWidth": 60
          }
        },
        "26_0": {
          "logo": {
            "x": 8,
            "y": 40,
            "w": 15,
            "h": 25,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 40,
            "y": 30,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "left"
          },
          "name": {
            "x": 40,
            "y": 55,
            "fontSize": 42,
            "fontWeight": "bold",
            "align": "left"
          },
          "title": {
            "x": 40,
            "y": 68,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "left"
          }
        },
        "26_1": {
          "phone": {
            "x": 50,
            "y": 40,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 50,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 75,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "27_0": {
          "logo": {
            "x": 80,
            "y": 15,
            "w": 12,
            "h": 20,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 10,
            "y": 15,
            "fontSize": 22,
            "fontWeight": "bold",
            "align": "left",
            "color": "#10B981"
          },
          "name": {
            "x": 10,
            "y": 55,
            "fontSize": 40,
            "fontWeight": "bold",
            "align": "left"
          },
          "title": {
            "x": 10,
            "y": 68,
            "fontSize": 20,
            "fontWeight": "normal",
            "align": "left"
          }
        },
        "27_1": {
          "phone": {
            "x": 90,
            "y": 30,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "right"
          },
          "email": {
            "x": 90,
            "y": 40,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "right"
          },
          "address": {
            "x": 90,
            "y": 65,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "right",
            "maxWidth": 50
          }
        },
        "28_0": {
          "logo": {
            "x": 11,
            "y": 20,
            "w": 10,
            "h": 18,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 10,
            "y": 45,
            "fontSize": 24,
            "fontWeight": "bold",
            "align": "left"
          },
          "name": {
            "x": 50,
            "y": 40,
            "fontSize": 44,
            "fontWeight": "bold",
            "align": "center"
          },
          "title": {
            "x": 50,
            "y": 55,
            "fontSize": 22,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "28_1": {
          "phone": {
            "x": 50,
            "y": 30,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "email": {
            "x": 50,
            "y": 45,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          },
          "address": {
            "x": 50,
            "y": 70,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "29_0": {
          "logo": {
            "x": 44,
            "y": 35,
            "w": 12,
            "h": 20,
            "type": "image",
            "align": "center"
          },
          "company": {
            "x": 50,
            "y": 12,
            "fontSize": 26,
            "fontWeight": "bold",
            "align": "center",
            "color": "#FFFFFF"
          },
          "name": {
            "x": 50,
            "y": 68,
            "fontSize": 38,
            "fontWeight": "bold",
            "align": "center"
          },
          "title": {
            "x": 50,
            "y": 78,
            "fontSize": 18,
            "fontWeight": "normal",
            "align": "center"
          }
        },
        "29_1": {
          "phone": {
            "x": 10,
            "y": 75,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "email": {
            "x": 10,
            "y": 85,
            "fontSize": 16,
            "fontWeight": "normal",
            "align": "left"
          },
          "address": {
            "x": 90,
            "y": 80,
            "fontSize": 14,
            "fontWeight": "normal",
            "align": "right",
            "maxWidth": 40
          }
        }
      },
      "fields": [
        {
          "id": "logo",
          "label": "Business Logo",
          "type": "image",
          "placeholder": "/placeholder-logo.png"
        },
        {
          "id": "company",
          "label": "Company Name",
          "type": "text",
          "placeholder": "A to Z Prints"
        },
        {
          "id": "name",
          "label": "Full Name",
          "type": "text",
          "placeholder": "Aryan Sharma"
        },
        {
          "id": "title",
          "label": "Job Title",
          "type": "text",
          "placeholder": "Founder & CEO"
        },
        {
          "id": "phone",
          "label": "Phone Number",
          "type": "text",
          "placeholder": "+91 98765 43210"
        },
        {
          "id": "email",
          "label": "Email Address",
          "type": "text",
          "placeholder": "aryan@atozprints.com"
        },
        {
          "id": "website",
          "label": "Website URL",
          "type": "text",
          "placeholder": "www.atozprints.com"
        },
        {
          "id": "address",
          "label": "Office Address",
          "type": "textarea",
          "placeholder": "123, Print Street, Delhi, India"
        }
      ]
    },
    "bulk_discount_rules": []
  },
  {
      "id": "b1000000-0000-0000-0000-000000000001",
      "name": "Visiting Card Matt (200)",
      "slug": "business-card-matt-200",
      "description": "Premium Visiting Cards with Matte finish (set of 200). Smooth texture, non-reflective surface, and high durability.",
      "category": "Stationery",
      "base_price": 899,
      "moq": 1,
      "delivery_days": "5-7 Days",
      "images": [
          "/images/products/business-card-front.png",
          "/images/products/business-card-back.jpeg",
          "/images/products/business-card-showcase.jpeg"
    ],
      "template_images": [],
      "quality_levels": [
          "Matte"
      ],
      "customization_fields": [
          "Full Name",
          "Design Details"
      ],
      "packaging_options": [
          "Standard Box"
      ],
      "supported_views": [
          "front",
          "back"
      ],
      "features": [
          "Premium 350GSM Cardstock",
          "Smooth Non-Reflective Finish",
          "Precision Cut Edge"
      ],
      "specifications": {
          "GSM": "350",
          "Size": "3.5x2 inches"
      },
      "stock_quantity": 9999,
      "is_active": true,
      "created_at": "2026-07-21T14:00:00.000Z",
      "wireframe_images": [],
      "design_areas": {
          "front": {
              "h": 320,
              "w": 200,
              "x": 150,
              "y": 120
          }
      },
      "quality_prices": {},
      "color_variants": [],
      "design_mode": "template_form",
      "design_config": {},
      "bulk_discount_rules": []
  },
  {
      "id": "b1000000-0000-0000-0000-000000000002",
      "name": "Visiting Card UV (200)",
      "slug": "business-card-uv-200",
      "description": "Premium Visiting Cards with Spot UV finish (set of 200). Glossy raised details that pop against a matte background.",
      "category": "Stationery",
      "base_price": 1199,
      "moq": 1,
      "delivery_days": "5-7 Days",
      "images": [
          "/images/products/business-card-front.png",
          "/images/products/business-card-back.jpeg",
          "/images/products/business-card-showcase.jpeg"
    ],
      "template_images": [],
      "quality_levels": [
          "Spot UV"
      ],
      "customization_fields": [
          "Full Name",
          "Design Details"
      ],
      "packaging_options": [
          "Standard Box"
      ],
      "supported_views": [
          "front",
          "back"
      ],
      "features": [
          "Spot UV Raised Gloss",
          "Premium 350GSM Cardstock",
          "Touch of Luxury"
      ],
      "specifications": {
          "GSM": "350",
          "Size": "3.5x2 inches"
      },
      "stock_quantity": 9999,
      "is_active": true,
      "created_at": "2026-07-21T14:00:00.000Z",
      "wireframe_images": [],
      "design_areas": {
          "front": {
              "h": 320,
              "w": 200,
              "x": 150,
              "y": 120
          }
      },
      "quality_prices": {},
      "color_variants": [],
      "design_mode": "template_form",
      "design_config": {},
      "bulk_discount_rules": []
  },
  {
      "id": "b1000000-0000-0000-0000-000000000003",
      "name": "Letterhead (100)",
      "slug": "letter-head-100",
      "description": "Premium Corporate Letterheads (set of 100). High-quality 100GSM executive bond paper with sharp color reproduction.",
      "category": "Stationery",
      "base_price": 1499,
      "moq": 1,
      "delivery_days": "5-7 Days",
      "images": [
          "/images/products/letterhead.png"
    ],
      "template_images": [],
      "quality_levels": [
          "Premium Bond"
      ],
      "customization_fields": [
          "Company Name",
          "Contact Details"
      ],
      "packaging_options": [
          "Standard Box"
      ],
      "supported_views": [
          "front"
      ],
      "features": [
          "Executive Bond Paper",
          "100GSM Thickness",
          "Laser Printer Friendly"
      ],
      "specifications": {
          "Paper": "100GSM Bond",
          "Size": "A4"
      },
      "stock_quantity": 9999,
      "is_active": true,
      "created_at": "2026-07-21T14:00:00.000Z",
      "wireframe_images": [],
      "design_areas": {
          "front": {
              "h": 320,
              "w": 200,
              "x": 150,
              "y": 120
          }
      },
      "quality_prices": {},
      "color_variants": [],
      "design_mode": "template_form",
      "design_config": {},
      "bulk_discount_rules": []
  },
  {
      "id": "b1000000-0000-0000-0000-000000000004",
      "name": "PVC Sticker (1000)",
      "slug": "pvc-sticker-1000",
      "description": "Waterproof PVC Stickers (set of 1000). Highly durable, tear-resistant, and perfect for outdoor labeling or premium branding.",
      "category": "Packaging",
      "base_price": 5499,
      "moq": 1,
      "delivery_days": "6-8 Days",
      "images": [
          "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1000&auto=format"
    ],
      "template_images": [],
      "quality_levels": [
          "Waterproof PVC"
      ],
      "customization_fields": [
          "Artwork upload"
      ],
      "packaging_options": [
          "Sheet Cut"
      ],
      "supported_views": [
          "front"
      ],
      "features": [
          "100% Waterproof PVC",
          "Weather-Resistant Adhesive",
          "Gloss or Matte finish"
      ],
      "specifications": {
          "Size": "2x2 inches",
          "Thickness": "100 Microns"
      },
      "stock_quantity": 9999,
      "is_active": true,
      "created_at": "2026-07-21T14:00:00.000Z",
      "wireframe_images": [],
      "design_areas": {
          "front": {
              "h": 300,
              "w": 300,
              "x": 100,
              "y": 100
          }
      },
      "quality_prices": {},
      "color_variants": [],
      "design_mode": "standard",
      "design_config": {},
      "bulk_discount_rules": []
  },
  {
      "id": "b1000000-0000-0000-0000-000000000005",
      "name": "Paper Sticker (1000)",
      "slug": "paper-sticker-1000",
      "description": "Premium Glossy Paper Stickers (set of 1000). Perfect for product packaging, seal tags, box labeling, and mailers.",
      "category": "Packaging",
      "base_price": 4299,
      "moq": 1,
      "delivery_days": "5-7 Days",
      "images": [
          "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?q=80&w=1000&auto=format"
    ],
      "template_images": [],
      "quality_levels": [
          "Glossy Paper"
      ],
      "customization_fields": [
          "Artwork upload"
      ],
      "packaging_options": [
          "Sheet Cut"
      ],
      "supported_views": [
          "front"
      ],
      "features": [
          "Premium Glossy Finish",
          "Strong Self-Adhesive",
          "Vibrant Color Print"
      ],
      "specifications": {
          "Size": "2x2 inches",
          "Thickness": "80 GSM"
      },
      "stock_quantity": 9999,
      "is_active": true,
      "created_at": "2026-07-21T14:00:00.000Z",
      "wireframe_images": [],
      "design_areas": {
          "front": {
              "h": 300,
              "w": 300,
              "x": 100,
              "y": 100
          }
      },
      "quality_prices": {},
      "color_variants": [],
      "design_mode": "standard",
      "design_config": {},
      "bulk_discount_rules": []
  },
  {
      "id": "b1000000-0000-0000-0000-000000000006",
      "name": "Flyers A4 (1000)",
      "slug": "flyers-a4-1000",
      "description": "A4 Corporate Flyers (set of 1000). Standard 130GSM glossy art paper with double-sided vibrant printing. Ideal for hand-outs and promotions.",
      "category": "Stationery",
      "base_price": 7999,
      "moq": 1,
      "delivery_days": "5-7 Days",
      "images": [
          "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=1000&auto=format"
    ],
      "template_images": [],
      "quality_levels": [
          "130GSM Glossy"
      ],
      "customization_fields": [
          "Artwork upload"
      ],
      "packaging_options": [
          "Standard shrink wrap"
      ],
      "supported_views": [
          "front",
          "back"
      ],
      "features": [
          "A4 Dimension",
          "Vibrant Glossy Art Paper",
          "Double-sided printing included"
      ],
      "specifications": {
          "Paper": "130GSM Art Paper",
          "Size": "A4"
      },
      "stock_quantity": 9999,
      "is_active": true,
      "created_at": "2026-07-21T14:00:00.000Z",
      "wireframe_images": [],
      "design_areas": {
          "front": {
              "h": 400,
              "w": 280,
              "x": 110,
              "y": 50
          }
      },
      "quality_prices": {},
      "color_variants": [],
      "design_mode": "standard",
      "design_config": {},
      "bulk_discount_rules": []
  },
  {
      "id": "b1000000-0000-0000-0000-000000000007",
      "name": "Brochure A4 (200)",
      "slug": "brochure-a4-200",
      "description": "A4 Corporate Brochures (set of 200). Trifold or bifold options on premium 250GSM card stock with soft matte lamination.",
      "category": "Stationery",
      "base_price": 12999,
      "moq": 1,
      "delivery_days": "6-8 Days",
      "images": [
          "https://images.unsplash.com/photo-1562564055-71e051d33c19?q=80&w=1000&auto=format"
    ],
      "template_images": [],
      "quality_levels": [
          "250GSM Matte Laminated"
      ],
      "customization_fields": [
          "Artwork upload"
      ],
      "packaging_options": [
          "Standard Box"
      ],
      "supported_views": [
          "front",
          "back"
      ],
      "features": [
          "Heavyweight 250GSM Card Stock",
          "Elegant Matte Lamination",
          "Bi-Fold / Tri-Fold selection"
      ],
      "specifications": {
          "Thickness": "250GSM",
          "Lamination": "Matte"
      },
      "stock_quantity": 9999,
      "is_active": true,
      "created_at": "2026-07-21T14:00:00.000Z",
      "wireframe_images": [],
      "design_areas": {
          "front": {
              "h": 400,
              "w": 280,
              "x": 110,
              "y": 50
          }
      },
      "quality_prices": {},
      "color_variants": [],
      "design_mode": "standard",
      "design_config": {},
      "bulk_discount_rules": []
  },
  {
      "id": "b1000000-0000-0000-0000-000000000008",
      "name": "Diary (50)",
      "slug": "diary-with-logo-50",
      "description": "Executive Leatherette Diaries (set of 50). Custom logo engraving or UV printing. Includes pen holder and premium ruled sheets.",
      "category": "Corporate Gifting",
      "base_price": 6999,
      "moq": 1,
      "delivery_days": "7-10 Days",
      "images": [
          "/images/products/notebook.png"
    ],
      "template_images": [],
      "quality_levels": [
          "Premium Leatherette"
      ],
      "customization_fields": [
          "Logo",
          "Engraving details"
      ],
      "packaging_options": [
          "Gift Wrap"
      ],
      "supported_views": [
          "front"
      ],
      "features": [
          "Soft-touch leatherette exterior",
          "UV logo print or Laser engraving",
          "Ruled premium paper"
      ],
      "specifications": {
          "Size": "A5",
          "Pages": "160 Ruled"
      },
      "stock_quantity": 9999,
      "is_active": true,
      "created_at": "2026-07-21T14:00:00.000Z",
      "wireframe_images": [],
      "design_areas": {
          "front": {
              "h": 320,
              "w": 200,
              "x": 150,
              "y": 120
          }
      },
      "quality_prices": {},
      "color_variants": [],
      "design_mode": "template_form",
      "design_config": {},
      "bulk_discount_rules": []
  },
  {
      "id": "b1000000-0000-0000-0000-000000000009",
      "name": "T-Shirt (50)",
      "slug": "t-shirt-50",
      "description": "Premium Cotton T-Shirts (set of 50). High-comfort 180GSM combed cotton, double stitched, with custom front/back printing.",
      "category": "Apparel",
      "base_price": 18999,
      "moq": 1,
      "delivery_days": "7-10 Days",
      "images": [
            "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776262582550-Gemini_Generated_Image_q63cfzq63cfzq63c__1_-removebg-preview.png",
            "https://fgtxaeyrsrtktazithwl.supabase.co/storage/v1/object/public/products/1776262603579-Gemini_Generated_Image_q63cfzq63cfzq63c%20(1).png"
      ],
      "template_images": [],
      "quality_levels": [
          "Premium Cotton"
      ],
      "customization_fields": [
          "Front design upload",
          "Back design upload"
      ],
      "packaging_options": [
          "Individually Poly-bagged"
      ],
      "supported_views": [
          "front",
          "back"
      ],
      "features": [
          "100% Combed Organic Cotton",
          "180 GSM Bio-Washed Fabric",
          "Vibrant Screen/DTG Print"
      ],
      "specifications": {
          "GSM": "180",
          "Material": "100% Cotton"
      },
      "stock_quantity": 9999,
      "is_active": true,
      "created_at": "2026-07-21T14:00:00.000Z",
      "wireframe_images": [],
      "design_areas": {
          "front": {
              "h": 320,
              "w": 200,
              "x": 150,
              "y": 120
          }
      },
      "quality_prices": {},
      "color_variants": [],
      "design_mode": "standard",
      "design_config": {},
      "bulk_discount_rules": []
  },
  {
      "id": "b1000000-0000-0000-0000-000000000010",
      "name": "Printed Pen (50)",
      "slug": "custom-pen-50",
      "description": "Premium Metal Ballpoint Pens (set of 50). Matte finish barrel, custom logo printing or engraving, with smooth blue/black ink.",
      "category": "Corporate Gifting",
      "base_price": 4999,
      "moq": 1,
      "delivery_days": "5-7 Days",
      "images": [
          "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1000&auto=format"
    ],
      "template_images": [],
      "quality_levels": [
          "Engraved Metal"
      ],
      "customization_fields": [
          "Logo",
          "Text details"
      ],
      "packaging_options": [
          "Standard sleeve"
      ],
      "supported_views": [
          "front"
      ],
      "features": [
          "Matte Anodized Metal Barrel",
          "Fine laser engraving logo detail",
          "Smooth German-ink ballpoint"
      ],
      "specifications": {
          "Ink": "Blue/Black",
          "Body": "Metal"
      },
      "stock_quantity": 9999,
      "is_active": true,
      "created_at": "2026-07-21T14:00:00.000Z",
      "wireframe_images": [],
      "design_areas": {
          "front": {
              "h": 320,
              "w": 200,
              "x": 150,
              "y": 120
          }
      },
      "quality_prices": {},
      "color_variants": [],
      "design_mode": "template_form",
      "design_config": {},
      "bulk_discount_rules": []
  }
];
export const mockPricingCategories = [
  {
    id: 'stationery',
    name: 'Corporate Stationery',
    icon: 'stationery',
    headers: ['10+', '50+', '100+', '500+'],
    items: [
      { name: 'Executive Business Cards', unit: 'Units', tiers: [10, 8, 6, 4] },
      { name: 'Letterheads (Premium)', unit: 'Units', tiers: [15, 12, 10, 8] },
      { name: 'Custom ID Cards', unit: 'Units', tiers: [150, 120, 100, 80] }
    ]
  },
  {
    id: 'apparel',
    name: 'Custom Apparel',
    icon: 'apparel',
    headers: ['10+', '25+', '50+', '100+'],
    items: [
      { name: 'Premium Cotton T-Shirts', unit: 'Units', tiers: [450, 400, 350, 300] },
      { name: 'Corporate Polos', unit: 'Units', tiers: [650, 600, 550, 500] },
      { name: 'Heavyweight Hoodies', unit: 'Units', tiers: [1250, 1150, 1050, 950] }
    ]
  },
  {
    id: 'drinkware',
    name: 'Bespoke Drinkware',
    icon: 'drinkware',
    headers: ['20+', '50+', '100+', '250+'],
    items: [
      { name: 'Ceramic Coffee Mugs', unit: 'Units', tiers: [180, 160, 140, 120] },
      { name: 'Insulated Water Bottles', unit: 'Units', tiers: [850, 800, 750, 700] },
      { name: 'Travel Tumblers', unit: 'Units', tiers: [550, 500, 450, 400] }
    ]
  }
];
