import React, { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Badge,
    Spinner,
    Image,
    Stack
} from 'react-bootstrap';
import api from '../api';

const Feed = () => {
    const [prompts, setPrompts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const res = await api.get('/prompts');
                setPrompts(res.data);
            } catch (error) {
                console.error("Failed to fetch prompts", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrompts();
    }, []);

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <h2 className="mb-4">Global Prompts</h2>
            {prompts.length === 0 ? (
                <p>No prompts found. Be the first to create one!</p>
            ) : (
                <Row className="g-4">
                    {prompts.map((prompt) => (
                        <Col key={prompt.id} md={6} lg={4}>
                            <Card className="h-100 shadow-sm transition-all">
                                <Card.Header className="bg-white border-bottom-0 pt-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <Image
                                            src={prompt.user?.avatarUrl}
                                            roundedCircle
                                            width={40}
                                            height={40}
                                            alt={prompt.user?.name || 'User'}
                                            className="bg-secondary"
                                        />
                                        <div>
                                            <h6 className="mb-0">{prompt.title}</h6>
                                            <small className="text-muted">
                                                by {prompt.user?.name || 'Anonymous'}
                                            </small>
                                        </div>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <Stack gap={3}>
                                        <div>
                                            <h6 className="text-uppercase text-muted small mb-2">Description</h6>
                                            <Card.Text className="small" style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                {prompt.description}
                                            </Card.Text>
                                        </div>
                                        <div>
                                            <div className="d-flex gap-2 flex-wrap">
                                                {prompt.tags && prompt.tags.split(',').map((tag, index) => (
                                                    <Badge key={index} bg="success" pill>
                                                        {tag.trim()}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </Stack>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default Feed;
