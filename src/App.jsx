import { useState, useRef, useEffect } from 'react' 
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.css';
import functionPlot from "function-plot"
import './App.css'

function App() {
  const [aCoefficient, setACoefficient] = useState(1);
  const [bCoefficient, setBCoefficient] = useState(0);
  const [numOfProblems, setNumOfProblems] = useState(1);
  const problems = [
    "Określ monotoniczność funkcji f(x)=", 
    "Punkt A() znajduje się na wykresie funkcji f(x) = Amx Bm. Oblicz m i podaj wzór funkcji f",
    "Podaj miejsca zerowe (jeżeli istnieją) funkcji f(x)="
  ] //DO NOT REARRANGE - currently the generation is dependent on index of item in array!
  const [problemListItems, setProblemListItems] = useState([]) 
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
    if (bCoefficient < 0) { //to assure we don't have '+ -' when b coefficient is negative. this approach is very repetitive - remember to simplify it later
      return (
      <div className="alert alert-info mt-3">
        <p><b>Wzór:</b> y = {aCoefficient}x {bCoefficient}</p>
        <p><b>Miejsce zerowe:</b> {root}</p>
        <p><b>Punkt przecięcia z OY:</b> (0, {bCoefficient})</p>
        <p><b>Monotoniczność:</b> {monotonity}</p>
      </div>
    );
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
    rootRef.current.innerHTML = ""; 

    try {
      functionPlot({
        target: rootRef.current, 
        width: 600,
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
        data: [
          {
            fn: `${aCoefficient} * x + ${bCoefficient}`, 
            color: 'red',
          }
        ]
      });
    } catch (e) {
      console.error("Błąd rysowania:", e);
    }
  }, [aCoefficient, bCoefficient]); 

  function generateProblems(e) {
    e.preventDefault();
    setProblemListItems(problems.filter(problem=>problems.indexOf(problem) < numOfProblems));
    setProblemListItems(problems.map(problem=>
      {
          switch (problems.indexOf(problem)) {
            case 0:
            case 2:
              if (bCoefficient < 0) {
                problem += aCoefficient + "x" + bCoefficient;
              }
              else{
                problem += aCoefficient + "x +" + bCoefficient;
              }
              break;
            case 1:
              
              //Generate a number m and 2 coefficients A and B, where A*m is the user-defined function's a coefficient, and B*m is the user-defined function's b coefficient
              let m = Math.floor(Math.random() * 10) +1; //m will only be integers between 0 and 9 for simplicity
              
              let xOfPoint = (Math.random()*9).toFixed(0); //the x coordinate of the A point that will feature in the exercise.
              let yOfPoint = aCoefficient*xOfPoint + bCoefficient;
              console.log(aCoefficient+"/"+m);
              problem = problem.replace("Am", aCoefficient+"/"+m+"m");
              if (bCoefficient > 0) {
                problem = problem.replace("Bm", "+"+ bCoefficient+"/"+m+"m");
              }
              else{
                problem = problem.replace("Bm", bCoefficient+"/"+m+"m");
              }
              problem = problem.replace("A()", "A("+xOfPoint+", "+yOfPoint+")")
            break;
            default:
              break;
          }
          
          return <li>{problem}</li>
      }
      
    ))
    
  }
  return (
    <div className="container mt-5">
      <h1 className="mb-4">Analizator Funkcji Liniowej</h1>
      
      <div className="row">
        <div className="col-md-4">
          <div className="card p-3">
            <h5>Parametry</h5>
            <label className="form-label">Współczynnik a: {aCoefficient}</label>
            <input 
              type="range" className="form-range" 
              min="-10" max="10" step="0.5"
              value={aCoefficient} 
              onChange={(e) => setACoefficient(parseFloat(e.target.value))} 
            />
            
            <label className="form-label mt-2">Współczynnik b: {bCoefficient}</label>
            <input 
              type="range" className="form-range" 
              min="-10" max="10" step="0.5"
              value={bCoefficient} 
              onChange={(e) => setBCoefficient(parseFloat(e.target.value))} 
            />
            
            <PropertiesInfoBox />
          </div>
        </div>

        <div className="col-md-8 text-center">
          <div 
            ref={rootRef} 
            style={{ border: '1px solid #ccc', borderRadius: '8px', background: 'white' }}
          ></div>
        </div>
        <h2>Generator zadań</h2>
        <button onClick={generateProblems} className='btn btn-success'>
        GENERUJ
        </button>
        <ol>
          {problemListItems}
        </ol>
        
        
      </div>
    </div>
  )
}

export default App;