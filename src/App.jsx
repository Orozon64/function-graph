import { useState, useRef, useEffect } from 'react' 
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.css';
import functionPlot from "function-plot"
import './App.css'

function App() {
  const [aCoefficient, setACoefficient] = useState(1);
  const [bCoefficient, setBCoefficient] = useState(0);
  const rootRef = useRef(null);

  function PropertiesInfoBox() {
    let root, monotonity;
    if (aCoefficient === 0) {
      monotonity = "stała";
      root = bCoefficient === 0 ? "nieskończenie wiele" : "brak";
    } else {
      monotonity = aCoefficient > 0 ? "rosnąca" : "malejąca";
      root = (-bCoefficient / aCoefficient).toFixed(2);
    }

    return (
      <div className="alert alert-info mt-3">
        <p><b>Wzór:</b> y = {aCoefficient}x + {bCoefficient}</p>
        <p><b>Miejsce zerowe:</b> {root}</p>
        <p><b>Punkt przecięcia z OY:</b> (0, {bCoefficient})</p>
        <p><b>Monotoniczność:</b> {monotonity}</p>
      </div>
    );
  }

useEffect(() => {
  if (!rootRef.current) return;
  
  const containerWidth = Math.max(rootRef.current.offsetWidth, 300);
  rootRef.current.innerHTML = ""; 

  try {
    functionPlot({
      target: rootRef.current, 
      width: containerWidth,
      height: 400,
      grid: true,
        xAxis: { domain: [-10, 10] },
        yAxis: { domain: [-10, 10] },
        tip: {
          xLine: true,
          yLine: true,
          renderer: function (x, y) {
            return `x: ${x.toFixed(2)}, y: ${y.toFixed(2)}`;
          }
        },
      data: [{
        fn: `${aCoefficient} * x + ${bCoefficient}`, 
        color: 'red',
      }]
    });
  } catch (e) {
    console.error(e);
  }
}, [aCoefficient, bCoefficient]);



  return (
    <div className="container mt-5">
  <h1 className="mb-4 text-center">Analizator Funkcji Liniowej</h1>
  
  <div className="d-flex flex-wrap justify-content-center gap-4">

    <div style={{ flex: "1 1 350px", maxWidth: "450px" }}>
      <div className="card p-4 shadow-sm h-100">
        <h5 className="card-title border-bottom pb-2">Parametry</h5>
        
        <div className="mb-3">
          <label className="form-label d-flex justify-content-between">
            Współczynnik a: <b>{aCoefficient.toFixed(1)}</b>
          </label>
          <input 
            type="range" className="form-range" 
            min="-10" max="10" step="0.5"
            value={aCoefficient} 
            onChange={(e) => setACoefficient(parseFloat(e.target.value))} 
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label d-flex justify-content-between">
            Współczynnik b: <b>{bCoefficient.toFixed(1)}</b>
          </label>
          <input 
            type="range" className="form-range" 
            min="-10" max="10" step="0.5"
            value={bCoefficient} 
            onChange={(e) => setBCoefficient(parseFloat(e.target.value))} 
          />
        </div>
        
        <PropertiesInfoBox />
      </div>
    </div>


    <div style={{ 
      flex: "1 1 600px", 
      maxWidth: "800px",
      background: "white", 
      borderRadius: "12px", 
      border: "1px solid #dee2e6",
      overflow: "hidden", 
      minHeight: "400px" 
    }}>
      <div 
        ref={rootRef} 
        className="w-100 d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
      </div>
    </div>

  </div>
</div>
  )
}

export default App;