from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS tasks 
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  title TEXT, 
                  category TEXT, 
                  estimated_hours REAL, 
                  actual_hours REAL, 
                  completed INTEGER)''')
    conn.commit()
    conn.close()

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT * FROM tasks")
    rows = c.fetchall()
    conn.close()
    tasks = [{"id": r[0], "title": r[1], "category": r[2], "estimated_hours": r[3], "actual_hours": r[4], "completed": bool(r[5])} for r in rows]
    return jsonify(tasks)

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.json
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("INSERT INTO tasks (title, category, estimated_hours, actual_hours, completed) VALUES (?, ?, ?, ?, 0)",
              (data['title'], data['category'], data['estimated_hours'], 0))
    conn.commit()
    conn.close()
    return jsonify({"message": "Task created successfully"}), 201

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)