const CustomizedLabel = ({ x, y, value, selectedRegion }) => {
  return (
    <text
      x={x}
      y={y}
      dy={-8}
      dx={5}
      fontSize={8}
      className="font-bold"
      textAnchor="middle"
      fill={selectedRegion === "nacional" ? "#f97316" : "#f6ff00"}
    >
      {`${value}%`}
    </text>
  );
};

export default CustomizedLabel;
