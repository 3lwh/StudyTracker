import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
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
      console.error('Error fetching tasks', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/tasks', {
      title,
      category: 'Study',
      estimated_hours: parseFloat(estimatedHours),
      actual_hours: parseFloat(actualHours || 0),
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
    labels: tasks.map((t) => t.title),
    datasets: [
      {
        label: 'Estimated Hours',
        data: tasks.map((t) => t.estimated_hours),
        backgroundColor: '#3b82f6',
        borderRadius: 6,
      },
      {
        label: 'Actual Hours Spent',
        data: tasks.map((t) => t.actual_hours),
        backgroundColor: '#10b981',
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>📚 Task & Study Tracker</h1>
          <p style={styles.subtitle}>
            Monitor your study velocity and compare target vs. actual hours
          </p>
        </header>

        {/* Input Card */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Add New Entry</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              placeholder="Task Name (e.g., Dynamic Programming)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ ...styles.input, flex: '2' }}
            />
            <input
              type="number"
              placeholder="Est. Hours"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              required
              step="0.5"
              style={{ ...styles.input, flex: '1' }}
            />
            <input
              type="number"
              placeholder="Actual Hours"
              value={actualHours}
              onChange={(e) => setActualHours(e.target.value)}
              required
              step="0.5"
              style={{ ...styles.input, flex: '1' }}
            />
            <button type="submit" style={styles.addButton}>
              Add Task
            </button>
          </form>
        </section>

        {/* Chart Card */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Time Allocation Overview</h3>
          {tasks.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <p style={styles.emptyText}>No tasks added yet. Add one above to populate analytics.</p>
          )}
        </section>

        {/* Task List Card */}
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Tracked Tasks</h3>
          {tasks.length === 0 ? (
            <p style={styles.emptyText}>Your task list is empty.</p>
          ) : (
            <ul style={styles.list}>
              {tasks.map((t) => (
                <li key={t.id} style={styles.listItem}>
                  <div>
                    <span style={styles.taskTitle}>{t.title}</span>
                    <div style={styles.badgeContainer}>
                      <span style={styles.estBadge}>Est: {t.estimated_hours}h</span>
                      <span style={styles.actBadge}>Actual: {t.actual_hours}h</span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(t.id)} style={styles.deleteButton}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: '#f1f5f9',
    minHeight: '100vh',
    padding: '40px 20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#64748b',
    margin: 0,
    fontSize: '15px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    border: '1px solid #e2e8f0',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 0,
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#f8fafc',
  },
  addButton: {
    padding: '12px 24px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: '14px',
    textAlign: 'center',
    padding: '20px 0',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #f1f5f9',
    backgroundColor: '#f8fafc',
    marginBottom: '10px',
  },
  taskTitle: {
    fontWeight: '600',
    color: '#334155',
    display: 'block',
    marginBottom: '6px',
  },
  badgeContainer: {
    display: 'flex',
    gap: '8px',
  },
  estBadge: {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    fontSize: '12px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '4px',
  },
  actBadge: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    fontSize: '12px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '4px',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '13px',
  },
};

export default App;