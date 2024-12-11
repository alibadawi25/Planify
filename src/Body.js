import React, { useState, useEffect, useMemo } from 'react';
import { Button, Dropdown, Menu, message } from 'antd';
import {
    DownOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    PlayCircleOutlined,
} from '@ant-design/icons';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import TaskCreationModal from './TaskCreationModal';
import EditTaskModal from './editTaskModal';
import './Body.css';
import dayjs from 'dayjs';
const Body = ({ currentView }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });
    const [taskToEdit, setTaskToEdit] = useState(null); // Task being edited
    const [currentTime, setCurrentTime] = useState(dayjs());
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const openEditModal = (task) => {
        setTaskToEdit(task);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => setIsEditModalOpen(false);
    const handleTaskCreate = (taskDetails) => {
        const newTask = { ...taskDetails, id: Date.now() };
        setTasks((prevTasks) => [...prevTasks, newTask]);
    };
    const handleDeleteTask = (taskId) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        message.success('Task deleted');
    };
    const handleStartTask = (taskId) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId
                    ? { ...task, startDate: currentTime.format('YYYY-MM-DD HH:mm')}
                    : task
            )
        );
        message.success('Task started');
    };
    const handleMarkAsCompleted = (taskId) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId ? { ...task, completed: true } : task
            )
        );
        message.success('Task marked as completed');
    };
    const handleUpdateTask = (updatedTask) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === updatedTask.id ? { ...task, ...updatedTask } : task
            )
        );
        message.success('Task updated');
        setIsEditModalOpen(false); // Close the edit modal
    };
    const renderFullCalendarEvents = useMemo(() => {
        return tasks
            .filter((task) => !task.completed && dayjs(task.endDate).isAfter(currentTime)) // Filter out completed tasks
            .map((task) => {
                const start = dayjs(task.startDate);
                const end = dayjs(task.endDate);
                const events = [];
    
                // Case 1: Task starts and ends on the same day (Not an all-day event)
                if (start.isSame(end, 'day')) {
                    events.push({
                        id: task.id,
                        title: task.taskName,
                        start: start.toISOString(),
                        end: end.toISOString(),
                        allDay: false,  // Mark as not all-day for tasks that start and end on the same day
                        color: task.completed ? '#b82e2e' : '#00b96b',
                    });
                } else {
                    // Case 2: Task spans multiple days
    
                    // Start Day (Partial Day)
                    events.push({
                        id: task.id,
                        title: task.taskName,
                        start: start.toISOString(),
                        end: start.endOf('day').toISOString(),
                        allDay: false,  // Ensure it's a partial day event for the start day
                        color: task.completed ? '#b82e2e' : '#00b96b',
                        description: 'Start Day',
                    });
    
                    // Intermediate Full Days (All day)
                    let currentDate = start.add(1, 'day'); // Ensure the next day starts from 00:00:00
                    while (currentDate.isBefore(end, 'day')) {
                        events.push({
                            id: task.id,
                            title: task.taskName,
                            start: currentDate.startOf('day').toISOString(),
                            end: currentDate.endOf('day').toISOString(),
                            allDay: true,  // Full day for intermediate days
                            color: task.completed ? '#b82e2e' : '#00b96b',
                            description: 'Intermediate Day',
                        });
                        currentDate = currentDate.add(1, 'day');
                    }
    
                    // End Day (Partial Day)
                    events.push({
                        id: task.id,
                        title: task.taskName,
                        start: end.startOf('day').toISOString(),  // Start of end day
                        end: end.toISOString(),                   // Use the exact end time
                        allDay: false,  // Mark it as a partial day event for the end day
                        color: task.completed ? '#b82e2e' : '#00b96b',
                        description: 'End Day',
                    });
                }
    
                // Convert all events into a single list
                return events;
            }).flat(); // Flatten to make it a single list of events
    }, [tasks]); // Recompute the events only when tasks change
    
    const renderTimeDetails = (startDate, endDate) => {
        const start = dayjs(startDate, 'YYYY-MM-DD HH:mm');
        const end = dayjs(endDate, 'YYYY-MM-DD HH:mm');
        if (currentTime.isBefore(start)) {
            const diffSeconds = start.diff(currentTime, 'second');
            const days = Math.floor(diffSeconds / 86400);
            const hours = Math.floor((diffSeconds % 86400) / 3600);
            const minutes = Math.floor((diffSeconds % 3600) / 60);
            const seconds = diffSeconds % 60;
            return days > 0 ? (
                <p>Starts in: {days}d {hours}h</p>
            ) : (
                <p>
                    Starts in: {hours > 0 && `${hours}h`} {minutes > 0 && `${minutes}m`} {seconds > 0 && `${seconds}s`}
                </p>
            );
        } else if (currentTime.isAfter(start) && currentTime.isBefore(end)) {
            const diffSeconds = end.diff(currentTime, 'second');
            const days = Math.floor(diffSeconds / 86400);
            const hours = Math.floor((diffSeconds % 86400) / 3600);
            const minutes = Math.floor((diffSeconds % 3600) / 60);
            const seconds = diffSeconds % 60;
            return days > 0 ? (
                <p>Time left: {days}d {hours}h</p>
            ) : (
                <p>
                    Time left: {hours > 0 && `${hours}h`} {minutes > 0 && `${minutes}m`} {seconds > 0 && `${seconds}s`}
                </p>
            );
        } else if (currentTime.isAfter(end)) {
            return <p>Task Ended</p>;
        } else {
            return <p>Started at: {start.format('YYYY-MM-DD HH:mm')}</p>;
        }
    };
    const renderTaskMenu = (taskId) => (
        <Menu>
            <Menu.Item onClick={() => openEditModal(tasks.find((task) => task.id === taskId))} icon={<EditOutlined />}>
                Edit
            </Menu.Item>
            <Menu.Item onClick={() => handleDeleteTask(taskId)} icon={<DeleteOutlined />}>
                Delete
            </Menu.Item>
            <Menu.Item onClick={() => handleStartTask(taskId)} icon={<PlayCircleOutlined />}>
                Start Task
            </Menu.Item>
            {!tasks.find((task) => task.id === taskId).completed && (
                <Menu.Item onClick={() => handleMarkAsCompleted(taskId)} icon={<CheckCircleOutlined />}>
                    Mark as Completed
                </Menu.Item>
            )}
        </Menu>
    );
    const menu = (
        <Menu>
            {tasks.map((task) => (
                <Menu.Item key={task.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>{task.taskName}</strong>
                        <Dropdown overlay={renderTaskMenu(task.id)} trigger={['hover', 'click']}>
                            <Button icon={<DownOutlined />} size="small" />
                        </Dropdown>
                    </div>
                    {task.completed ? (
                        <span style={{ color: 'green', fontStyle: 'italic' }}>Completed</span>
                    ) : (
                        renderTimeDetails(task.startDate, task.endDate)
                    )}
                </Menu.Item>
            ))}
        </Menu>
    );
    if (currentView === 'tasks') {
        return (
            <div className="body-content">
                <Button type="primary" onClick={openModal}>
                    Add a Task
                </Button>
                <TaskCreationModal isModalOpen={isModalOpen} onClose={closeModal} onTaskCreate={handleTaskCreate} />
                <Dropdown overlay={menu} trigger={['click', 'hover']}>
                    <Button type="text" style={{ fontSize: '1.5em', display: 'flex', alignItems: 'center' }}>
                        View Tasks <DownOutlined style={{ marginLeft: '8px', fontSize: '0.8em' }} />
                    </Button>
                </Dropdown>
                <EditTaskModal
                    isModalOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    task={taskToEdit}
                    onTaskEdit={handleUpdateTask}
                />
            </div>
        );
    } else if (currentView === 'calendar') {
        return (
            <div className="body-content">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek" // Or `dayGridMonth` for month view
                    events={renderFullCalendarEvents} // Use memoized events
                    editable={false}
                    selectable={false}
                    allDayMaintainDuration={true} // Ensure all-day events are correctly maintained
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                />
            </div>
        );
    } else {
        return <div className="body-content"> {/* Render other views here */}</div>;
    }
};
export default Body;