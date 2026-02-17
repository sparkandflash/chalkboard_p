import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from "sonner"
import { RegistryForm } from "@/components/registries/RegistryForm";

const CreateRegistry = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setIsLoading(true);
        try {
            await api.post('/registries', values);
            toast.success('Registry Created Successfully!');
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h2 className="text-3xl font-bold tracking-tight mb-8 text-foreground">Create New Registry</h2>
            <RegistryForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
    );
};

export default CreateRegistry;
