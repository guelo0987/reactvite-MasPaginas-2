import React, { useState, useEffect } from 'react';
import '../Estilos/EstComponentes/TaskModal.css';

export function TaskModal({ task, onSave, onClose }) {
    const [taskData, setTaskData] = useState({
        task: '',
        description: '',
        dueDate: '',
        completed: false
    });

    useEffect(() => {
        if (task) {
            setTaskData(task);
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTaskData({ ...taskData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(taskData);
        onClose();
    };

    return (
        <div className="task-modal-overlay">
            <div className="task-modal">
                <h2>{task ? "Editar Tarea" : "Agregar Tarea"}</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Tarea:
                        <input
                            type="text"
                            name="task"
                            value={taskData.task}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Fecha Límite:
                        <input
                            type="date"
                            name="dueDate"
                            value={taskData.dueDate}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Descripción:
                        <input
                            type="text"
                            name="description"
                            value={taskData.description}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <div className="modal-buttons">
                        <button type="submit">Guardar</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
