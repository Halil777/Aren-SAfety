import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    create(createMessageDto: CreateMessageDto): Promise<import("./message.entity").Message>;
    findAll(): Promise<import("./message.entity").Message[]>;
    getUnreadCount(): Promise<{
        count: number;
    }>;
    markAllRead(): Promise<{
        success: boolean;
    }>;
}
