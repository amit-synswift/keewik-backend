const jwt = require("jsonwebtoken");
const config = require("./config/config");
const {validateToken} = require("./services/ConfigurationService");

module.exports.isAuthorizedUser = async (req, res, next) => {
    const token = req.headers['keewik-access-token'];
    if (!token) {
        return res
            .status(403)
            .send({ success: 0, error: "Unauthorized Request" });
    }
    try {
        var decoded = jwt.verify(token, config.secret);
        res.locals.session = decoded;
        let checkSession = await validateToken(token,decoded.guid);
        if(checkSession) {
            if(new Date() < new Date(checkSession[0].validTill)) {
                next();
            } else {
                return res
                    .status(401)
                    .send({ success: 0, error: "Token expired" });
            }
        } else {
            return res
                .status(403)
                .send({ success: 0, error: "Unauthorized Request" });
        }
    } catch (e) {
        return res.status(500).send({ error: "Invalid Credentials" });
    }
};
