const bcrypt = require("bcryptjs")
const { User, Profile, Post, Tag, Comment } = require("../models")
const { Op } = require("sequelize")
const timeAgo = require("../helpers/helper")
const markdown = require("../helpers/markdown")
const { toDataURL } = require("../helpers/qrcode")
const analyzeSentiment = require('../helpers/sentiment');


class Controller {
  // GET /
  static home(req, res) {
    res.render("index")
  }

  // GET /register
  static getRegister(req, res) {
    res.render("register", { errors: [] })
  }

  // POST /register
  static async postRegister(req, res) {
    try {
      const { username, email, password, role } = req.body
      const user = await User.create({ username, email, password, role })
      // create an empty profile for 1-1
      await Profile.create({ userId: user.id, bio: "" })
      req.session.user = { id: user.id, email: user.email }
      res.redirect("/posts")
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((e) => e.message)
        return res.render("register", { errors })
      }
      res.send(error)
    }
  }

  // GET /login
  static getLogin(req, res) {
    res.render("login", { errors: [] })
  }

  // POST /login
  static async postLogin(req, res) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.render("login", { errors: ["Invalid email or password"] })
      }
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        return res.render("login", { errors: ["Invalid email or password"] })
      }
      req.session.user = { id: user.id, email: user.email }
      res.redirect("/posts")
    } catch (error) {
      res.send(error)
    }
  }

  // GET /logout
  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) return res.send(err)
      res.redirect("/")
    })
  }

  static async posts(req, res) {
    try {
      const { search } = req.query
      const where = {}
      if (search) {
        where.title = { [Op.iLike]: `%${search}%` }
      }

      const rawData = await Post.findAll({
        where,
        include: [User, Tag],
        order: [["createdAt", "DESC"]],
      })

      const data = await Promise.all(
        rawData.map(async (p) => {
          const url = `${req.protocol}://${req.get("host")}/posts/${p.id}`
          const qr = await toDataURL(url)
          const { score, label } = analyzeSentiment(p.content)

          return { ...p.get(), qr, sentimentScore: score, sentimentLabel: label}
        })
      )

      res.render("posts", {
        data,
        timeAgo,
        search,
        markdown,
      })
    } catch (error) {
      res.send(error)
    }
  }

  // GET /posts/add
  static async getAddPost(req, res) {
    try {
      const tags = await Tag.findAll()
      res.render("addPost", { tags, errors: [] })
    } catch (error) {
      res.send(error)
    }
  }

  // POST /posts/add
  static async postAddPost(req, res) {
    try {
      const { title, content, imgUrl, tags } = req.body
      const post = await Post.create({
        title,
        content,
        imgUrl,
        userId: req.session.user.id,
      })
      if (tags) {
        await post.addTags(Array.isArray(tags) ? tags : [tags])
      }
      res.redirect("/posts")
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((e) => e.message)
        const allTags = await Tag.findAll()
        return res.render("addPost", { tags: allTags, errors })
      }
      res.send(error)
    }
  }

  // GET /posts/:id

  static async postDetail(req, res) {
    try {
      const {id} = req.params;
      
      let rawData = await Post.findByPk(id, {
        include: [User, Tag, {
          model: Comment,
          include: [User]
        }],
        order: [["createdAt", "DESC"]]
      });

      const url = `${req.protocol}://${req.get("host")}/posts/${rawData.id}`;
      const { score, label } = analyzeSentiment(rawData.content);

      const data = {
        ...rawData.get(),
        sentimentScore: score,
        sentimentLabel: label
      };

      res.render('postsDetail', { data, id, timeAgo, currentUserId: req.session.user?.id });
    } catch (error) {
      console.log(error)
      res.send(error)
    }
  }

  static async deletePost(req, res) {
    try {
      const { id } = req.params;
      const post = await Post.findByPk(id);

      if (post.userId !== req.session.user.id) {
        return res.redirect("/posts");
      }

      await post.destroy(); 
      res.redirect("/posts");
    } catch (error) {
      res.send(error)
    }
  }

  static async postComment(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;

      await Comment.create({
        content,
        userId: req.session.user.id,
        postId: id
      });

      res.redirect(`/posts/${id}`);
    } catch (error) {
      res.send(error)
    }
  }
}

module.exports = Controller
