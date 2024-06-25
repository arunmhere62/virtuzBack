import * as Yup from 'yup';

const blogValidationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    // publishedDate: Yup.date().required('Published date is required').typeError('Invalid date format'),
    author: Yup.string().required('Author is required'),
    content: Yup.string().required('Content is required')
});

export { blogValidationSchema };
