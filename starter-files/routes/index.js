const express = require('express');
const router = express.Router();

const { catchErrors } = require('../handlers/errorHandlers')
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');

// Do work here
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/:slug', catchErrors(storeController.getStoreBySlug));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.get('/add', storeController.addStore);

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.post('/add',
    storeController.upload,
    storeController.resize,
    catchErrors(storeController.createStore)
);

router.post('/add/:id',
    storeController.upload,
    storeController.resize,
    catchErrors(storeController.updateStore)
);

router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);

//validate registration data
router.post('/register', userController.validateRegister);
//register the user
//log the user in

module.exports = router;
