import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './message.entity';
import { MailService } from '../notifications/mail.service';
export declare class MessagesService {
    private readonly messagesRepository;
    private readonly mailService;
    constructor(messagesRepository: Repository<Message>, mailService: MailService);
    create(createMessageDto: CreateMessageDto): Promise<Message>;
    findAll(): Promise<Message[]>;
    countUnread(): Promise<number>;
    markAllRead(): Promise<void>;
}
