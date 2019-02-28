const Post = require("models/post");
const Joi = require("joi");

const { ObjectId } = require("mongoose").Types;

exports.checkObjectId = (ctx, next) => {
  const { id } = ctx.params;

  // ���� ����
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // 400 Bad Request
    return null;
  }

  return next(); // next�� �������־�� ctx.body�� ����� �����˴ϴ�.
};

/*
  POST /api/posts
  { title, body, tags }
*/
exports.write = async ctx => {
  // ��ü�� ���� ������ �����մϴ�.
  const schema = Joi.object().keys({
    title: Joi.string().required(), // �ڿ� required�� �ٿ��ָ� �ʼ� �׸��̶�� �ǹ�
    body: Joi.string().required(),
    tags: Joi.array()
      .items(Joi.string())
      .required() // ���ڿ� �迭
  });

  // ù ��° �Ķ���ʹ� ������ ��ü, �� ��°�� ��Ű��
  const result = Joi.validate(ctx.request.body, schema);

  // ���� �߻� �� ���� ���� ����
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;

  // �� Post �ν��Ͻ��� �����մϴ�.
  const post = new Post({
    title,
    body,
    tags
  });

  try {
    await post.save(); // �����ͺ��̽��� ����մϴ�.
    ctx.body = post; // ����� ����� ��ȯ�մϴ�.
  } catch (e) {
    // �����ͺ��̽��� ���� �߻�
    ctx.throw(e, 500);
  }
};

/*
  GET /api/posts
*/
exports.list = async ctx => {
  // page�� �־����� �ʾҴٸ� 1�� ����
  // query�� ���ڿ� ���·� �޾ƿ��Ƿ� ���ڷ� ��ȯ
  const page = parseInt(ctx.query.page || 1, 10);

  // �߸��� �������� �־����ٸ� ����
  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec();
    const postCount = await Post.countDocuments().exec();
    const limitBodyLength = post => ({
      ...post,
      body: post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`
    });
    ctx.body = posts.map(limitBodyLength);
    // ������ ������ �˷��ֱ�
    // ctx.set�� response header�� �������ݴϴ�.
    ctx.set("Last-Page", Math.ceil(postCount / 10));
  } catch (e) {
    ctx.throw(500, e);
  }
};

/*
  GET /api/posts/:id
*/
exports.read = async ctx => {
  const { id } = ctx.params;
  try {
    const post = await Post.findById(id).exec();
    // ����Ʈ�� �������� ����
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

/*
  DELETE /api/posts/:id
*/
exports.remove = async ctx => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(e, 500);
  }
};

/*
  PATCH /api/posts/:id
  { title, body, tags }
*/
exports.update = async ctx => {
  const { id } = ctx.params;
  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true
      // �� ���� ������ �־�� ������Ʈ�� ��ü�� ��ȯ�մϴ�.
      // �������� ������ ������Ʈ�Ǳ� ���� ��ü�� ��ȯ�մϴ�.
    }).exec();
    // ����Ʈ�� �������� ���� ��
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(e, 500);
  }
};
