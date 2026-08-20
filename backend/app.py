from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            estimated_hours REAL NOT NULL,
            actual_hours REAL DEFAULT 0
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, title, category, estimated_hours, actual_hours FROM tasks')
    rows = cursor.fetchall()
    conn.close()
    
    tasks = [
        {
            'id': row[0],
            'title': row[1],
            'category': row[2],
            'estimated_hours': row[3],
            'actual_hours': row[4]
        }
        for row in rows
    ]
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.json
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO tasks (title, category, estimated_hours, actual_hours) VALUES (?, ?, ?, ?)',
        (data['title'], data['category'], data['estimated_hours'], data.get('actual_hours', 0))
    )
    conn.commit()
    conn.close()
    return jsonify({'message': 'Task added successfully'}), 201

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Task deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)