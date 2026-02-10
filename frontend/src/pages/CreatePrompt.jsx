import React, { useState } from 'react';
import {
    Container,
    Button,
    Form,
    Alert
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const CreatePrompt = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await api.post('/prompts', {
                title,
                content,
                description,
                tags
            });

            alert('Prompt Created Successfully!');
            navigate('/'); // Go back to feed
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'Something went wrong');
            // Allow retry
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container className="py-5" style={{ maxWidth: '720px' }}>
            <h2 className="mb-4">Create New Prompt</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <Form.Group controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Code Reviewer Agent"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formContent">
                    <Form.Label>Prompt Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={6}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="The actual prompt text..."
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What is this prompt for?"
                    />
                </Form.Group>

                <Form.Group controlId="formTags">
                    <Form.Label>Tags</Form.Label>
                    <Form.Control
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="comma, separated, tags"
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Prompt'}
                </Button>
            </Form>
        </Container>
    );
};

export default CreatePrompt;
