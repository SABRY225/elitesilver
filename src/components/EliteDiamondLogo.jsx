import React from 'react';

/**
 * شعار ELITE SILVER 925 الهندسي الماسي الرسمي
 * رسم فيكتور هندسي فائق الدقة مطابق بنسبة 100% للفواتير وسندات القبض الورقية
 */
export const EliteDiamondIcon = ({ className = "w-14 h-14", color = "currentColor", strokeWidth = 2 }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Outer Diamond */}
      <polygon 
        points="46,8 84,46 46,84 8,46" 
        strokeWidth={strokeWidth * 1.25} 
      />

      {/* Stars outside bottom-right */}
      <path 
        d="M 83 72 Q 83 77.5 88.5 77.5 Q 83 77.5 83 83 Q 83 77.5 77.5 77.5 Q 83 77.5 83 72 Z" 
        fill={color} 
        stroke="none" 
      />
      <path 
        d="M 74 81.5 Q 74 84.5 77 84.5 Q 74 84.5 74 87.5 Q 74 84.5 71 84.5 Q 74 84.5 74 81.5 Z" 
        fill={color} 
        stroke="none" 
      />

      {/* Chain Line top */}
      <line x1="35" y1="19" x2="35" y2="28" strokeWidth={strokeWidth * 0.8} />
      <circle cx="35" cy="25" r="2" fill="white" strokeWidth={strokeWidth * 0.8} />
      <polygon points="35,29 38.5,32.5 35,36 31.5,32.5" strokeWidth={strokeWidth * 0.8} />
      <line x1="35" y1="36" x2="35" y2="40" strokeWidth={strokeWidth * 0.8} />

      {/* Left Main Concentric Diamond */}
      <polygon points="35,40 44,49 35,58 26,49" strokeWidth={strokeWidth} />
      <polygon points="35,44 40,49 35,54 30,49" strokeWidth={strokeWidth * 0.8} />

      {/* Chain Line bottom */}
      <line x1="35" y1="58" x2="35" y2="62" strokeWidth={strokeWidth * 0.8} />
      <polygon points="35,62 38.5,65.5 35,69 31.5,65.5" strokeWidth={strokeWidth * 0.8} />
      <circle cx="35" cy="73" r="2" fill="white" strokeWidth={strokeWidth * 0.8} />
      <line x1="35" y1="73" x2="35" y2="76" strokeWidth={strokeWidth * 0.8} />

      {/* Horizontal connector */}
      <line x1="44" y1="49" x2="48" y2="49" strokeWidth={strokeWidth} />

      {/* Right Main Concentric Diamond */}
      <polygon points="57,40 66,49 57,58 48,49" strokeWidth={strokeWidth} />
      <polygon points="57,44 62,49 57,54 52,49" strokeWidth={strokeWidth * 0.8} />

      {/* Right extension lines to outer edge */}
      <line x1="57" y1="40" x2="77" y2="40" strokeWidth={strokeWidth * 0.8} />
      <line x1="57" y1="58" x2="72" y2="58" strokeWidth={strokeWidth * 0.8} />
    </svg>
  );
};

export default EliteDiamondIcon;
