import { fabric } from 'fabric';

export interface CanvasObjectProperties {
  type: string;
  id?: string;
  fill?: string;
  opacity?: number;
  angle?: number;
  left?: number;
  top?: number;
  scaleX?: number;
  scaleY?: number;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  charSpacing?: number;
  lineHeight?: number;
  textAlign?: string;
  shadow?: { color: string; blur: number; offsetX: number; offsetY: number };
  _isGrayscale?: boolean;
  _brightness?: number;
  _contrast?: number;
  _naturalWidth?: number;
  _naturalHeight?: number;
  stroke?: string;
  strokeWidth?: number;
  _curve?: number;
  locked?: boolean;
  visible?: boolean;
}

export interface DesignerCanvasProps {
  productImage: string;
  productColor?: string;
  isDrawingMode?: boolean;
  drawingColor?: string;
  drawingWidth?: number;
  onSelectionCleared?: () => void;
  onObjectSelected?: (properties: CanvasObjectProperties) => void;
  onObjectModified?: (properties: CanvasObjectProperties) => void;
  onObjectsUpdated?: () => void;
  onHistoryChange?: () => void;
  onOutOfBoundsWarning?: (isOut: boolean) => void; 
  onLowQualityWarning?: (isLowQuality: boolean) => void;
  designArea?: { x: number; y: number; w: number; h: number };
  disableTinting?: boolean;
}

export interface DesignerCanvasRef {
  addText: (text: string) => void;
  addImage: (url: string) => void;
  addShape: (type: 'circle' | 'rect' | 'triangle' | 'star' | 'heart' | 'line') => void;
  addIcon: (iconName: string) => void;
  addSvgGraphic: (svgString: string, name: string) => void;
  updateActiveObject: (properties: Partial<CanvasObjectProperties>) => void;
  updateObjectById: (id: string, properties: Partial<CanvasObjectProperties>) => void;
  setTextShadow: (options: { color: string; blur: number; offsetX: number; offsetY: number } | null) => void;
  setTextOutline: (options: { color: string; width: number } | null) => void;
  deleteActiveObject: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  downloadDesign: () => void;
  getJson: () => any;
  loadJson: (json: any) => void;
  getLayers: () => any[];
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  duplicateActiveObject: () => void;
  toggleLock: () => void;
  undo: () => void;
  redo: () => void;
  setPanning: (enabled: boolean) => void;
  getDesignDataUrl: () => string;
  alignActiveObject: (position: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  lockAllObjects: (lock: boolean) => void;
  clearDesign: () => void;
  addPattern: (url: string) => void;
}

export const getObjectProperties = (obj: any): CanvasObjectProperties => {
  const props: CanvasObjectProperties = {
    type: obj.type,
    id: obj.id,
    fill: obj.fill,
    opacity: obj.opacity,
    angle: obj.angle,
    left: obj.left,
    top: obj.top,
    scaleX: obj.scaleX,
    scaleY: obj.scaleY,
    locked: obj.lockMovementX || false,
    visible: obj.visible !== false,
  };

  if (obj.type === 'i-text' || obj.type === 'text') {
    props.text = obj.text;
    props.fontFamily = obj.fontFamily;
    props.fontSize = obj.fontSize;
    props.charSpacing = obj.charSpacing;
    props.lineHeight = obj.lineHeight;
    props.textAlign = obj.textAlign;
    props.stroke = obj.stroke;
    props.strokeWidth = obj.strokeWidth;
    props._curve = obj._curve;
    if (obj.shadow) {
      props.shadow = {
        color: obj.shadow.color || 'rgba(0,0,0,0)',
        blur: obj.shadow.blur || 0,
        offsetX: obj.shadow.offsetX || 0,
        offsetY: obj.shadow.offsetY || 0,
      };
    }
  }

  if (obj.type === 'image') {
    props._isGrayscale = obj._isGrayscale || false;
    props._brightness = obj._brightness || 0;
    props._contrast = obj._contrast || 0;
    props._naturalWidth = obj._naturalWidth;
    props._naturalHeight = obj._naturalHeight;
  }

  return props;
};
