import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { HttpStatus, ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { ClsService } from "nestjs-cls";
import * as fs from "fs-extra";
import * as express from "express";
import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";
import * as dotenv from "dotenv";
import helmet from "helmet";
import * as multer from "multer";
import * as i18n from "i18n";
import * as path from "path";

import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { ErrorInterceptor } from "./common/interceptors/error.interceptor";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { ErrorHandlingService } from "./errors/error-handling.service";
import { ErrorsService } from "./errors/errors.service";
import { LogsService } from "./logs/logs.service";
import { AppModule } from "./app.module";
import open from "open";
import * as compression from "compression";

const configService = new ConfigService();
const key = configService.get<string>("SWAGGER_X_KEY");

function swaggerApiKeyChecker(req: Request, res: Response, next: NextFunction) {
  if (req.path === "/api/v1/doc") {
    if (req.query.apiKey === key) {
      return next();
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).render("401");
    }
  } else {
    return next();
  }
}

function contentChecker(req: Request, res: Response, next: NextFunction) {
  if (req.path.includes("/api/v1/content")) {
    express.json({ limit: "10mb" })(req, res, (err) => {
      if (err) {
        return res.status(400).send("JSON parse error");
      }
      return next();
    });
  } else return next();
}

const customStorage: multer.StorageEngine = {
  _handleFile(req: Request, file: Express.Multer.File, callback) {
    const uploadDir = path.join(process.cwd(), "uploads");
    const randomId = randomUUID();
    const containerFileName = randomId;
    const containerFilePath = path.join(uploadDir, containerFileName);

    file.originalname = containerFileName;
    fs.mkdirSync(uploadDir, { recursive: true });

    const chunks: Buffer[] = [];
    file.stream.on("data", (chunk) => chunks.push(chunk));
    file.stream.on("end", () => {
      const fileBuffer = Buffer.concat(chunks);
      const fileObj = {
        id: randomId,
        name: file.originalname,
        size: fileBuffer.length,
        mimetype: file.mimetype,
        created_at: new Date().toISOString(),
      };
      file.size = fileBuffer.length;
      const metadataBase64 = Buffer.from(JSON.stringify(fileObj)).toString(
        "base64",
      );
      console.log("Metadata:", metadataBase64);
      const writeStream = fs.createWriteStream(containerFilePath);
      writeStream.write(fileBuffer);
      writeStream.end(() => {
        callback(null, { path: containerFilePath });
      });
    });
    file.stream.on("error", (err) => callback(err));
  },
  _removeFile(req, file, callback) {
    fs.unlink(file.path, callback);
  },
};

async function bootstrap() {
  try {
    dotenv.config();
    process.env.TZ = "Asia/Riyadh";

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ["error", "warn", "debug", "verbose", "log"],
    });

    app.set("trust proxy", 1);
    app.use(swaggerApiKeyChecker);
    const logsService = app.get(LogsService);
    const clsService = app.get(ClsService);
    app.useGlobalInterceptors(
      new ErrorInterceptor(app.get(ErrorsService), configService),
      new LoggingInterceptor(logsService, clsService, configService),
      new TransformInterceptor(),
    );
    app.use(contentChecker);
    app.setViewEngine("hbs");
    app.setBaseViewsDir("views");
    app.use(helmet({ xssFilter: true }));

    app.enableCors({
      origin: "*",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: [
        "Accept",
        "Accept-Language",
        "Connection",
        "Content-Type",
        "Origin",
        "Referer",
        "Sec-Fetch-Dest",
        "Sec-Fetch-Mode",
        "Sec-Fetch-Site",
        "User-Agent",
        "Sec-CH-UA",
        "Sec-CH-UA-Mobile",
        "Sec-CH-UA-Platform",
        "language",
        "platform",
        "app-version",
        "Authorization",
        "X-Fingerprint",
        "X-RAY-ID",
      ],
      exposedHeaders: ["x-ray-id", "x-fingerprint", "Referrer-Policy"],
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const errorHandlingService = app.get(ErrorHandlingService);
    app.setGlobalPrefix("api");
    app.enableVersioning({ type: VersioningType.URI }); // /v1/...
    app.useGlobalFilters(new HttpExceptionFilter(errorHandlingService));

    app.use(
      compression({
        filter: (req, res) => {
          if (req.headers["x-no-compression"]) return false;
          if (req.originalUrl?.startsWith("/api/v1/download")) return false;
          return compression.filter(req as any, res as any);
        },
      }),
    );

    const upload = multer({
      storage: customStorage,
      limits: { fileSize: 1024 * 1024 * 40 },
    });
    app.use(upload.single("file"));
    app.use(i18n.init);

    const config = new DocumentBuilder()
      .setTitle("Backend API")
      .setDescription("This is the backend API swagger documentation")
      .setVersion("1.0")
      .addTag("Backend")
      .addBearerAuth(
        {
          type: "http",
          scheme: "Bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token",
          name: "Authorization",
          in: "header",
        } as SecuritySchemeObject,
        "Bearer",
      )
      .build();

    const customOptions = { customCss: readCssFileContent() };
    const document = SwaggerModule.createDocument(app, config);
    document.paths["/api/v1"] = undefined;

    SwaggerModule.setup("api/v1/doc", app, document, {
      ...customOptions,
      swaggerOptions: { baseURL: "/" },
    });

    await app.listen(configService.get<number>("PORT") || 3000, "127.0.0.1");
    const appUrl = await app.getUrl();
    console.log(
      `🚀 Application is running at: ${appUrl}/api/v1/doc?apiKey=${key}`,
    );
    open(`${appUrl}/api/v1/doc?apiKey=${key}`);
  } catch (error) {
    console.error("Error starting the application:", error);
  }
}

const readCssFileContent = (): string => {
  const filePath = path.join(__dirname, "../public/swagger-custom-dark.css");
  return fs.readFileSync(filePath, "utf8");
};

bootstrap();
