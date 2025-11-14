import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let messages: string[] = [];
        let errorType: string = 'InternalServerError';

        if (exception instanceof HttpException) {
            const errorResponse = exception.getResponse();
            errorType = exception.constructor.name.replace('Exception', '');

            if (typeof errorResponse === 'object' && errorResponse['message']) {
                if (Array.isArray(errorResponse['message'])) {
                    messages = errorResponse['message'];
                } else {
                    messages = [errorResponse['message']];
                }
            } else {
                messages = [exception.message];
            }
        } else {
            messages = ['Server Error - Ikd what it is'];
            console.error('Error not controlled: ', exception);
        }

        const errorPayload = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: errorType,
            messages
        };

        response.status(status).json(errorPayload);
    }
}