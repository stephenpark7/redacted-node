"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostComment = void 0;
const PostComment = (sequelize, Sequelize) => {
    const PostComment = sequelize.define('PostComment', {
        comment_id: {
            type: Sequelize.INTEGER,
            unique: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        post_id: {
            type: Sequelize.UUID,
            allowNull: false,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        content: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
    });
    return PostComment;
};
exports.PostComment = PostComment;
