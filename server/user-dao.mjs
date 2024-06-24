import db from './db.mjs';  
import { User } from './WDUMmodels.mjs';  
import crypto from 'crypto'; 


export const registerUser = (name, surname, email, password) => {
    return new Promise((resolve, reject) => {
        
        const checkEmailSql = 'SELECT * FROM users_table WHERE email = ?';
        db.get(checkEmailSql, [email], (err, row) => {
            if (err) {
                return reject(err);
            }
            if (row) {
                return reject(new Error('Email already exists'));
            }

            // Generate a salt
            crypto.randomBytes(16, (err, salt) => {
                if (err) {
                    return reject(err);
                }

                // Hashing the password with the salt
                crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
                    if (err) {
                        return reject(err);
                    }

                    // Converting the salt and hashed password to hexadecimal strings
                    const saltHex = salt.toString('hex');
                    const hashedPasswordHex = hashedPassword.toString('hex');

                    const sql = 'INSERT INTO users_table (name, surname, email, password_hash, salt) VALUES (?, ?, ?, ?, ?)';
                    const params = [name, surname, email, hashedPasswordHex, saltHex];

                    db.run(sql, params, function (err) {
                        if (err) {
                        return reject(err);
                        }

                        const user = new User(this.lastID, name, surname, email);
                        resolve(user);
                    });
                });
            });
        });
    });
};

//update user info
export const updateUserInfo = (user_id, name, surname, email) => {
    return new Promise((resolve, reject) => {
        // Checking if the user ID exists
        const checkUserSql = 'SELECT * FROM users_table WHERE user_id = ?';
        db.get(checkUserSql, [user_id], (err, row) => {
            if (err) {
                return reject(err);
            }
            if (!row) {
                return reject(new Error('User not found'));
            }

            const updateSql = 'UPDATE users_table SET name = ?, surname = ?, email = ? WHERE user_id = ?';
            const params = [name, surname, email, user_id];

            db.run(updateSql, params, function (err) {
                if (err) {
                    return reject(err);
                }

                const updatedUser = new User(user_id, name, surname, email);
                resolve(updatedUser);
            });
        });
    });
};

// db method to LOG IN
export const getUser=(email, password)=>{
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users_table WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) {
            return reject(err);
            }
            if (!row) {
            return resolve(false); // No user found with the provided email
            }
    
            // Compare hashed password
            crypto.scrypt(password, Buffer.from(row.salt, 'hex'), 32, (err, hashedPassword) => {
            if (err) {
                return reject(err);
            }
    
            // Check if the provided password matches the stored hashed password
            if (!crypto.timingSafeEqual(Buffer.from(row.password_hash, 'hex'), hashedPassword)) {
                resolve(false); // Passwords don't match
            } else {
                // Passwords match, construct the user object
                const user = new User(row.user_id, row.name, row.surname, row.email);
                resolve(user);
            }
            });
        });
    });
}


// db method to GET USER ID by EMAIL
export const getUserIdByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT user_id FROM users_table WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) {
                return reject(err);
            }
            if (!row) {
                return resolve(false); // No user found with the provided email
            }
            // Return the user ID
            resolve(row.user_id);
        });
    });
}


//for testing purposes 
export const deleteUser = (user_id) => {
    return new Promise((resolve, reject) => {
        const deleteSql = 'DELETE FROM users_table WHERE user_id = ?';
        const resetSql = 'DELETE FROM sqlite_sequence WHERE name = "users_table"';

        db.serialize(() => {
            // First, delete the user
            db.run(deleteSql, [user_id], function (err) {
                if (err) {
                    return reject(err);
                }
                if (this.changes === 0) {
                    return reject(new Error('No user found with the provided user id'));
                }

                // Reset the auto-increment value
                db.run(resetSql, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        });
    });
};
