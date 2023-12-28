function adminAuth(req, res, next) {
    if (req.user && req.user.isAdmin) {
        return next();
    }
    return res.status(401).json({ message: "Not Authorized" });
}

module.exports = adminAuth;
