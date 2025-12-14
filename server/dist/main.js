"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const express_1 = require("express");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.use((0, express_1.json)({ limit: '15mb' }));
    app.use((0, express_1.urlencoded)({ limit: '15mb', extended: true }));
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const port = configService.get('PORT') || 4000;
    await app.listen(port, '0.0.0.0');
    console.log(`Server is running on http://0.0.0.0:${port}`);
    console.log(`Database: ${configService.get('DB_DATABASE')}`);
}
bootstrap();
//# sourceMappingURL=main.js.map