import multer from 'multer';

const storage = multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,'uploads/')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage }); // ✅ wrap storage in an object

export default upload;
