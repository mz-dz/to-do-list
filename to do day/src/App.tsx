import { useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import './App.css';

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [newTask, setNewTask] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const addTask = () => {
    if (newTask.trim() === '') return;
    const newTasks = [...tasks, { id: Date.now(), text: newTask, completed: false }];
    setTasks(newTasks);
    setNewTask('');
  };

  const deleteTask = (id: number) => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
  };

  const editTask = (task: Task) => {
    setIsEditing(true);
    setCurrentTask(task);
  };

  const updateTask = () => {
    if (currentTask) {
      const updatedTasks = tasks.map(task =>
        task.id === currentTask.id ? { ...task, text: currentTask.text } : task
      );
      setTasks(updatedTasks);
      setIsEditing(false);
      setCurrentTask(null);
    }
  };

  const toggleComplete = (id: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="todo-container">
      <h1>(☞ﾟヮﾟ)☞ To-Do List </h1>
      <div>
        <input
        placeholder='Write your to do 📝...'
          type="text"
          value={isEditing && currentTask ? currentTask.text : newTask}
          onChange={(e) =>
            isEditing && currentTask
              ? setCurrentTask({ ...currentTask, text: e.target.value })
              : setNewTask(e.target.value)
          }
        />
        {isEditing ? (
          <button onClick={updateTask}>Update Task 🔧</button>
        ) : (
          <button onClick={addTask}>Add Task 🔨</button>
        )}
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            {task.text}
            <div>
              <button className="editBtn" onClick={() => editTask(task)}>Edit ✏️</button>
              <button onClick={() => deleteTask(task.id)}>Delete 🗑️</button>
              <button onClick={() => toggleComplete(task.id)}>
                {task.completed ? 'Undo ↩️' : 'complete 👈'}
              </button>
              <button onClick={() => copyToClipboard(task.text)}>Copy✍</button>
            </div>
          </li>
        ))}
      </ul>
      {copiedText && <p className='p'>Text copied to clipboard: {copiedText}</p>}
    </div>
  );
}

export default App;
