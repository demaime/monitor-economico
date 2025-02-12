const CustomTooltip = ({ active, payload, selectedRegion }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 shadow-xl">
        <p className="text-gray-200 text-sm font-medium">
          {payload[0].payload.name}
        </p>
        <p
          className={`font-bold ${
            selectedRegion === "nacional"
              ? "text-orange-custom"
              : "text-yellow-custom"
          }`}
        >
          {`${payload[0].value}%`}
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
