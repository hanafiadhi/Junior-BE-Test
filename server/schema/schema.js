const blog = require('../models/article')
const comment = require('../models/comment')

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLSchema,
    GraphQLList,
    GraphQLString,
    GraphQLNonNull,
    GraphQLEnumType
} = require('graphql')
//client type
const ArticleType = new GraphQLObjectType({
    name: 'Article',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        title: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        },
        category: {
            type: GraphQLString
        },komentar: {
            type: new GraphQLList(CommentType),
            resolve(parent,arg){
                return comment.find({articleId: parent.id})
            }
        }
    })
})

const CommentType = new GraphQLObjectType({
    name: 'Comments',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        articleId: {
            type: GraphQLID,
        },
        text: {
            type: GraphQLString
        },
        blog: {
            type: ArticleType,
            resolve(parent, args) {
                console.log()
                return blog.findById(parent.articleId)
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        articles: {
            type: new GraphQLList(ArticleType),
            resolve(parent, args) {
                return blog.find().sort({
                    title: 1
                });
            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve(parent, args) {
                return comment.find();
            }
        },
        getArticle: {
            type: ArticleType,
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLID)
                }
            },
            resolve(parent, args) {
                return blog.findById(args.id);
            }
        },
        getComment: {
            type: CommentType,
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLID)
                }
            },
            resolve(parent, args) {
                return comment.findById(args.id);
            }
        },
    }
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addArticle: {
            type: ArticleType,
            args: {
                title: {
                    type: GraphQLNonNull(GraphQLString)
                },
                body: {
                    type: GraphQLNonNull(GraphQLString)
                },
                category: {
                    type: new GraphQLEnumType({
                        name: 'categories',
                        values: {
                            'Graphql': {
                                value: 'Graphql'
                            },
                            'Rest': {
                                value: 'Rest API'
                            }
                        }
                    }),
                    defaultValue: "null"
                }
            },
            resolve(parent, args) {
                const article = new blog({
                    title: args.title,
                    body: args.body,
                    category: args.category
                })

                return article.save();
            }
        },
        deleteArticle: {
            type: ArticleType,
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLID)
                },
            },
            resolve(parent, args) {
                return blog.findByIdAndRemove(args.id);
            }
        },
        UpdateArticle: {
            type: ArticleType,
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLID)
                },
                title: {
                    type: GraphQLNonNull(GraphQLString)
                },
                body: {
                    type: GraphQLNonNull(GraphQLString)
                },
                category: {
                    type: new GraphQLEnumType({
                        name: 'categoriesUpdate',
                        values: {
                            'Graphql': {
                                value: 'Graphql'
                            },
                            'Rest': {
                                value: 'Rest API'
                            }
                        }
                    }),
                }
            },
            resolve(parent, args) {
                return update = blog.findByIdAndUpdate(
                    args.id, {
                        $set: {
                            title: args.title,
                            body: args.body,
                            category: args.category
                        }
                    }, {
                        new: true
                    }
                );
            }
        },
        addComment: {
            type: CommentType,
            args: {
                articleId: {
                    type: GraphQLNonNull(GraphQLID)
                },
                text: {
                    type: GraphQLNonNull(GraphQLString)
                },
            },
            resolve(parent, args) {
                const comments = new comment({
                    text: args.text,
                    articleId: args.articleId
                })
                return comments.save();
            }
        },
        updateComment: {
            type: CommentType,
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLID)
                },
                text: {
                    type: GraphQLNonNull(GraphQLString)
                },
            },
            resolve(parent, args) {
                return update = comment.findByIdAndUpdate(
                    args.id, {
                        $set: {
                            text: args.text
                        }
                    }, {
                        new: true
                    }
                );
            }
        },
        deleteComment: {
            type: CommentType,
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLID)
                },
            },
            resolve(parent, args) {
                return comment.findByIdAndRemove(args.id);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});