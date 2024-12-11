import React, { useState, useEffect } from 'react';
import { Modal, Input, DatePicker, Button, message } from 'antd';
import dayjs from 'dayjs';

const dateTimeFormat = 'YYYY-MM-DD HH:mm';

const EditTaskModal = ({ isModalOpen, onClose, task, onTaskEdit }) => {
    const [taskName, setTaskName] = useState('');
    const [startDateTime, setStartDateTime] = useState(null);
    const [endDateTime, setEndDateTime] = useState(null);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if (task) {
            setTaskName(task.taskName || '');
            setStartDateTime(task.startDate ? dayjs(task.startDate, dateTimeFormat) : null);
            setEndDateTime(task.endDate ? dayjs(task.endDate, dateTimeFormat) : null);
            setCompleted(task.completed || false);
        }
    }, [task]);

    const handleSave = () => {
        if (!taskName || !startDateTime || !endDateTime) {
            message.error('Please fill in all fields.');
            return;
        }

        if (endDateTime.isBefore(startDateTime)) {
            message.error('End date must be after start date.');
            return;
        }

        const updatedTask = {
            ...task,
            taskName,
            startDate: startDateTime.format(dateTimeFormat),
            endDate: endDateTime.format(dateTimeFormat),
            completed,
        };

        onTaskEdit(updatedTask);
        message.success('Task updated successfully!');
        onClose();
    };

    return (
        <Modal
            title="Edit Task"
            visible={isModalOpen}
            onCancel={onClose}
            footer={null}
            width={400}
        >
            <div>
                <div style={{ marginBottom: 16 }}>
                    <Input
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        placeholder="Task Name"
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <DatePicker
                        showTime={{ format: 'HH:mm' }}
                        format={dateTimeFormat}
                        value={startDateTime}
                        onChange={(date) => setStartDateTime(date)}
                        placeholder="Start Date and Time"
                        style={{ width: '100%' }}
                        inputReadOnly
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <DatePicker
                        showTime={{ format: 'HH:mm' }}
                        format={dateTimeFormat}
                        value={endDateTime}
                        onChange={(date) => setEndDateTime(date)}
                        placeholder="End Date and Time"
                        style={{ width: '100%' }}
                        inputReadOnly
                    />
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={completed}
                            onChange={() => setCompleted(!completed)}
                        />
                        Mark as Completed
                    </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="default" onClick={onClose} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button type="primary" onClick={handleSave}>
                        Save
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default EditTaskModal;
