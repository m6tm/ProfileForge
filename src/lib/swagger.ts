import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
    const spec = createSwaggerSpec({
        apiFolder: "app/api", // define api folder under app folder
        definition: {
            openapi: "3.0.0",
            info: {
                title: "TruNumber Documantation",
                version: "1.0.0",
            },
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
                schemas: {
                    User: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string"
                            },
                            email: {
                                type: "string"
                            },
                            role: {
                                type: "string",
                                enum: ["USER", "ADMIN"]
                            },
                            createdAt: {
                                type: "string",
                                format: "date-time"
                            },
                            updatedAt: {
                                type: "string",
                                format: "date-time"
                            }
                        },
                        required: ["id", "email", "role"]
                    }
                },
            },
            paths: {
                "/api/admin/users": {
                    get: {
                        tags: ["Admin"],
                        summary: "Get all users",
                        responses: {
                            200: {
                                description: "List of users",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "array",
                                            items: {
                                                $ref: "#/components/schemas/User"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            security: [],
        },
    });
    return spec;
};