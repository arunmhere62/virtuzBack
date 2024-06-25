import { BlogSchema } from "../models/blogs.js";
import { blogValidationSchema } from "../validations/validations.js";
import multer from 'multer';
import path from 'path';
// Set up multer storage and file handling
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/Images');
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//     }
// });

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
// });

const createBlog = async (req, res) => {
    // try {
    const { title, description, publishedDate, author, content, imageUrl } = req.body;
    const newBlog = new BlogSchema({ title, description, publishedDate, author, content, imageUrl });
    try {
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
    //     // Handle image upload using multer middleware
    //     upload.single('image')(req, res, async (err) => {
    //         if (err) {
    //             console.error('File upload error:', err);
    //             return res.status(400).json({ message: 'File upload error' });
    //         }

    //         // Create a new blog instance with request body and image URL
    //         const { title, description, publishedDate, author, content } = req.body;
    //         const imageUrl = req.file ? req.file.path.replace(/\\/g, '/') : '';

    //         // Validate other fields using a validation schema if needed
    //         // await blogValidationSchema.validate(req.body, { abortEarly: false });

    //         const newBlog = new BlogSchema({
    //             title,
    //             description,
    //             publishedDate,
    //             author,
    //             content,
    //             imageUrl, // Assign image URL to blog schema
    //         });

    //         // Save blog to database
    //         await newBlog.save();

    //         // Replace _id with id for frontend-friendly response
    //         const responseBlog = {
    //             ...newBlog.toObject(),
    //             id: newBlog._id,
    //             imageUrl: `${req.protocol}://${req.get('host')}/${imageUrl}`, // Construct full URL
    //         };

    //         // Respond with created blog
    //         res.status(201).json(responseBlog);
    //     });
    // } catch (err) {
    //     console.error('Server error:', err);
    //     res.status(500).json({ message: 'Server Error' });
    // }
};

const blogList = async (req, res) => {
    try {
        let blogs = await BlogSchema.find().lean(); // Use lean to get plain objects

        // Map through each blog to format the response
        blogs = blogs.map(blog => {
            // Replace _id with id
            blog.id = blog._id;
            delete blog._id;

            // Assuming images are stored in a directory accessible via HTTP
            // // Construct the imageUrl field to provide a full URL path
            // blog.imageUrl = `${req.protocol}://${req.get('host')}/${blog.imageUrl}`;

            return blog;
        });

        console.log(blogs); // Log the blogs array to inspect image URLs

        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: `Server Error: ${err.message}` });
    }
};


const getBlogById = async (req, res) => {
    try {
        const blog = await BlogSchema.findById(req.params.id).lean(); // Use lean to get a plain object
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        // Replace _id with id
        blog.id = blog._id;
        delete blog._id;

        res.json(blog);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            res.status(400).json({ message: `Invalid Blog ID: ${err.message}` });
        } else {
            res.status(500).json({ message: `Server Error: ${err.message}` });
        }
    }
};

const updateBlogById = async (req, res) => {
    try {
        await blogValidationSchema.validate(req.body, { abortEarly: false });

        const { id } = req.params;
        const updateData = req.body;

        const updatedBlog = await BlogSchema.findByIdAndUpdate(id, updateData, {
            new: true, // Return the updated document
            runValidators: true, // Ensure the update follows the schema validation
        }).lean();

        if (!updatedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Transform _id to id
        updatedBlog.id = updatedBlog._id;
        delete updatedBlog._id;

        res.json(updatedBlog);
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ message: `Validation Error: ${err.errors.join(', ')}` });
        } else if (err.kind === 'ObjectId') {
            res.status(400).json({ message: `Invalid Blog ID: ${err.message}` });
        } else {
            res.status(500).json({ message: `Server Error: ${err.message}` });
        }
    }
};

const deleteBlogById = async (req, res) => {
    try {
        const blog = await BlogSchema.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json({ message: 'Blog deleted' });
    } catch (err) {
        if (err.kind === 'ObjectId') {
            res.status(400).json({ message: `Invalid Blog ID: ${err.message}` });
        } else {
            res.status(500).json({ message: `Server Error: ${err.message}` });
        }
    }
};


export { createBlog, blogList, getBlogById, updateBlogById, deleteBlogById }