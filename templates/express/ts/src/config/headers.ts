// Import types
import type { NextFunction, Request, Response } from "express";

// Import necessary modules
import { logger } from "@logger";

// Middleware function to set HTTP headers for CORS
async function setHeaders(req: Request, res: Response, next: NextFunction) {
    let allowedOrigin: string[] = [];

    // Check the environment of the application
    switch (process.env.NODE_ENV) {
        case "development":
            // In development, proceed to the next middleware
            next();
            break;
        case "production":
            {
                // In production, only allow requests from your application
                allowedOrigin = [""];

                // Get the origin of the request
                const origin = req.headers.origin;

                // If the origin is not allowed, send a 403 response
                if (allowedOrigin.indexOf(origin as string) === -1) {
                    res.status(403).send("Origin not allowed");
                } else {
                    // Set CORS headers
                    res.setHeader("Access-Control-Allow-Credentials", "true");
                    res.setHeader(
                        "Access-Control-Allow-Origin",
                        origin as string,
                    );
                    res.setHeader(
                        "Access-Control-Allow-Methods",
                        "GET,OPTIONS,PATCH,DELETE,POST,PUT",
                    );
                    res.setHeader(
                        "Access-Control-Allow-Headers",
                        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
                    );

                    // If the request method is OPTIONS, send a 200 response
                    if (req.method === "OPTIONS") {
                        res.status(200).end();
                        return;
                    }

                    // Proceed to the next middleware
                    next();
                }
            }
            break;
        default:
            // Log an error if the NODE_ENV value is invalid
            logger.error("Invalid NODE_ENV value");
            break;
    }
}

export default setHeaders;
