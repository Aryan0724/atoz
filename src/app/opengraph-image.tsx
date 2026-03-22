import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const dynamic = 'force-dynamic'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #E91E63 0%, #9C27B0 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: 40,
        }}
      >
        <div style={{ display: 'flex', fontSize: 130, fontWeight: 900, marginBottom: 20, textAlign: 'center' }}>
          A to Z Prints
        </div>
        <div style={{ display: 'flex', fontSize: 40, fontWeight: 400, opacity: 0.9, textAlign: 'center' }}>
          Premium Customized Printing & Corporate Gifting
        </div>
      </div>
    ),
    { ...size }
  )
}
