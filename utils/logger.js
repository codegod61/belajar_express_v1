export function logOriginalUrl(req, res, next) {
    console.log('Request URL:', req.originalUrl);
    next();
}

export function logMethod(req, res, next) {
    console.log('Request Type:', req.method);
    next();
};