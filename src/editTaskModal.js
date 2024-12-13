import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TextField } from '@mui/material';

const dateTimeFormat = 'YYYY-MM-DD HH:mm';

const EditTaskModal = ({ isModalOpen, onClose, task, onTaskEdit }) => {
    const [taskName, setTaskName] = useState('');
    const [startDateTime, setStartDateTime] = useState(dayjs());
    const [endDateTime, setEndDateTime] = useState(dayjs());
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if (task) {
            setTaskName(task.taskName || '');
            setStartDateTime(task.startDate ? dayjs(task.startDate, dateTimeFormat) : dayjs());
            setEndDateTime(task.endDate ? dayjs(task.endDate, dateTimeFormat) : dayjs());
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
            open={isModalOpen}
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Start Date and Time"
                            value={startDateTime}
                            onChange={(newValue) => {
                                setStartDateTime(newValue);
                                if (endDateTime.isBefore(newValue)) {
                                    setEndDateTime(newValue); // Ensure end date is not before start date
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    sx={{
                                        width: '100%',
                                        backgroundColor: '#f5f5f5',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#00b96b' },
                                            '&:hover fieldset': { borderColor: '#00b96b' },
                                            '&.Mui-focused fieldset': { borderColor: '#00b96b' },
                                        },
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="End Date and Time"
                            value={endDateTime}
                            onChange={setEndDateTime}
                            minDateTime={startDateTime} // Prevent selecting a date before the start date
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    sx={{
                                        width: '100%',
                                        backgroundColor: '#f5f5f5',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#00b96b' },
                                            '&:hover fieldset': { borderColor: '#00b96b' },
                                            '&.Mui-focused fieldset': { borderColor: '#00b96b' },
                                        },
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>
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
