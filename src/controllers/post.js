const {
    getMissingFields,
    isUUIDV4,
    paginate
} = require('../utils');

const { Post, User } = require('../models');
const { Op } = require('sequelize');

const newPost = async (req, res) => {

    const missingFields = getMissingFields(
        ['title', 'content'],
        req.body
    );

    if (missingFields.length) {
        return res.status(422).json({
            msg: 'Missing fields',
            missingFields,
            error: true
        })
    }

    try {
        const { title, content } = req.body;

        await Post.create({
            UserId: req.user.id,
            title,
            content
        });

        return res.status(200).json({
            msg: 'Post created successfully',
            error: false
        })
    }
    catch (e) {
        return serverErrorMsg(res, 'create post');
    }
}

const searchPosts = async (req, res) => {

    const { limit, page, search } = req.query;

    try {
        const searchQuery = search ? {
            where: { title: { [Op.iLike]: `%${search}%` } }
        } : [];

        const posts = await Post.findAndCountAll(
            paginate({
                ...searchQuery,
                include: [{
                    model: User, required: false,
                    attributes: ['id', 'firstName', 'lastName']
                }],
                attributes: { exclude: ['UserId'] },
                order: [['createdAt', 'DESC']],
                nest: true, raw: true,
            }, page, limit)
        );

        return res.status(200).json({
            rows: posts.rows,
            totalRecords: posts.count,
            records: posts.rows.length,
            error: false
        });
    }
    catch (e) {
        console.log(e);
        return serverErrorMsg(res, 'get posts');
    }
}

const getPost = async (req, res) => {

    const { postId } = req.params;

    if (!isUUIDV4(postId)) {
        invalidIdMsg(res);
    }

    try {
        const post = await Post.findOne({
            where: { id: postId },
            include: [{
                model: User, required: false,
                attributes: ['id', 'firstName', 'lastName']
            }],
            attributes: { exclude: ['UserId'] },
            nest: true, raw: true,
        });

        if (!post) {
            return res.status(200).json({});
        }

        return res.status(200).json({
            user: post.User,
            id: post.id,
            title: post.title,
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            error: false
        });
    }
    catch (e) {
        return serverErrorMsg(res, 'get post');
    }
}

const getUserPosts = async (req, res) => {

    const { page, limit } = req.query;
    const { userId } = req.params;

    if (!isUUIDV4(userId)) {
        return invalidIdMsg(res);
    }

    try {
        const user = await User.findByPk(userId, {
            attributes: ['id', 'firstName', 'lastName'],
            raw: true,
        });

        if (!user) {
            return res.status(400).json({
                msg: "User doesn't exist",
                error: true
            });
        }

        const posts = await Post.findAndCountAll(
            paginate({
                where: { UserId: userId },
                attributes: { exclude: ['UserId'], },
                order: [['createdAt', 'DESC']],
                nest: true, raw: true,
            }, page, limit)
        );

        return res.status(200).json({
            user,
            posts: {
                rows: posts.rows,
                totalRecords: posts.count,
                records: posts.rows.length,
            },
            error: false
        });

    }
    catch (e) {
        return serverErrorMsg(res, 'get posts');
    }
}

const deletePost = async (req, res) => {

    const { postId } = req.params;

    if (!isUUIDV4(postId)) {
        return invalidIdMsg(res);
    }

    try {
        const deleted = await Post.destroy({
            where: {
                UserId: req.user.id,
                id: postId
            }
        });

        if (deleted) {
            return res.status(200).json({
                msg: 'Successfully deleted',
                error: false
            });
        }

        return res.status(400).json({
            msg: "Post doesn't exist",
            error: true
        });
    }
    catch (e) {
        return serverErrorMsg(res, 'delete post');
    }
}

const patchPost = async (req, res) => {

    const { postId } = req.params;

    if (!isUUIDV4(postId)) {
        return invalidIdMsg(res);
    }

    const body = req.body;

    if (!body.title && !body.content) {
        return res.status(422).json({
            msg: 'Title or content is required to update',
            error: true
        });
    }

    try {
        const updatedPost = await Post.update(body, {
            where: {
                UserId: req.user.id,
                id: postId
            },
            fields: ['title', 'content']
        });

        if (updatedPost[0]) {
            return res.status(200).json({
                msg: 'Successfully updated',
                error: false
            })
        }

        return res.status(400).json({
            msg: "Post doesn't exist",
            error: true
        });
    }
    catch (e) {
        return serverErrorMsg(res, 'update post');
    }
}

// Internal functions

const invalidIdMsg = (responseObj) => { // Used some times
    return responseObj.status(400).json({
        msg: 'Invalid id',
        error: true
    });
}

const serverErrorMsg = (responseObj, action) => { // Used many times
    return responseObj.status(500).json({
        msg: `Error when trying to ${action}`,
        error: true
    })
}


// Export controllers
module.exports = {
    getUserPosts,
    searchPosts,
    deletePost,
    patchPost,
    newPost,
    getPost,
};