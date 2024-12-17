import React, { useEffect, useState } from "react";
import AsistenciaSocial from "@/components/AsistenciaSocial/AsistenciaSocial";
import CanastaSalario from "@/components/CanastaSalario/CanastaSalario";
import Inflacion from "@/components/Inflacion/Inflacion";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/sheets");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return <div className="full-containter center-flex-col">Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log(data.meses);

  return (
    <div className="full-container">
      {data.meses && (
        <>
          <Inflacion data={data.inflacion} months={data.meses} />
          <CanastaSalario data={data} />
          <AsistenciaSocial data={data} />
        </>
      )}
    </div>
  );
}
