import React from "react";
import { theme } from "antd";

export default function Ruler({
  steps = [],

}) {

  const {
    token: { colorText, colorBgBase, },
  } = theme.useToken();




  const isLightBackground = colorBgBase === "#fff";

  // Generate gradient colors based on the background color's luminance
  const gradientColor1 = isLightBackground ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)";
  const gradientColor2 = isLightBackground ? "rgba(73, 73, 73, 0.5)" : "rgba(255, 255, 255, 0.5)";
  const gradientColor3 = isLightBackground ? "rgba(73, 73, 73, 0.4)" : "rgba(255, 255, 255, 0.4)";

  const backgroundStyle = {
    backgroundColor: colorBgBase,
    backgroundImage: `
    linear-gradient(90deg, ${gradientColor1} 0px, ${gradientColor1} 2%, transparent 2%),
    linear-gradient(${colorBgBase} 50%, transparent 50%),
    linear-gradient(90deg, transparent 50%, ${gradientColor2} 50%, ${gradientColor2} 52%, transparent 52%),
    linear-gradient(${colorBgBase} 70%, transparent 70%),
    linear-gradient(90deg, transparent 10%, ${gradientColor3} 10%, ${gradientColor3} 12%, transparent 12%, transparent 20%, ${gradientColor3} 20%, ${gradientColor3} 22%, transparent 22%, transparent 30%, ${gradientColor3} 30%, ${gradientColor3} 32%, transparent 32%, transparent 40%, ${gradientColor3} 40%, ${gradientColor3} 42%, transparent 42%, transparent 60%, ${gradientColor3} 60%, ${gradientColor3} 62%, transparent 62%, transparent 70%, ${gradientColor3} 70%, ${gradientColor3} 72%, transparent 72%, transparent 80%, ${gradientColor3} 80%, ${gradientColor3} 82%, transparent 82%, transparent 90%, ${gradientColor3} 90%, ${gradientColor3} 92%, transparent 92%)
  `,
  };
  return (
    <div className="ruler" style={backgroundStyle}>

      {steps.map((step, idx) => (
        <label key={step} className="ruler-x" style={{ color: colorText }}>
          {step}
        </label>
      ))}

    </div>
  );
}

