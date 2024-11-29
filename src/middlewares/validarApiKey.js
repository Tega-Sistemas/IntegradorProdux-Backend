export const validarApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).json({ message: 'API Key inválida ou ausente' });
    }

    next();
};