import express from 'express';
import controller from '../controller/adminuser.controller.js';
import { verifyToken } from '../../middleware/auth.js';
import {validate} from '../../middleware/validate.js';
import dto from '../dto/adminuser.dto.js';

const router = express.Router();

router.post('/login', validate(dto.loginSchema), controller.login);
router.post('/refresh-token', validate(dto.refreshTokenSchema), controller.refreshToken);

router.get('/me', verifyToken(), controller.me);
router.post('/logout', verifyToken(), controller.logout);
router.post('/change-password', verifyToken(), validate(dto.changePasswordSchema), controller.changePassword);


router.get('/', verifyToken(['Super Admin', 'Admin']), controller.getAdminUsers);
router.post('/', verifyToken(['Super Admin']), validate(dto.createAdminUserSchema), controller.createAdminUser);
router.get('/:id', verifyToken(['Super Admin', 'Admin']), controller.getAdminUserById);
router.put('/:id', verifyToken(['Super Admin']), validate(dto.updateAdminUserSchema), controller.updateAdminUserById);
router.patch('/:id', verifyToken(['Super Admin']), validate(dto.patchAdminUserSchema), controller.patchAdminUserById);
router.delete('/:id', verifyToken(['Super Admin']), controller.deleteAdminUserById);
router.post('/:id/restore', verifyToken(['Super Admin']), controller.restoreAdminUserById);

export default router;