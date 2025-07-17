import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
    const spec = createSwaggerSpec({
        apiFolder: "app/api", // define api folder under app folder
        definition: {
            openapi: "3.0.0",
            info: {
                title: "TruNumber Documantation",
                version: "1.0.0",
                description: "API documentation for TruNumber application"
            },
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    }
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
                    },
                    Profile: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string"
                            },
                            userId: {
                                type: "string"
                            },
                            fullName: {
                                type: "string"
                            },
                            phoneNumber: {
                                type: "string"
                            },
                            bio: {
                                type: "string"
                            },
                            website: {
                                type: "string"
                            },
                            newsletter: {
                                type: "boolean"
                            },
                            marketing: {
                                type: "boolean"
                            },
                            balance: {
                                type: "number"
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
                        required: ["id", "userId", "fullName", "phoneNumber"]
                    },
                    GameHistory: {
                        type: "object",
                        properties: {
                            id: {
                                type: "string"
                            },
                            profileId: {
                                type: "string"
                            },
                            result: {
                                type: "string",
                                enum: ["win", "loss"]
                            },
                            number: {
                                type: "integer"
                            },
                            balanceChange: {
                                type: "number"
                            },
                            createdAt: {
                                type: "string",
                                format: "date-time"
                            }
                        },
                        required: ["id", "profileId", "result", "number", "balanceChange"]
                    }
                },
            },
            paths: {
                "/api/admin/users": {
                    get: {
                        tags: ["Admin"],
                        summary: "Get all users",
                        security: [{ BearerAuth: [] }],
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
                            },
                            401: {
                                description: "Unauthorized"
                            },
                            403: {
                                description: "Forbidden"
                            }
                        }
                    }
                },
                "/api/admin/users/{id}": {
                    get: {
                        tags: ["Admin"],
                        summary: "Get user by ID",
                        security: [{ BearerAuth: [] }],
                        parameters: [
                            {
                                name: "id",
                                in: "path",
                                required: true,
                                schema: {
                                    type: "string"
                                }
                            }
                        ],
                        responses: {
                            200: {
                                description: "User information",
                                content: {
                                    "application/json": {
                                        schema: {
                                            $ref: "#/components/schemas/User"
                                        }
                                    }
                                }
                            },
                            401: {
                                description: "Unauthorized"
                            },
                            403: {
                                description: "Forbidden"
                            },
                            404: {
                                description: "User not found"
                            }
                        }
                    }
                },
                "/api/profile": {
                    put: {
                        tags: ["Profile"],
                        summary: "Update user profile",
                        security: [{ BearerAuth: [] }],
                        requestBody: {
                            required: true,
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/Profile"
                                    }
                                }
                            }
                        },
                        responses: {
                            200: {
                                description: "Profile updated successfully"
                            },
                            400: {
                                description: "Invalid data"
                            },
                            401: {
                                description: "Unauthorized"
                            }
                        }
                    }
                },
                "/api/game/play": {
                    post: {
                        tags: ["Game"],
                        summary: "Play a game",
                        security: [{ BearerAuth: [] }],
                        responses: {
                            200: {
                                description: "Game result",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                result: {
                                                    type: "string",
                                                    enum: ["win", "loss"]
                                                },
                                                number: {
                                                    type: "integer"
                                                },
                                                balanceChange: {
                                                    type: "number"
                                                },
                                                newBalance: {
                                                    type: "number"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            401: {
                                description: "Unauthorized"
                            },
                            404: {
                                description: "Profile not found"
                            }
                        }
                    }
                }
            },
            security: [{ BearerAuth: [] }]
        },
    });
    return spec;
};