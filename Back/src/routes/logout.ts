import { Logout } from 'storyboard-networking';
import { ExpressFinalCallback } from '../types/types';

const logoutHandler: ExpressFinalCallback<Logout.Body> = (req, res) => {
    req.logout();
    const payload: Logout.Response = {
        success: true,
        message: 'logged out',
    };
    req.transaction.sendResponse(res, req, payload);
};

export {
	logoutHandler,
}
