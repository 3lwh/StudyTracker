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
  const [actualHours, setActualHours] = useState('');

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
      estimated_hours: parseFloat(estimatedHours),
      actual_hours: parseFloat(actualHours || 0)
    });
    setTitle('');
    setEstimatedHours('');
    setActualHours('');
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    fetchTasks();
  };

  const chartData = {
    labels: tasks.map(t => t.title),
    datasets: [
      {
        label: 'Estimated Hours',
        data: tasks.map(t => t.estimated_hours),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Actual Hours Spent',
        data: tasks.map(t => t.actual_hours),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }
    ],
  };

  return (
    <div style={{ padding: '30px', maxWidth: '850px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>📚 Study & Task Tracker</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Task Name" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
          style={{ flex: '2', padding: '10px' }}
        />
        <input 
          type="number" 
          placeholder="Est. Hours" 
          value={estimatedHours} 
          onChange={e => setEstimatedHours(e.target.value)} 
          required 
          style={{ flex: '1', padding: '10px' }}
        />
        <input 
          type="number" 
          placeholder="Actual Hours" 
          value={actualHours} 
          onChange={e => setActualHours(e.target.value)} 
          required 
          style={{ flex: '1', padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>Add Task</button>
      </form>

      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Estimated vs. Actual Hours</h3>
        {tasks.length > 0 ? <Bar data={chartData} /> : <p>No tasks added yet.</p>}
      </div>

      <div>
        <h3>Task List</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map(t => (
            <li key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ddd' }}>
              <span><strong>{t.title}</strong> — Est: {t.estimated_hours}h | Actual: {t.actual_hours}h</span>
              <button onClick={() => handleDelete(t.id)} style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;