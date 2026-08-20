import pytest
import json
from app import app, init_db

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        init_db()
        yield client

def test_get_tasks(client):
    response = client.get('/api/tasks')
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)

def test_add_and_delete_task(client):
    # Test creating a task
    payload = {
        'title': 'Test Task',
        'category': 'Study',
        'estimated_hours': 2.5,
        'actual_hours': 1.5
    }
    post_res = client.post('/api/tasks', data=json.dumps(payload), content_type='application/json')
    assert post_res.status_code == 201

    # Retrieve tasks to find the newly created ID
    get_res = client.get('/api/tasks')
    tasks = get_res.get_json()
    created_task = next(t for t in tasks if t['title'] == 'Test Task')
    assert created_task['estimated_hours'] == 2.5

    # Test deleting the task
    delete_res = client.delete(f"/api/tasks/{created_task['id']}")
    assert delete_res.status_code == 200