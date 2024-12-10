import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, message } from 'antd';
import dayjs from 'dayjs';

const TaskCreationModal = ({ isModalOpen, onClose, onTaskCreate }) => {
    const [form] = Form.useForm();
    const [startDate, setStartDate] = useState(null); // Track the start date for validation

    useEffect(() => {
        const handleTouchMove = (e) => {
            const timePanel = document.querySelector('.ant-picker-time-panel');
            if (timePanel && timePanel.contains(e.target)) {
                e.preventDefault(); // Prevent scrolling inside the time picker panel
            }
        };

        // Add event listener for touchmove
        document.addEventListener('touchmove', handleTouchMove, { passive: false });

        // Cleanup event listener when component is unmounted
        return () => {
            document.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    const handleFinish = (values) => {
        const taskDetails = {
            taskName: values.taskName,
            description: values.description,
            startDate: values.startDate.format('YYYY-MM-DD HH:mm'),
            endDate: values.endDate.format('YYYY-MM-DD HH:mm'),
            completed: false,
        };
        onTaskCreate(taskDetails);
        message.success('Task added successfully!');
        form.resetFields();
        setStartDate(null); // Reset start date after submission
        onClose();
    };

    const handleStartDateChange = (date) => {
        setStartDate(date); // Update the state for dynamic validation
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
                    name="startDate"
                    label="Start Date & Time"
                    rules={[{ required: true, message: 'Please select a start date!' }]}
                >
                    <DatePicker
                        popupClassName='datePopUp'
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        inputReadOnly
                        onChange={handleStartDateChange}
                    />
                </Form.Item>
                <Form.Item
                    name="endDate"
                    label="End Date & Time"
                    rules={[
                        { required: true, message: 'Please select an end date!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const startDate = getFieldValue('startDate');
                                if (!value || value.isAfter(startDate)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('End date must be after the start date!'));
                            },
                        }),
                    ]}
                >
                    <DatePicker
                        popupClassName='datePopUp'
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        inputReadOnly
                        disabledDate={(current) =>
                            startDate && current && current.isBefore(startDate, 'minute')
                        }
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TaskCreationModal;
