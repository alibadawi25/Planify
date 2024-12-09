import React from 'react';
import { Modal, Form, Input, DatePicker, message, Descriptions } from 'antd';
import dayjs from 'dayjs';

const TaskCreationModal = ({ isModalOpen, onClose, onTaskCreate }) => {
    const [form] = Form.useForm();

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
                    name="startDate"
                    label="Start Date & Time"
                    rules={[{ required: true, message: 'Please select a start date!' }]}
                >
                    <DatePicker showTime format="YYYY-MM-DD HH:mm" />
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
                                return Promise.reject(
                                    new Error('End date must be after the start date!')
                                );
                            },
                        }),
                    ]}
                >
                    <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TaskCreationModal;
