import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Extract dynamic params
    const code = searchParams.get('code')?.slice(0, 500) || 'console.log("Hello Codeship!");';
    const language = searchParams.get('lang') || 'javascript';
    const title = searchParams.get('title') || 'LeetCode Problem';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000',
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            fontFamily: 'monospace',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '32px',
              width: '80%',
              maxWidth: '800px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header (Mac-like buttons + Title) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', width: '100%' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                {title} • {language}
              </div>
            </div>

            {/* Code Body */}
            <div
              style={{
                display: 'flex',
                color: '#e2e8f0', // Light code color
                fontSize: '20px',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                textShadow: '0 0 10px rgba(255,255,255,0.1)',
              }}
            >
              {code}
            </div>
            
            {/* Codeship Watermark */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
               <div style={{ display: 'flex', color: 'rgba(255,255,255,0.3)', fontSize: '14px', fontWeight: 'bold' }}>
                 ⚡ Codeship
               </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
