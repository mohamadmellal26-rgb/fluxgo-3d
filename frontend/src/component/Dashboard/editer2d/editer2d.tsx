import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { 
  FiSquare, 
  FiCircle, 
  FiType, 
  FiImage, 
  FiScissors, 
  FiTrash2, 
  FiDownload, 
  FiCheck, 
  FiX 
} from 'react-icons/fi';
import styles from './Editor2D.module.css';

export default function Editor2D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const targetImageRef = useRef<fabric.FabricImage | null>(null);

  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [selectedFontFamily, setSelectedFontFamily] = useState('Arial');
  const [selectedFontSize, setSelectedFontSize] = useState(24);
  const [textShadowColor, setTextShadowColor] = useState('#000000');
  const [textShadowBlur, setTextShadowBlur] = useState(5);
  const [blurAmount, setBlurAmount] = useState(0);

  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [isTextSelected, setIsTextSelected] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [cropType, setCropType] = useState<'polygon' | 'circle'>('polygon');
  const [cropPoints, setCropPoints] = useState<{ x: number; y: number }[]>([]);
  const [circleCropData, setCircleCropData] = useState<{ x: number; y: number; radius: number }>({ x: 0, y: 0, radius: 50 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 550,
      backgroundColor: '#121212',
      selection: true,
    });

    fabricCanvasRef.current = canvas;

    const handleSelection = () => {
      const active = canvas.getActiveObject();
      const activeName = (active as any)?.name;
      if (active && (activeName === 'temp_quad_poly' || activeName === 'crop_handle' || activeName === 'temp_circle' || activeName === 'circle_handle')) return;

      setActiveObject(active || null);
      setIsImageSelected(active instanceof fabric.FabricImage);
      setIsTextSelected(active instanceof fabric.Textbox || active instanceof fabric.IText);
      
      if (active instanceof fabric.Textbox || active instanceof fabric.IText) {
        setSelectedFontFamily(active.fontFamily || 'Arial');
        setSelectedFontSize(active.fontSize || 24);
        if (active.shadow && typeof active.shadow === 'object') {
          setTextShadowColor((active.shadow as fabric.Shadow).color || '#000000');
          setTextShadowBlur((active.shadow as fabric.Shadow).blur || 5);
        }
      }
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => {
      const canvasObj = fabricCanvasRef.current;
      if (canvasObj && canvasObj.getObjects().some((o) => {
        const name = (o as any).name;
        return name === 'temp_quad_poly' || name === 'crop_handle' || name === 'temp_circle' || name === 'circle_handle';
      })) return;
      setActiveObject(null);
      setIsImageSelected(false);
      setIsTextSelected(false);
    });

    canvas.on('mouse:dblclick', (options) => {
      const target = options.target;
      if (target instanceof fabric.FabricImage) {
        canvas.setActiveObject(target);
        startCropMode(target, 'polygon');
      }
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  const addRectangle = () => {
    if (!fabricCanvasRef.current) return;
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: selectedColor,
      width: 120,
      height: 80,
      rx: 8,
      ry: 8,
    });
    fabricCanvasRef.current.add(rect);
    fabricCanvasRef.current.setActiveObject(rect);
  };

  const addCircle = () => {
    if (!fabricCanvasRef.current) return;
    const circle = new fabric.Circle({
      left: 250,
      top: 100,
      fill: selectedColor,
      radius: 50,
    });
    fabricCanvasRef.current.add(circle);
    fabricCanvasRef.current.setActiveObject(circle);
  };

  const addText = () => {
    if (!fabricCanvasRef.current) return;
    const text = new fabric.Textbox('Type your text here', {
      left: 200,
      top: 250,
      fontSize: selectedFontSize,
      fill: selectedColor,
      fontFamily: selectedFontFamily,
      direction: 'ltr',
      textAlign: 'left',
      shadow: new fabric.Shadow({
        color: textShadowColor,
        blur: textShadowBlur,
        offsetX: 2,
        offsetY: 2,
      }),
    });
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvasRef.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgObj = new Image();
      imgObj.src = event.target?.result as string;
      imgObj.onload = () => {
        const image = new fabric.FabricImage(imgObj, {
          left: 150,
          top: 150,
        });
        image.scaleToWidth(300);
        fabricCanvasRef.current?.add(image);
        fabricCanvasRef.current?.setActiveObject(image);
      };
    };
    reader.readAsDataURL(file);
  };

  const startCropMode = (imageObj?: fabric.FabricImage, type: 'polygon' | 'circle' = 'polygon') => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const targetImg = imageObj || (canvas.getActiveObject() as fabric.FabricImage);
    if (!(targetImg instanceof fabric.FabricImage)) return;

    targetImageRef.current = targetImg;
    setIsCropping(true);
    setCropType(type);

    targetImg.selectable = false;
    targetImg.evented = false;
    canvas.selection = false;

    const bound = targetImg.getBoundingRect();

    if (type === 'polygon') {
      const initialPoints = [
        { x: bound.left, y: bound.top },
        { x: bound.left + bound.width, y: bound.top },
        { x: bound.left + bound.width, y: bound.top + bound.height },
        { x: bound.left, y: bound.top + bound.height },
      ];
      setCropPoints(initialPoints);
      updatePolygonVisuals(initialPoints);
    } else {
      const centerX = bound.left + bound.width / 2;
      const centerY = bound.top + bound.height / 2;
      const defaultRadius = Math.min(bound.width, bound.height) / 3;
      setCircleCropData({ x: centerX, y: centerY, radius: defaultRadius });
      updateCircleVisuals(centerX, centerY, defaultRadius);
    }
  };

  const updatePolygonVisuals = (points: { x: number; y: number }[]) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    clearCropObjects();

    const poly = new fabric.Polygon(points, {
      fill: 'rgba(255, 255, 255, 0.25)',
      stroke: '#ffffff',
      strokeWidth: 2,
      strokeDashArray: [4, 4],
      selectable: false,
      evented: false,
    } as any);
    (poly as any).name = 'temp_quad_poly';
    canvas.add(poly);

    points.forEach((pt, index) => {
      const handle = new fabric.Circle({
        left: pt.x,
        top: pt.y,
        radius: 6,
        fill: '#000000',
        stroke: '#ffffff',
        strokeWidth: 3,
        originX: 'center',
        originY: 'center',
        hasControls: false,
        hasBorders: false,
      } as any);
      (handle as any).name = 'crop_handle';

      handle.on('moving', () => {
        setCropPoints((currentPoints) => {
          const updated = [...currentPoints];
          updated[index] = {
            x: handle.left || 0,
            y: handle.top || 0,
          };
          updatePolygonVisualsFast(updated);
          return updated;
        });
      });

      canvas.add(handle);
    });

    canvas.renderAll();
  };

  const updatePolygonVisualsFast = (points: { x: number; y: number }[]) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const poly = canvas.getObjects().find((o) => (o as any).name === 'temp_quad_poly') as fabric.Polygon;
    if (poly) {
      poly.set({ points: [...points] });
      canvas.renderAll();
    }
  };

  const updateCircleVisuals = (x: number, y: number, radius: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    clearCropObjects();

    const circle = new fabric.Circle({
      left: x,
      top: y,
      radius: radius,
      fill: 'rgba(255, 255, 255, 0.25)',
      stroke: '#ffffff',
      strokeWidth: 2,
      strokeDashArray: [4, 4],
      selectable: true,
      hasControls: false,
      hasBorders: false,
      originX: 'center',
      originY: 'center',
    } as any);
    (circle as any).name = 'temp_circle';

    circle.on('moving', () => {
      const newX = circle.left || x;
      const newY = circle.top || y;
      const currentRadius = circle.radius || radius;
      setCircleCropData({ x: newX, y: newY, radius: currentRadius });
      updateCircleHandlePosition(newX, newY, currentRadius);
    });

    canvas.add(circle);

    const offset = radius / Math.SQRT2;

    const handle = new fabric.Circle({
      left: x + offset,
      top: y + offset,
      radius: 6,
      fill: '#000000',
      stroke: '#ffffff',
      strokeWidth: 3,
      originX: 'center',
      originY: 'center',
      hasControls: false,
      hasBorders: false,
    } as any);
    (handle as any).name = 'circle_handle';

    handle.on('moving', () => {
      const hLeft = handle.left || x;
      const hTop = handle.top || y;
      
      const newRadius = Math.max(10, Math.sqrt(Math.pow(hLeft - x, 2) + Math.pow(hTop - y, 2)) * Math.SQRT2);
      
      setCircleCropData((prev) => ({ ...prev, radius: newRadius }));
      
      const cObj = canvas.getObjects().find((o) => (o as any).name === 'temp_circle') as fabric.Circle;
      if (cObj) {
        cObj.set({ radius: newRadius });
        cObj.setCoords();
      }
      updateCircleHandlePosition(x, y, newRadius);
      canvas.renderAll();
    });

    canvas.add(handle);
    canvas.renderAll();
  };

  const updateCircleHandlePosition = (x: number, y: number, radius: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const handle = canvas.getObjects().find((o) => (o as any).name === 'circle_handle');
    if (handle) {
      const offset = radius / Math.SQRT2;
      handle.set({ left: x + offset, top: y + offset });
      handle.setCoords();
    }
  };

  const clearCropObjects = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    canvas.getObjects().forEach((o) => {
      const name = (o as any).name;
      if (['temp_quad_poly', 'crop_handle', 'temp_circle', 'circle_handle'].includes(name || '')) {
        canvas.remove(o);
      }
    });
  };

  const applyCutout = () => {
    const canvas = fabricCanvasRef.current;
    const imgObj = targetImageRef.current;

    if (!canvas || !imgObj) return;

    const bound = imgObj.getBoundingRect();
    const imgElement = imgObj.getElement() as HTMLImageElement;
    
    const naturalWidth = imgElement.naturalWidth || imgObj.width || 1;
    const naturalHeight = imgElement.naturalHeight || imgObj.height || 1;

    const scaleX = bound.width / naturalWidth;
    const scaleY = bound.height / naturalHeight;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = naturalWidth;
    tempCanvas.height = naturalHeight;
    const tempCtx = tempCanvas.getContext('2d');

    if (tempCtx) {
      tempCtx.drawImage(imgElement, 0, 0, naturalWidth, naturalHeight);
      tempCtx.globalCompositeOperation = 'destination-out';

      if (cropType === 'polygon') {
        if (cropPoints.length !== 4) return;
        const localPoints = cropPoints.map((p) => ({
          x: (p.x - bound.left) / scaleX,
          y: (p.y - bound.top) / scaleY,
        }));

        tempCtx.beginPath();
        tempCtx.moveTo(localPoints[0].x, localPoints[0].y);
        for (let i = 1; i < localPoints.length; i++) {
          tempCtx.lineTo(localPoints[i].x, localPoints[i].y);
        }
        tempCtx.closePath();
        tempCtx.fill();
      } else {
        const localX = (circleCropData.x - bound.left) / scaleX;
        const localY = (circleCropData.y - bound.top) / scaleY;
        const localRadius = circleCropData.radius / ((scaleX + scaleY) / 2);

        tempCtx.beginPath();
        tempCtx.arc(localX, localY, localRadius, 0, Math.PI * 2);
        tempCtx.closePath();
        tempCtx.fill();
      }

      const modifiedImg = new Image();
      modifiedImg.src = tempCanvas.toDataURL();
      modifiedImg.onload = () => {
        imgObj.setElement(modifiedImg);
        imgObj.set({ clipPath: undefined });
        imgObj.setCoords();
        exitCropMode();
      };
    }
  };

  const cancelCrop = () => {
    exitCropMode();
  };

  const exitCropMode = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    clearCropObjects();

    canvas.defaultCursor = 'default';
    canvas.hoverCursor = 'move';
    canvas.selection = true;

    if (targetImageRef.current) {
      targetImageRef.current.selectable = true;
      targetImageRef.current.evented = true;
      canvas.setActiveObject(targetImageRef.current);
      targetImageRef.current = null;
    }

    setIsCropping(false);
    setCropPoints([]);
    canvas.renderAll();
  };

  const changeColor = (color: string) => {
    setSelectedColor(color);
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObj = canvas.getActiveObject();
    if (activeObj && !(activeObj instanceof fabric.FabricImage)) {
      activeObj.set('fill', color);
      canvas.renderAll();
    }
  };

  const changeFontFamily = (fontFamily: string) => {
    setSelectedFontFamily(fontFamily);
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObj = canvas.getActiveObject();
    if (activeObj && (activeObj instanceof fabric.Textbox || activeObj instanceof fabric.IText)) {
      activeObj.set('fontFamily', fontFamily);
      canvas.renderAll();
    }
  };

  const changeFontSize = (size: number) => {
    setSelectedFontSize(size);
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObj = canvas.getActiveObject();
    if (activeObj && (activeObj instanceof fabric.Textbox || activeObj instanceof fabric.IText)) {
      activeObj.set('fontSize', size);
      canvas.renderAll();
    }
  };

  const updateTextShadow = (color: string, blur: number) => {
    setTextShadowColor(color);
    setTextShadowBlur(blur);
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObj = canvas.getActiveObject();
    if (activeObj && (activeObj instanceof fabric.Textbox || activeObj instanceof fabric.IText)) {
      activeObj.set('shadow', new fabric.Shadow({
        color: color,
        blur: blur,
        offsetX: 2,
        offsetY: 2,
      }));
      canvas.renderAll();
    }
  };

  const applyBlurFilter = (value: number) => {
    setBlurAmount(value);
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObj = canvas.getActiveObject();
    if (activeObj instanceof fabric.FabricImage) {
      if (value === 0) {
        activeObj.filters = [];
      } else {
        activeObj.filters = [new (fabric.filters as any).Blur({ blur: value / 10 })];
      }
      activeObj.applyFilters();
      canvas.renderAll();
    }
  };

  const deleteSelected = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    activeObjects.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const exportImage = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });

    const link = document.createElement('a');
    link.download = 'design.png';
    link.href = dataURL;
    link.click();
  };

  return (
    <div className={styles.editorLayout}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.appBadge3d}></div>
          <span className={styles.title}>FluxGO 2D Studio</span>
          <span className={styles.badge}>Monochrome Environment</span>
        </div>
        <div>
          <button onClick={exportImage} className={styles.exportBtn}>
            <FiDownload style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Export 2D (PNG)
          </button>
        </div>
      </header>

      <div className={styles.workspace}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Control Panel</h2>

          <div className={styles.section}>
            <span className={styles.sectionTitle}>Add Elements</span>
            <div className={styles.buttonGroup}>
              <button onClick={addRectangle} className={styles.toolBtn}>
                <FiSquare style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} /> Rectangle
              </button>
              <button onClick={addCircle} className={styles.toolBtn}>
                <FiCircle style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} /> Circle
              </button>
              <button onClick={addText} className={styles.toolBtn}>
                <FiType style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} /> Text
              </button>
              <label className={styles.uploadLabel}>
                <FiImage style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} /> Upload Image
                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
              </label>
            </div>
          </div>

          {!isImageSelected && !isTextSelected && !isCropping && (
            <div className={styles.section}>
              <span className={styles.sectionTitle}>General Properties</span>
              <div className={styles.propertyRow}>
                <label className={styles.propertyLabel}>Element Color:</label>
                <input type="color" value={selectedColor} onChange={(e) => changeColor(e.target.value)} className={styles.colorInput} />
              </div>
            </div>
          )}

          {isTextSelected && !isCropping && (
            <div className={styles.section}>
              <span className={styles.sectionTitle}>Text & Shadow Properties</span>
              <div style={{ marginBottom: '8px' }}>
                <label className={styles.propertyLabel} style={{ display: 'block', marginBottom: '4px' }}>Font Family:</label>
                <select value={selectedFontFamily} onChange={(e) => changeFontFamily(e.target.value)} className={styles.selectInput}>
                  <option value="Arial">Arial</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Tahoma">Tahoma</option>
                  <option value="Impact">Impact</option>
                </select>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label className={styles.propertyLabel} style={{ display: 'block', marginBottom: '4px' }}>Font Size (px):</label>
                <input type="number" min="8" max="120" value={selectedFontSize} onChange={(e) => changeFontSize(Number(e.target.value))} className={styles.numberInput} />
              </div>

              <div className={styles.propertyRow} style={{ marginBottom: '8px' }}>
                <label className={styles.propertyLabel}>Text Color:</label>
                <input type="color" value={selectedColor} onChange={(e) => changeColor(e.target.value)} className={styles.colorInput} />
              </div>

              <div className={styles.propertyRow} style={{ marginBottom: '8px' }}>
                <label className={styles.propertyLabel}>Shadow Color:</label>
                <input type="color" value={textShadowColor} onChange={(e) => updateTextShadow(e.target.value, textShadowBlur)} className={styles.colorInput} />
              </div>

              <div>
                <label className={styles.propertyLabel} style={{ display: 'block', marginBottom: '4px' }}>Shadow Blur: {textShadowBlur}px</label>
                <input type="range" min="0" max="30" value={textShadowBlur} onChange={(e) => updateTextShadow(textShadowColor, Number(e.target.value))} className={styles.rangeInput} />
              </div>
            </div>
          )}

          {isImageSelected && !isCropping && (
            <div className={styles.section}>
              <span className={styles.sectionTitle}>Image Filters & Tools</span>
              <button onClick={() => startCropMode(undefined, 'polygon')} className={styles.toolBtn} style={{ width: '100%', marginBottom: '6px', textAlign: 'left' }}>
                <FiScissors style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} /> Polygon Cutout
              </button>
              <button onClick={() => startCropMode(undefined, 'circle')} className={styles.toolBtn} style={{ width: '100%', marginBottom: '10px', textAlign: 'left' }}>
                <FiScissors style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} /> Circular Cutout
              </button>

              <div>
                <label className={styles.propertyLabel} style={{ display: 'block', marginBottom: '4px' }}>Blur Filter: {blurAmount}</label>
                <input type="range" min="0" max="50" value={blurAmount} onChange={(e) => applyBlurFilter(Number(e.target.value))} className={styles.rangeInput} />
              </div>
            </div>
          )}

          {isCropping && (
            <div className={styles.section} style={{ borderColor: '#444' }}>
              <span className={styles.sectionTitle} style={{ color: '#fff' }}>
                {cropType === 'polygon' ? 'Polygon Cutout Mode' : 'Circular Cutout Mode'}
              </span>
              <p className={styles.cropInfo}>Adjust the handles to define the area.</p>
              <button onClick={applyCutout} className={styles.applyBtn}>
                <FiCheck style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Apply Cutout
              </button>
              <button onClick={cancelCrop} className={styles.cancelBtn}>
                <FiX style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Cancel
              </button>
            </div>
          )}

          <div className={styles.footerActions}>
            <button onClick={deleteSelected} disabled={!activeObject || isCropping} className={styles.deleteBtn} style={{ opacity: (!activeObject || isCropping) ? 0.5 : 1 }}>
              <FiTrash2 style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} /> Delete Selected
            </button>
          </div>
        </aside>

        <main className={styles.canvasArea}>
          <div className={styles.canvasWrapper}>
            <canvas ref={canvasRef} />
          </div>
        </main>
      </div>
    </div>
  );
}