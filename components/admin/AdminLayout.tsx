import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ImageHistoryView } from './ImageHistoryView';
import { ApiManagementView } from './ApiManagementView';
// REVERT: Re-added ApiKey import.
import type { ImageRecord, ApiKey } from '../../types';

type AdminPage = 'dashboard' | 'api-management';

// REVERT: Re-added props for API key management.
interface AdminLayoutProps {
    imageRecords: ImageRecord[];
    apiKeys: ApiKey[];
    onAddApiKey: (key: string) => void;
    onRemoveApiKey: (id: string) => void;
    onSetActiveApiKey: (id: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ 
    imageRecords,
    apiKeys,
    onAddApiKey,
    onRemoveApiKey,
    onSetActiveApiKey
}) => {
    const [adminPage, setAdminPage] = useState<AdminPage>('dashboard');

    return (
        <div className="flex min-h-[calc(100vh-68px)]">
            <Sidebar currentPage={adminPage} setPage={setAdminPage} />
            <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
                {adminPage === 'dashboard' && <ImageHistoryView imageRecords={imageRecords} />}
                {/* REVERT: Pass props to ApiManagementView. */}
                {adminPage === 'api-management' && (
                    <ApiManagementView 
                        apiKeys={apiKeys}
                        onAddApiKey={onAddApiKey}
                        onRemoveApiKey={onRemoveApiKey}
                        onSetActiveApiKey={onSetActiveApiKey}
                    />
                )}
            </main>
        </div>
    );
};