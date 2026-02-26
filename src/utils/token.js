import jwt from 'jsonwebtoken';
export const generateToken = (data) => {
    return jwt.sign({ id: data.id, role_id: data.role_id }, data.secret, {
        expiresIn: data.exp,
    });
};
