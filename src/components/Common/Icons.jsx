import React from 'react';

// Умный компонент штампа ЭЦП (Печать)
// Автоматически адаптирует свои параметры под обычный или полноэкранный режим
export const SealStamp = ({ isFullscreen = false }) => {
  const suffix = isFullscreen ? '-fs' : '';
  const className = isFullscreen ? 'w-full h-full drop-shadow-2xl' : 'w-full h-full drop-shadow-lg';
  const filterId = `seal-shadow${suffix}`;
  const gradientId = `sealGradient${suffix}`;
  const pathId = `circlePath${suffix}`;
  
  // Динамические параметры в зависимости от режима отображения
  const strokeWidthOuter = isFullscreen ? 5 : 4;
  const strokeWidthInner1 = isFullscreen ? 2 : 1.5;
  const strokeWidthInner2 = isFullscreen ? 2.5 : 2;
  const strokeWidthCheck = isFullscreen ? 7 : 6;
  const strokeWidthWaves = isFullscreen ? 2.5 : 2;
  
  const opacityOuter = isFullscreen ? 0.95 : 0.8;
  const opacityInner1 = isFullscreen ? 0.6 : 0.5;
  const opacityInner2 = isFullscreen ? 0.12 : 0.08;
  const opacityInner3 = isFullscreen ? 0.7 : 0.6;
  const opacityCheck = isFullscreen ? 1 : 0.9;
  const opacityWaves = isFullscreen ? 0.7 : 0.6;
  const opacityText = isFullscreen ? 0.95 : 0.8;
  
  const fontSize = isFullscreen ? 16 : 14;
  const letterSpacing = isFullscreen ? 3.5 : 3;
  const stopOpacity = isFullscreen ? 1 : 0.9;

  return (
    <svg viewBox="0 0 200 200" className={className}>
      <defs>
        <filter id={filterId}>
          <feDropShadow 
            dx={isFullscreen ? 3 : 2} 
            dy={isFullscreen ? 3 : 2} 
            stdDeviation={isFullscreen ? 4 : 3} 
            floodOpacity={isFullscreen ? 0.4 : 0.3}
          />
        </filter>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity }} />
          <stop offset="100%" style={{ stopColor: '#1e40af', stopOpacity }} />
        </linearGradient>
        <path id={pathId} d="M 30, 100 A 70, 70 0 0,1 170, 100 A 70, 70 0 0,1 30, 100" fill="none"/>
      </defs>
      
      <circle cx="100" cy="100" r="95" fill="none" stroke={`url(#${gradientId})`} strokeWidth={strokeWidthOuter} opacity={opacityOuter} filter={`url(#${filterId})`}/>
      <circle cx="100" cy="100" r="85" fill="none" stroke="#3b82f6" strokeWidth={strokeWidthInner1} opacity={opacityInner1} />
      <circle cx="100" cy="100" r="60" fill="#3b82f6" opacity={opacityInner2}/>
      <circle cx="100" cy="100" r="58" fill="none" stroke="#3b82f6" strokeWidth={strokeWidthInner2} opacity={opacityInner3}/>
      
      <path d="M 75 105 L 90 120 L 120 85" stroke="#3b82f6" strokeWidth={strokeWidthCheck} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={opacityCheck}/>
      
      <path d="M 100 20 Q 110 25 100 30 Q 90 35 100 40" fill="none" stroke="#3b82f6" strokeWidth={strokeWidthWaves} opacity={opacityWaves}/>
      <path d="M 100 160 Q 110 165 100 170 Q 90 175 100 180" fill="none" stroke="#3b82f6" strokeWidth={strokeWidthWaves} opacity={opacityWaves}/>
      <path d="M 20 100 Q 25 90 30 100 Q 35 110 40 100" fill="none" stroke="#3b82f6" strokeWidth={strokeWidthWaves} opacity={opacityWaves}/>
      <path d="M 160 100 Q 165 90 170 100 Q 175 110 180 100" fill="none" stroke="#3b82f6" strokeWidth={strokeWidthWaves} opacity={opacityWaves}/>
      
      <text fontSize={fontSize} fontWeight="bold" fill="#3b82f6" opacity={opacityText} letterSpacing={letterSpacing}>
        <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle" dominantBaseline="middle">
          ✓ ЭЦП ПОДТВЕРЖДЕНА ✓
        </textPath>
      </text>
    </svg>
  );
};

export const CloseIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const ExpandIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
);

export const RenameIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

export const DocumentShieldIcon = ({ isSigned, className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {isSigned ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    )}
  </svg>
);

export const NoFileIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export const SignIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);