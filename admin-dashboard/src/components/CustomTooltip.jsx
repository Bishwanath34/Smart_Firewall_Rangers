// components/CustomTooltip.jsx
import React from "react";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-white shadow-lg rounded-xl p-3 border border-gray-200">
      <p className="text-sm font-semibold text-gray-700">{label}</p>

      {payload.map((item, index) => (
        <p key={index} className="text-xs text-gray-600">
          <span className="font-medium">{item.name}:</span> {item.value}
        </p>
      ))}
    </div>
  );
};

export default CustomTooltip;
