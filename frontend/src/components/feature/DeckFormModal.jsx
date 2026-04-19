import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch, Button } from 'antd';

const { TextArea } = Input;

/**
 * Modal form for creating or editing a deck.
 * @param {object} props
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @param {Function} props.onSubmit  - called with form values
 * @param {object|null} props.initialValues - deck to edit (null = create mode)
 * @param {boolean} props.loading
 */
const DeckFormModal = ({ open, onClose, onSubmit, initialValues = null, loading = false }) => {
  const [form] = Form.useForm();
  const isEditing = !!initialValues;

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          title: initialValues.title,
          description: initialValues.description,
          isPublic: initialValues.isPublic,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Modal
      title={isEditing ? 'Edit Deck' : 'Create New Deck'}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={480}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ isPublic: false }}
      >
        <Form.Item
          name="title"
          label="Deck Title"
          rules={[
            { required: true, message: 'Please enter a title for your deck' },
            { max: 255, message: 'Title must not exceed 255 characters' },
          ]}
        >
          <Input
            placeholder="e.g. TOEIC 600 Words"
            size="large"
            showCount
            maxLength={255}
          />
        </Form.Item>

        <Form.Item name="description" label="Description (optional)">
          <TextArea
            placeholder="Brief description of this deck..."
            rows={3}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item name="isPublic" label="Visibility" valuePropName="checked">
          <Switch
            checkedChildren="Public"
            unCheckedChildren="Private"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditing ? 'Save Changes' : 'Create Deck'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DeckFormModal;
