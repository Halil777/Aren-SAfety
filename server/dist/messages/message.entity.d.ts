export declare class Message {
    id: string;
    tenantId: string | null;
    tenantEmail: string | null;
    tenantName: string | null;
    subject: string;
    body: string;
    status: 'new' | 'read';
    createdAt: Date;
    updatedAt: Date;
}
