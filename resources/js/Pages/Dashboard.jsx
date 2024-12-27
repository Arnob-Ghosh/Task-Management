import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useState, useEffect } from 'react';
import { Table, Popconfirm, notification, Select } from 'antd'; // Import Ant Design Table, Popconfirm, notification, and Select
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'; // Import Ant Design icons
import Layout from "@/Layouts/layout/layout.jsx";

const Dashboard = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [taskDetails, setTaskDetails] = useState({
        id: null,
        name: '',
        description: '',
        dueDate: '',
        status: 'Pending',
    });
    const [errors, setErrors] = useState({});
    const [tasks, setTasks] = useState([]);
    const [statusFilter, setStatusFilter] = useState(null); // State for status filter

    const fetchTasks = async () => {
        try {
            const response = await fetch(`/tasks?status=${statusFilter}`);
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const data = await response.json();
            setTasks(data.tasks);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTaskDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const showNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
            placement: 'topRight', // Position of the notification
            duration: 2, // Duration in seconds
        });
    };

     const handleSaveTask = async () => {
        try {
            const method = isEditMode ? 'PUT' : 'POST';
            const url = isEditMode ? `/create-tasks/${taskDetails.id}` : '/create-tasks'; 
    
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify(taskDetails),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                setErrors(errorData.errors); // Update the errors state
                showNotification('error', 'Validation Error', errorData.errors[Object.keys(errorData.errors)[0]][0]);
                return;
            }
    
            const result = await response.json();
            const successMessage = isEditMode ? 'Task updated successfully!' : 'Task created successfully!';
            showNotification('success', 'Success', successMessage);
            setIsModalVisible(false);
            setTaskDetails({ id: null, name: '', description: '', dueDate: '', status: 'Pending' });
            setErrors({}); // Clear errors
            fetchTasks();
        } catch (error) {
            showNotification('error', 'Error', error.message);
        }
    };

    const handleEditTask = (task) => {
        setTaskDetails(task);
        setIsEditMode(true);
        setIsModalVisible(true);
    };

    const handleDeleteTask = async (id) => {
        try {
            const response = await fetch(`/delete-tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            showNotification('success', 'Success', 'Task deleted successfully!');
            fetchTasks();
        } catch (error) {
            showNotification('error', 'Error', error.message);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setErrors({});
        setIsEditMode(false);
    };

    const handleStatusFilterChange = (value) => {
        setStatusFilter(value);
    };

    const filteredTasks = tasks.filter(task => {
        return statusFilter ? task.status === statusFilter : true;
    });

    const columns = [
        {
            title: 'Task Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
            sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button 
                        onClick={() => handleEditTask(record)} 
                        type="link" 
                        className="edit-button action-buttons bg-transparent" 
                        icon={<EditOutlined />} 
                    />
                    <Popconfirm
                        title="Are you sure to delete this task?"
                        onConfirm={() => handleDeleteTask(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button 
                            type="link" 
                            danger 
                            className="delete-button bg-transparent" 
                            icon={<DeleteOutlined />} 
                        />
                    </Popconfirm>
                </span>
            ),
        },
    ];

    return (
        
        <Layout>
            <div className="grid">
                <div className="col-12 text-right mb-3">
                    <Button
                        label="Add Task"
                        icon="pi pi-plus"
                        className="p-button-primary"
                        onClick={() => {
                            setIsModalVisible(true);
                            setIsEditMode(false);
                        }}
                    />
                </div>

                <div className="filters mb-3">
                    <Select
                        placeholder="Filter by Status"
                        onChange={handleStatusFilterChange}
                        style={{ width: 200, marginRight: 16 }}
                    >
                        <Select.Option value={null}>All</Select.Option>
                        <Select.Option value="Pending">Pending</Select.Option>
                        <Select.Option value="In Progress">In Progress</Select.Option>
                        <Select.Option value="Completed">Completed</Select.Option>
                    </Select>
                </div>

                <Table
                    dataSource={filteredTasks}
                    columns={columns}
                    rowKey="id"
                    style={{ width: '100%' }}
 />

                <Dialog
                    header={isEditMode ? "Edit Task" : "Add New Task"}
                    visible={isModalVisible}
                    style={{ width: '500px' }}
                    onHide={handleCancel}
                >
                    <div className="p-fluid">
                        <div className="field">
                            <label htmlFor="taskName">Task Name</label>
                            <input
                                type="text"
                                id="taskName"
                                name="name"
                                className={`p-inputtext p-component ${errors.name ? 'p-invalid' : ''}`}
                                value={taskDetails.name}
                                onChange={handleInputChange}
                                placeholder="Enter task name"
                            />
                            {errors.name && <small className="p-error">{errors.name[0]}</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="taskDescription">Task Description</label>
                            <textarea
                                id="taskDescription"
                                name="description"
                                className={`p-inputtext p-component ${errors.description ? 'p-invalid' : ''}`}
                                value={taskDetails.description}
                                onChange={handleInputChange}
                                placeholder="Enter task description"
                                rows={3}
                            />
                            {errors.description && <small className="p-error">{errors.description[0]}</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="dueDate">Due Date</label>
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                className={`p-inputtext p-component ${errors.dueDate ? 'p-invalid' : ''}`}
                                value={taskDetails.dueDate}
                                onChange={handleInputChange}
                            />
                            {errors.dueDate && <small className="p-error">{errors.dueDate[0]}</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                className={`p-inputtext p-component ${errors.status ? 'p-invalid' : ''}`}
                                value={taskDetails.status}
                                onChange={handleInputChange}
                            >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                            {errors.status && <small className="p-error">{errors.status[0]}</small>}
                        </div>

                        <div className="field text-right mt-4">
                            <Button
                                label="Save"
                                icon="pi pi-check"
                                className="p-button-success mr-2"
                                onClick={handleSaveTask}
                            />
                        </div>
                    </div>
                </Dialog>
            </div>
        </Layout>
    );
};

export default Dashboard; 
