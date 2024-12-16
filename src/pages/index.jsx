import AsistenciaSocial from "@/components/AsistenciaSocial/AsistenciaSocial";
import CanastaSalario from "@/components/CanastaSalario/CanastaSalario";
import Inflacion from "@/components/Inflacion/Inflacion";

export default function Home() {
  return (
    <div className="full-container">
<Inflacion />
<CanastaSalario />
<AsistenciaSocial />
    </div>
  );
}
