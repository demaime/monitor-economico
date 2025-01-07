import "./style.css"; // Asegúrate de que el archivo CSS esté correctamente importado

export default () => {
  return (
    <div className="content">
      {[...Array(2)].map((_, i) => (
        <div className="bars" key={i}>
          {[...Array(7)].map((_, b) => (
            <div className="bar" key={b}></div>
          ))}
        </div>
      ))}
    </div>
  );
};
