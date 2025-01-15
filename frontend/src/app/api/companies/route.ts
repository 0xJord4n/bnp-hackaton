// import { harmonicService } from '@/lib/services/harmonic';
import { harmonicService } from '@/lib/services/harmonic';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json(
      { error: 'Domain parameter is required' },
      { status: 400 }
    );
  }

  const { data, error } = await harmonicService.getCompanyByUrl(domain);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status }
    );
  }

  return NextResponse.json({ data });
}