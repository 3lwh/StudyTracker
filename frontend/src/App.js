import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Study');
  const [estimatedHours, setEstimatedHours] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/tasks', {
      title,
      category,
      estimated_hours: parseFloat(estimatedHours)
    });
    setTitle('');
    setEstimatedHours('');
    fetchTasks();
  };

  const chartData = {
    labels: tasks.map(t => t.title),
    datasets: [
      {
        label: 'Estimated Hours',
        data: tasks.map(t => t.estimated_hours),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      }
    ],
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>📚 Study & Task Tracker</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Task Name (e.g., Practice Algorithms)" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
          style={{ flex: '2', padding: '10px' }}
        />
        <input 
          type="number" 
          placeholder="Estimated Hours" 
          value={estimatedHours} 
          onChange={e => setEstimatedHours(e.target.value)} 
          required 
          style={{ flex: '1', padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Add Task</button>
      </form>

      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        <h3>Time Allocation Overview</h3>
        {tasks.length > 0 ? <Bar data={chartData} /> : <p>No tasks added yet.</p>}
      </div>
    </div>
  );
}

export default App;