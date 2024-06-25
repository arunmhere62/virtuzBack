import mongoose from "mongoose";

const Blogs = mongoose.Schema({
    title: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    publishedDate: {
        type: String,
        required: false,
    },
    author: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: false,
    },
    imageUrl: {
        type: String,
        required: true, // Adjust based on your application's requirements
    }
});

const BlogSchema = mongoose.model("blog", Blogs);
export { BlogSchema };