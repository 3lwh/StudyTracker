# Study & Task Tracker with Analytics

A full-stack web application designed to help students and developers organize tasks, track study duration, and visualize time allocation across categories in real time.

---

## Tech Stack

* **Frontend:** React, Chart.js, Axios, HTML5/CSS3
* **Backend:** Python, Flask, Flask-CORS
* **Database:** SQLite3

---

## Key Features

* **Task & Time Allocation:** Input study sessions and tasks with estimated completion times.
* **Interactive Charting:** Dynamic visual feedback rendered through Chart.js to identify high-workload areas.
* **Persistent Storage:** SQLite integration ensuring tasks persist across sessions.
* **RESTful Architecture:** Clean separation between the React interface and Flask API handlers.

---

## API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/tasks` | `GET` | Fetches all recorded study tasks from SQLite |
| `/api/tasks` | `POST` | Creates a new task entry (Requires `title`, `category`, `estimated_hours`) |

---

## Project Structure

```text
Study Tracker Project/
├── backend/
│   ├── app.py          # Flask application server & SQLite endpoints
│   └── database.db     # Local SQLite database file
├── frontend/
│   ├── src/
│   │   ├── App.js      # Main UI component & state management
│   │   └── index.js    # Entry point
│   └── package.json
├── .gitignore
└── README.md
Getting Started
Prerequisites
Node.js (v14+)

Python (v3.8+)

1. Backend Setup
Bash
# Navigate to backend directory
cd backend

# Set up and activate virtual environment
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install flask flask-cors

# Run backend server
python app.py
The Flask server runs on http://localhost:5000.

2. Frontend Setup
Bash
# Open a new terminal tab and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start React app
npm start
The React application will open automatically on http://localhost:3000.

Roadmap & Future Enhancements
[ ] Add task completion toggles (completed status tracking).

[ ] Integrate category filtering (e.g., Algorithms, Web Dev, Math).

[ ] Implement an Estimated vs. Actual time comparison bar chart.

[ ] Upgrade database models to Flask-SQLAlchemy.

License
Distributed under the MIT License.


---

### Update GitHub

Save the file (`Ctrl + S`), then run:

```bash
git add README.md
git commit -m "docs: expand README with API reference and roadmap"
git push origin main