import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import { toast } from "sonner"
import { PromptForm } from "@/components/prompts/PromptForm";

const CreatePrompt = () => {
    const [registries, setRegistries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preSelectedRegistryId = searchParams.get('registryId');

    useEffect(() => {
        const fetchRegistries = async () => {
            try {
                const res = await api.get('/registries');
                setRegistries(res.data || []);
            } catch (error) {
                console.error("Failed to fetch registries", error);
                toast.error("Failed to load registries");
            }
        };
        fetchRegistries();
    }, []);

    const handleSubmit = async (values) => {
        setIsLoading(true);

        if (!values.registryId) {
            toast.error("Please select a registry!");
            setIsLoading(false);
            return;
        }

        try {
            await api.post('/prompts', values);

            toast.success('Prompt Added Successfully!');
            navigate(`/registry/${values.registryId}`);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-10">
            <h2 className="text-3xl font-bold tracking-tight mb-8 text-foreground">Add New Prompt</h2>
            <PromptForm
                registries={registries}
                initialValues={{ registryId: preSelectedRegistryId }}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </div>
    );
};

export default CreatePrompt;
