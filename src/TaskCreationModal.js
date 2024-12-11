import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, TimePicker, Switch, message } from 'antd';

const TaskCreationModal = ({ isModalOpen, onClose, onTaskCreate }) => {
    const [form] = Form.useForm();
    const [startDate, setStartDate] = useState(null); // Track the start date for validation
    const [useDate, setUseDate] = useState(false); // Toggle for date selection

    const handleFinish = (values) => {
        const startDateTime = useDate
            ? `${values.date.format('YYYY-MM-DD')} ${values.time.format('hh:mm A')}`
            : values.time.format('hh:mm A');

        const endDateTime = useDate
            ? `${values.endDate.format('YYYY-MM-DD')} ${values.endTime.format('hh:mm A')}`
            : values.endTime.format('hh:mm A');

        const taskDetails = {
            taskName: values.taskName,
            description: values.description,
            startDate: startDateTime,
            endDate: endDateTime,
            completed: false,
        };

        onTaskCreate(taskDetails);
        message.success('Task added successfully!');
        form.resetFields();
        setStartDate(null); // Reset start date after submission
        setUseDate(false); // Reset the date toggle
        onClose();
    };

    const handleStartDateChange = (time) => {
        setStartDate(time); // Update state for validation
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

                <Form.Item label="Include Date?">
                    <Switch
                        checked={useDate}
                        onChange={(checked) => setUseDate(checked)}
                        checkedChildren="Yes"
                        unCheckedChildren="No"
                    />
                </Form.Item>

                {useDate && (
                    <Form.Item
                        name="date"
                        label="Date"
                        rules={[{ required: useDate, message: 'Please select a date!' }]}
                    >
                        <DatePicker format="YYYY-MM-DD" inputReadOnly />
                    </Form.Item>
                )}

                <Form.Item
                    name="time"
                    label="Start Time"
                    rules={[{ required: true, message: 'Please select a start time!' }]}
                >
                    <TimePicker
                        format="hh:mm A"
                        use12Hours
                        inputReadOnly
                        onChange={handleStartDateChange}
                    />
                </Form.Item>

                <Form.Item
                    name="endTime"
                    label="End Time"
                    rules={[
                        { required: true, message: 'Please select an end time!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const startTime = getFieldValue('time');
                                if (!value || value.isAfter(startTime)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error('End time must be after the start time!')
                                );
                            },
                        }),
                    ]}
                >
                    <TimePicker
                        format="hh:mm A"
                        use12Hours
                        inputReadOnly
                        disabledHours={() =>
                            startDate ? Array.from({ length: 24 }, (_, i) => i).filter((h) => h < startDate.hour()) : []
                        }
                        disabledMinutes={(selectedHour) =>
                            startDate && selectedHour === startDate.hour()
                                ? Array.from({ length: 60 }, (_, i) => i).filter((m) => m <= startDate.minute())
                                : []
                        }
                    />
                </Form.Item>

                {useDate && (
                    <Form.Item
                        name="endDate"
                        label="End Date"
                        rules={[
                            { required: useDate, message: 'Please select an end date!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const startDate = getFieldValue('date');
                                    if (!value || value.isSameOrAfter(startDate)) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error('End date must be the same or after the start date!')
                                    );
                                },
                            }),
                        ]}
                    >
                        <DatePicker format="YYYY-MM-DD" inputReadOnly />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default TaskCreationModal;
