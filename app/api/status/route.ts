import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://status.tiles.run/api/v2/status.json', {
      next: { revalidate: 60 }, // Cache for 60 seconds
    })
    
    if (!response.ok) {
      return NextResponse.json(
        { status: { indicator: 'none', description: 'All systems operational' } },
        { status: 200 }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    // Return a default "operational" status if the external API is unreachable
    return NextResponse.json(
      { status: { indicator: 'none', description: 'All systems operational' } },
      { status: 200 }
    )
  }
}
