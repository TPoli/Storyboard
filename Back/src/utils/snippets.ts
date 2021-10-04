import * as bcrypt from 'bcrypt';

export const generateNewPeppers = (): void => {
    for (let i = 0; i < 100; ++i) {
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.genSalt(10, (error, key) => {
                console.log(`${key}: ${salt}`);
            });
        });
    }
};