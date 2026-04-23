"use client";

import React from 'react';
import DesignerCanvas from './DesignerCanvas';
import IntakeFormDesigner from './modes/IntakeFormDesigner';
import { DesignerCanvasProps, DesignerCanvasRef } from '@/types/canvas';

/**
 * DesignerFactory
 * 
 * Routes the product to the appropriate design engine based on designMode.
 * This allows us to swap the Fabric.js canvas for a form-based designer
 * or other future specialized engines (VDP, Multipage) while keeping 
 * the CustomizeClient interface stable.
 */
const DesignerFactory = React.forwardRef<DesignerCanvasRef, DesignerCanvasProps>((props, ref) => {
  const { designMode = 'standard' } = props;

  // Use the Intake Form engine for complex products (Packaging, Logo Design, etc.)
  if (designMode === 'intake_form') {
    return <IntakeFormDesigner {...props} ref={ref} />;
  }

  // Fallback to standard for 'standard', 'vdp', 'multipage'
  // Since vdp/multipage will still use the standard canvas but with different sidebar tools
  return <DesignerCanvas {...props} ref={ref} />;
});

DesignerFactory.displayName = 'DesignerFactory';

export default DesignerFactory;
