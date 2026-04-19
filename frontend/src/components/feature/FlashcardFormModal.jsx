import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const { TextArea } = Input;

/**
 * Modal form for creating or editing a flashcard.
 */
const FlashcardFormModal = ({ open, onClose, onSubmit, initialValues = null, loading = false }) => {
  const [form] = Form.useForm();
  const isEditing = !!initialValues;

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          frontText: initialValues.frontText,
          backText: initialValues.backText,
          pronunciation: initialValues.pronunciation,
          example: initialValues.example,
          partOfSpeech: initialValues.partOfSpeech,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues, form]);

  return (
    <Modal
      title={isEditing ? 'Edit Flashcard' : 'Add Flashcard'}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={520}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="frontText"
          label="Front (Word / Term)"
          rules={[
            { required: true, message: 'Front text is required' },
            { max: 255, message: 'Must not exceed 255 characters' },
          ]}
        >
          <Input placeholder="e.g. Apple" size="large" showCount maxLength={255} />
        </Form.Item>

        <Form.Item
          name="backText"
          label="Back (Definition / Translation)"
          rules={[{ required: true, message: 'Back text is required' }]}
        >
          <TextArea placeholder="e.g. Quả táo" rows={3} />
        </Form.Item>

        <Form.Item name="pronunciation" label="Pronunciation / IPA (optional)">
          <Input placeholder="e.g. /ˈæp.əl/" />
        </Form.Item>

        <Form.Item name="partOfSpeech" label="Part of Speech (optional)">
          <Input placeholder="e.g. Noun, Verb, Adjective..." />
        </Form.Item>

        <Form.Item name="example" label="Example Sentence (optional)">
          <TextArea placeholder="e.g. She ate an apple for breakfast." rows={2} />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditing ? 'Save Changes' : 'Add Card'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FlashcardFormModal;
