const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if (isPhoto) {
            next(null, true);
        } else {
            next({ message: `That file type isn't allowed` }, false)
        }
    }
}

exports.homePage = (req, res) => {
    res.render('index')
}

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add store' });
}

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    if (!req.file) {
        next();
        return
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    //now we resize
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    next();
}

exports.createStore = async (req, res) => {
    const store = await (new Store(req.body).save());
    req.flash('succes', `Successfully created ${store.name}. Care to leave a review?`)
    res.redirect(`/stores/${store.slug}`)
}

exports.getStores = async (req, res) => {
    const stores = await Store.find();
    res.render('stores', { title: 'Stores', stores });
}

exports.editStore = async (req, res) => {
    const store = await Store.findOne({ _id: req.params.id });
    res.render('editStore', { title: `Edit ${store.name}`, store })
}

exports.getStoreBySlug = async (req, res, next) => {
    const store = await Store.findOne({ slug: req.params.slug });
    if (!store) return next();
    res.render('store', { store, title: store.title })
}

exports.updateStore = async (req, res) => {
    //set location data to be a point
    req.body.location.type = 'Point';
    //find and update the store
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
    }).exec();
    req.flash('succes', `Succesfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}/">View Store</a>`);
    res.redirect(`/stores/${store._id}/edit`);
}

exports.getStoresByTag = async (req, res) => {
    // const tag = req.params.tag;
    // const tagQuery = tag || { $exists: true, $ne: [] };

    const tagsPromise = Store.getTagsList();
    res.json(tagsPromise);

    // const storesPromise = Store.find({ tags: tagQuery });
    // const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);


    // res.render('tag', { tags, title: 'Tags', tag, stores });
};
