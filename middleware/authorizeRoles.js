const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).send({ success: false, message: 'You must be logged in' });
        }

        console.log("Required roles:", roles);
        console.log("User:", req.user);

        if (!roles.includes(req.user.role)) {
            return res.status(401).send({ success: false, message: 'Not authorized' });
        }

        next();
    };
};

module.exports = { authorizeRoles };
