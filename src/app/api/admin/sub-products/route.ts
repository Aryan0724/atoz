import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { 
  PARENT_PRODUCTS, 
  SUB_PRODUCTS_DATA, 
  PRINTASIA_CATEGORIES,
  ParentProductInfo,
  SubProductDesign,
  PrintAsiaCategoryItem
} from '@/lib/data/subProductsData';

const CUSTOM_DATA_PATH = path.join(process.cwd(), 'src', 'lib', 'data', 'subProductsCustom.json');

export interface SubProductsConfigPayload {
  categories: PrintAsiaCategoryItem[];
  parentProducts: ParentProductInfo[];
  subProducts: SubProductDesign[];
  updatedAt?: string;
}

function readStoredConfig(): SubProductsConfigPayload {
  try {
    if (fs.existsSync(CUSTOM_DATA_PATH)) {
      const raw = fs.readFileSync(CUSTOM_DATA_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.subProducts)) {
        return {
          categories: parsed.categories || PRINTASIA_CATEGORIES,
          parentProducts: parsed.parentProducts || PARENT_PRODUCTS,
          subProducts: parsed.subProducts || SUB_PRODUCTS_DATA,
          updatedAt: parsed.updatedAt || new Date().toISOString()
        };
      }
    }
  } catch (err) {
    console.error('[SubProducts API] Failed to read custom data file:', err);
  }

  return {
    categories: PRINTASIA_CATEGORIES,
    parentProducts: PARENT_PRODUCTS,
    subProducts: SUB_PRODUCTS_DATA,
    updatedAt: new Date().toISOString()
  };
}

export async function GET() {
  try {
    const config = readStoredConfig();
    return NextResponse.json({
      success: true,
      data: config
    });
  } catch (error: any) {
    console.error('[SubProducts API GET Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch sub-products configuration' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: SubProductsConfigPayload = await req.json();

    if (!body || !Array.isArray(body.subProducts) || !Array.isArray(body.categories)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload: subProducts and categories arrays are required' },
        { status: 400 }
      );
    }

    const payload: SubProductsConfigPayload = {
      categories: body.categories,
      parentProducts: body.parentProducts || PARENT_PRODUCTS,
      subProducts: body.subProducts,
      updatedAt: new Date().toISOString()
    };

    // Ensure directory exists
    const dir = path.dirname(CUSTOM_DATA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write to local json file
    fs.writeFileSync(CUSTOM_DATA_PATH, JSON.stringify(payload, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Sub-products configuration saved and published successfully',
      counts: {
        designs: payload.subProducts.length,
        categories: payload.categories.length,
        parentProducts: payload.parentProducts.length
      },
      updatedAt: payload.updatedAt
    });
  } catch (error: any) {
    console.error('[SubProducts API POST Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save sub-products configuration' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    if (fs.existsSync(CUSTOM_DATA_PATH)) {
      fs.unlinkSync(CUSTOM_DATA_PATH);
    }
    return NextResponse.json({
      success: true,
      message: 'Sub-products configuration reset to factory defaults'
    });
  } catch (error: any) {
    console.error('[SubProducts API DELETE Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reset configuration' },
      { status: 500 }
    );
  }
}
