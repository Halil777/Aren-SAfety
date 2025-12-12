import { ConfigService } from '@nestjs/config';
import { Message } from '../messages/message.entity';
import { Tenant } from '../tenants/tenant.entity';
export declare class MailService {
    private readonly configService;
    private readonly logger;
    private transporter;
    private readonly from;
    private readonly adminTo;
    constructor(configService: ConfigService);
    sendSupportNotification(message: Message): Promise<void>;
    sendTenantStatusChange(tenant: Tenant, status: string): Promise<void>;
    private sendMail;
}
