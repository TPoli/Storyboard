const bcrypt = require('bcrypt');

export const generateNewPeppers = () => {
    for (let i = 0; i < 100; ++i) {
        bcrypt.genSalt(10, (error: Error, salt: string) => {
            bcrypt.genSalt(10, (error: Error, key: string) => {
                console.log(`${key}: ${salt}`);
            });
        });
    }
};