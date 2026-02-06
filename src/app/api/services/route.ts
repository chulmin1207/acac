import { NextRequest, NextResponse } from 'next/server';
import { getServices, createService } from '@/lib/db/services';

/**
 * GET /api/services - Get all services
 */
export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json(services);
  } catch (error) {
    console.error('GET /api/services error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/services - Create a new service
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const service = await createService({
      name: body.name,
      description: body.description,
      category: body.category,
      keywords: body.keywords || [],
      thumbnail: body.thumbnail,
      isActive: body.isActive ?? true,
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('POST /api/services error:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
