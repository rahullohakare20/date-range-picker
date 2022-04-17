import './App.css';
import DatePicker from './components/DatePicker/DatePicker';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DatePicker isRangeSelectorActive />
      </header>
    </div>
  );
}

export default App;
