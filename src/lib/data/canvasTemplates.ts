export const canvasTemplates = [
  {
    id: 'happy-birthday',
    name: 'Happy Birthday',
    preview: '🎉',
    json: {
      version: '5.3.0',
      objects: [
        {
          type: 'i-text',
          version: '5.3.0',
          originX: 'center',
          originY: 'center',
          left: 400,
          top: 300,
          width: 400,
          height: 100,
          fill: '#E91E63',
          stroke: '#ffffff',
          strokeWidth: 2,
          text: 'Happy Birthday!',
          fontSize: 64,
          fontWeight: 'bold',
          fontFamily: 'Montserrat',
          textAlign: 'center',
          id: 'template-text-1'
        },
        {
          type: 'i-text',
          version: '5.3.0',
          originX: 'center',
          originY: 'center',
          left: 400,
          top: 400,
          width: 300,
          height: 50,
          fill: '#333333',
          text: 'Have a wonderful day',
          fontSize: 32,
          fontFamily: 'Inter',
          textAlign: 'center',
          id: 'template-text-2'
        }
      ]
    }
  },
  {
    id: 'corporate-logo',
    name: 'Corporate Branding',
    preview: '💼',
    json: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect',
          version: '5.3.0',
          originX: 'center',
          originY: 'center',
          left: 400,
          top: 350,
          width: 300,
          height: 150,
          fill: '#2563eb',
          rx: 16,
          ry: 16,
          id: 'template-rect-1'
        },
        {
          type: 'i-text',
          version: '5.3.0',
          originX: 'center',
          originY: 'center',
          left: 400,
          top: 350,
          width: 250,
          height: 50,
          fill: '#ffffff',
          text: 'YOUR LOGO',
          fontSize: 48,
          fontWeight: 'bold',
          fontFamily: 'Roboto',
          textAlign: 'center',
          id: 'template-text-3'
        }
      ]
    }
  },
  {
    id: 'i-love-ny',
    name: 'I Heart Classic',
    preview: '❤️',
    json: {
      version: '5.3.0',
      objects: [
        {
          type: 'i-text',
          version: '5.3.0',
          originX: 'center',
          originY: 'center',
          left: 400,
          top: 300,
          width: 300,
          height: 120,
          fill: '#000000',
          text: 'I ❤️ NY',
          fontSize: 96,
          fontWeight: 'black',
          fontFamily: 'Oswald',
          textAlign: 'center',
          id: 'template-text-4'
        }
      ]
    }
  }
];
