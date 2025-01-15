const BASE_URL = 'https://swift8393.pythonanywhere.com';
export { BASE_URL };
// User endpoints
/**
 * Get all users or a specific user by ID.
 */
export const GET_USERS_URL = `${BASE_URL}/users/`;

/**
 * Update a specific user by ID.
 */
export const UPDATE_USER_URL = (id: number) => `${BASE_URL}/users/${id}/`;

/**
 * Register a new user.
 */
export const SIGN_UP_URL = `${BASE_URL}/register/`;

/**
 * Refresh the JWT token.
 */
export const REFRESH_TOKEN_URL = `${BASE_URL}/token/refresh/`;

/**
 * Login a user.
 */
export const LOGIN_URL = `${BASE_URL}/login/`;
/**
 * Logout a user.
 */
export const LOGOUT_URL = `${BASE_URL}/auth/logout/`;
// Service endpoints
/**
 * Get all services or a specific service by ID.
 */
export const GET_SERVICES_URL = `${BASE_URL}/services/`;

/**
 * Create a new service.
 */
export const CREATE_SERVICE_URL = `${BASE_URL}/services/`;

/**
 * Update a specific service by ID.
 */
export const UPDATE_SERVICE_URL = (id: number) => `${BASE_URL}/services/${id}/`;

/**
 * Delete a specific service by ID.
 */
export const DELETE_SERVICE_URL = (id: number) => `${BASE_URL}/services/${id}/`;

// Service Type endpoints
/**
 * Get all service types or a specific service type by ID.
 */
export const GET_SERVICE_TYPES_URL = `${BASE_URL}/service-types/`;

/**
 * Create a new service type.
 */
export const CREATE_SERVICE_TYPE_URL = `${BASE_URL}/service-types/`;

/**
 * Update a specific service type by ID.
 */
export const UPDATE_SERVICE_TYPE_URL = (id: number) => `${BASE_URL}/service-types/${id}/`;

/**
 * Delete a specific service type by ID.
 */
export const DELETE_SERVICE_TYPE_URL = (id: number) => `${BASE_URL}/service-types/${id}/`;

// Payment endpoints
/**
 * Get all payments or a specific payment by ID.
 */
export const GET_PAYMENTS_URL = `${BASE_URL}/payments/`;

/**
 * Create a new payment.
 */
export const CREATE_PAYMENT_URL = `${BASE_URL}/payments/`;

/**
 * Update a specific payment by ID.
 */
export const UPDATE_PAYMENT_URL = (id: number) => `${BASE_URL}/payments/${id}/`;

/**
 * Delete a specific payment by ID.
 */
export const DELETE_PAYMENT_URL = (id: number) => `${BASE_URL}/payments/${id}/`;

/**
 * Create an Mpesa payment intent.
 */
export const CREATE_MPESA_PAYMENT_INTENT_URL = `${BASE_URL}/mpesa/create/`;

/**
 * Handle Mpesa payment callback.
 */
export const MPESA_CALLBACK_URL = `${BASE_URL}/callback/`;

/**
 * Refund a payment.
 */
export const REFUND_PAYMENT_URL = `${BASE_URL}/refund/`;

// Notification endpoints
/**
 * Get all notifications or a specific notification by ID.
 */
export const GET_NOTIFICATIONS_URL = `${BASE_URL}/notifications/`;

/**
 * Create a new notification.
 */
export const CREATE_NOTIFICATION_URL = `${BASE_URL}/notifications/`;

/**
 * Update a specific notification by ID.
 */
export const UPDATE_NOTIFICATION_URL = (id: number) => `${BASE_URL}/notifications/${id}/`;

/**
 * Delete a specific notification by ID.
 */
export const DELETE_NOTIFICATION_URL = (id: number) => `${BASE_URL}/notifications/${id}/`;

// Article Endpoints

/**
 * Get all articles or a specific article by ID.
 */
export const GET_ARTICLES_URL = `${BASE_URL}/articles/`;

/**
 * Create a new article.
 */
export const CREATE_ARTICLE_URL = `${BASE_URL}/articles/`;

/**
 * Update a specific article by ID.
 */
export const UPDATE_ARTICLE_URL = (id: number) => `${BASE_URL}/articles/${id}/`;

/**
 * Delete a specific article by ID.
 */
export const DELETE_ARTICLE_URL = (id: number) => `${BASE_URL}/articles/${id}/`;

/**
 * Get articles filtered by article type.
 * Use query parameter `?type=<typeid>`.
 */
export const GET_ARTICLES_BY_TYPE_URL = `${BASE_URL}/articles/type/`;

/**
 * Get all published articles.
 */
export const GET_PUBLISHED_ARTICLES_URL = `${BASE_URL}/articles/published/`;

// Article Type Endpoints

/**
 * Get all article types or a specific article type by ID.
 */
export const GET_ARTICLE_TYPES_URL = `${BASE_URL}/article-types/`;

/**
 * Create a new article type.
 */
export const CREATE_ARTICLE_TYPE_URL = `${BASE_URL}/article-types/`;

/**
 * Update a specific article type by ID.
 */
export const UPDATE_ARTICLE_TYPE_URL = (id: number) => `${BASE_URL}/article-types/${id}/`;

/**
 * Delete a specific article type by ID.
 */
export const DELETE_ARTICLE_TYPE_URL = (id: number) => `${BASE_URL}/article-types/${id}/`;
// Feedback endpoints
/**
 * Get all feedback or a specific feedback by ID.
 */
export const GET_FEEDBACK_URL = `${BASE_URL}/feedbacks/`;

/**
 * Create a new feedback.
 */
export const CREATE_FEEDBACK_URL = `${BASE_URL}/feedbacks/`;

/**
 * Update a specific feedback by ID.
 */
export const UPDATE_FEEDBACK_URL = (id: number) => `${BASE_URL}/feedbacks/${id}/`;

/**
 * Delete a specific feedback by ID.
 */
export const DELETE_FEEDBACK_URL = (id: number) => `${BASE_URL}/feedbacks/${id}/`;

// Log endpoints
/**
 * Get all logs or a specific log by ID.
 */
export const GET_LOGS_URL = `${BASE_URL}/logs/`;

/**
 * Create a new log.
 */
export const CREATE_LOG_URL = `${BASE_URL}/logs/`;

/**
 * Update a specific log by ID.
 */
export const UPDATE_LOG_URL = (id: number) => `${BASE_URL}/logs/${id}/`;

/**
 * Delete a specific log by ID.
 */
export const DELETE_LOG_URL = (id: number) => `${BASE_URL}/logs/${id}/`;