"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
let MailService = MailService_1 = class MailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(MailService_1.name);
        const user = this.configService.get('SMTP_USER');
        const pass = this.configService.get('SMTP_PASS');
        const host = this.configService.get('SMTP_HOST', 'smtp.gmail.com');
        const port = this.configService.get('SMTP_PORT', 587);
        this.from =
            this.configService.get('SMTP_FROM') || user || 'no-reply@example.com';
        this.adminTo =
            this.configService.get('SUPPORT_TO') ||
                this.configService.get('SMTP_TO') ||
                user ||
                'microsoft7779@gmail.com';
        this.transporter = nodemailer_1.default.createTransport({
            host,
            port,
            secure: port === 465,
            auth: user && pass ? { user, pass } : undefined,
        });
    }
    async sendSupportNotification(message) {
        if (!this.adminTo) {
            this.logger.warn('No admin recipient configured for support notifications');
            return;
        }
        const mailOptions = {
            from: this.from,
            to: this.adminTo,
            subject: `[Tenant Support] ${message.subject}`,
            text: [
                `Tenant ID: ${message.tenantId ?? 'Unknown'}`,
                `Tenant Email: ${message.tenantEmail ?? 'Unknown'}`,
                '',
                message.body,
            ].join('\n'),
        };
        await this.sendMail(mailOptions);
    }
    async sendTenantStatusChange(tenant, status) {
        if (!tenant.email)
            return;
        const isActive = status === 'active';
        const subject = isActive
            ? 'Your tenant account is active'
            : `Your tenant status is now ${status}`;
        const body = isActive
            ? `Hello ${tenant.fullname},

Good news — your tenant account is now active. You can sign in and continue using the Aren Safety platform. If you need any assistance, please contact support.

Thank you,
Aren Safety Company`
            : `Hello ${tenant.fullname},

Your tenant account status has been set to "${status}" by the super admin because your free trial period has ended. If you would like to continue using the platform, please reply to this email or contact support so we can reactivate your access.

Thank you,
Aren Safety Company`;
        const mailOptions = {
            from: this.from,
            to: tenant.email,
            subject,
            text: body,
        };
        await this.sendMail(mailOptions);
    }
    async sendMobileAccountCredentials(payload) {
        const { to, fullName, login, password, role } = payload;
        if (!to) {
            this.logger.warn('No recipient provided for mobile account credentials email');
            return;
        }
        const name = fullName || 'коллега';
        const roleRu = role === 'SUPERVISOR' ? 'Супервайзер' : 'Пользователь';
        const roleEn = role === 'SUPERVISOR' ? 'Supervisor' : 'User';
        const roleTr = role === 'SUPERVISOR' ? 'Süpervizör' : 'Kullanıcı';
        const subject = 'Доступ / Access to Aren Safety mobile';
        const ru = [
            `Здравствуйте, ${name}!`,
            '',
            'Для вас создана учетная запись в мобильном приложении Aren Safety.',
            '',
            `Роль: ${roleRu}`,
            `Логин: ${login}`,
            `Пароль: ${password}`,
            '',
            'Пожалуйста, сохраните эти данные для входа в систему.',
            '',
            'Желаем успешной работы!',
            '',
            'С уважением,',
            'Команда Aren Safety',
        ].join('\n');
        const en = [
            `Hello ${name},`,
            '',
            'Your account has been successfully created in the Aren Safety mobile application.',
            '',
            `Role: ${roleEn}`,
            `Login: ${login}`,
            `Password: ${password}`,
            '',
            'Please keep these credentials for logging in.',
            '',
            'Wishing you productive work!',
            '',
            'Best regards,',
            'Aren Safety Team',
        ].join('\n');
        const tr = [
            `Merhaba ${name},`,
            '',
            'Aren Safety mobil uygulaması için kullanıcı hesabınız oluşturulmuştur.',
            '',
            `Rolünüz: ${roleTr}`,
            `Kullanıcı adı: ${login}`,
            `Şifre: ${password}`,
            '',
            'Lütfen giriş bilgilerinizi saklayınız.',
            '',
            'İyi çalışmalar dileriz.',
            '',
            'Saygılarımızla,',
            'Aren Safety Ekibi',
        ].join('\n');
        await this.sendMail({
            from: this.from,
            to,
            subject,
            text: [ru, '', en, '', tr].join('\n'),
        });
    }
    async sendMail(options) {
        try {
            await this.transporter.sendMail(options);
        }
        catch (error) {
            this.logger.error('Failed to send email', error);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map