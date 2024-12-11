import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TextField } from '@mui/material';

const TaskCreationModal = ({ isModalOpen, onClose, onTaskCreate }) => {
    const [form] = Form.useForm();
    const [startDate, setStartDate] = React.useState(dayjs());
    const [endDate, setEndDate] = React.useState(dayjs());

    const handleFinish = (values) => {
        const taskDetails = {
            taskName: values.taskName,
            description: values.description,
            startDate: startDate.format('YYYY-MM-DD HH:mm'),
            endDate: endDate.format('YYYY-MM-DD HH:mm'),
            completed: false,
        };
        onTaskCreate(taskDetails);
        message.success('Task added successfully!');
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title="Add Task"
            open={isModalOpen}
            onCancel={onClose}
            onOk={() => form.submit()}
            okText="Create Task"
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    name="taskName"
                    label="Task Name"
                    rules={[{ required: true, message: 'Please enter a task name!' }]}
                >
                    <Input placeholder="Enter task name" />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: false }]} // Optional field
                >
                    <Input.TextArea placeholder="Enter task description" rows={4} />
                </Form.Item>

                <Form.Item
                    rules={[{ required: true, message: 'Please select a start date!' }]}
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Start Date & Time"
                            value={startDate}
                            onChange={(newValue) => {
                                setStartDate(newValue);
                                if (endDate.isBefore(newValue)) {
                                    setEndDate(newValue); // Adjust endDate if it becomes invalid
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    sx={{
                                        backgroundColor: '#f5f5f5',
                                        borderColor: '#00b96b', // Green border color
                                        color: '#333',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#00b96b', // Green border
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#00b96b', // Green border on hover
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#00b96b', // Green border when focused
                                            },
                                        },
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Form.Item>

                <Form.Item
                    rules={[{ required: true, message: 'Please select an end date!' }]}
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="End Date & Time"
                            value={endDate}
                            onChange={setEndDate}
                            minDateTime={startDate} // Disable dates and times before the selected start date & time
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    sx={{
                                        backgroundColor: '#f5f5f5',
                                        borderColor: '#00b96b', // Green border color
                                        color: '#333',
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#00b96b', // Green border
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#00b96b', // Green border on hover
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#00b96b', // Green border when focused
                                            },
                                        },
                                    }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TaskCreationModal;
