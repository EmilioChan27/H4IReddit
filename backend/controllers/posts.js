const { Post } = require('../models')

module.exports.index = (req, res, next) => {
  if (!req.query.dateRange) return findPost({}, res, next);
  var date = new Date(req.query.currDate);
  console.log(`the current date is ${date.toISOString()}`)
  console.log(`the current value of date is ${date.getTime()}`);
  if (req.query.dateRange == 'Past week') date.setTime(date.getTime()- (7*24*60*60000));
  else if (req.query.dateRange == 'Past month') date.setTime(date.getTime()-30*24*60*60000);
  else if (req.query.dateRange == 'Past year') date.setTime(date.getTime()- 365*24*60*60000);
  else if (req.query.dateRange == 'A year ago') {
    date.setTime(date.getTime() - 365*24*60*60000);
    return findPost({createdAt: {$lt: date.toISOString()}}, res, next); 
  }
  else {
    date.setTime(date.getTime() - 10*365*24*60*60000);
    return findPost({createdAt: {$lt: date.toISOString()}}, res, next)
  }
  console.log(`the value of date is ${date.getTime()}`);
  console.log(`the ISOString of date is ${date.toISOString()}`);
  return findPost({createdAt: {$gt: date.toISOString()}}, res, next);
}

const findPost = (filter, res, next) => {
  Post.find(filter)
    .populate('comments') 
    .sort('-createdAt')
    .then(posts => {
      res.locals.data = { posts }
      res.locals.status = 200
      return next() 
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      return next()
    })
}

module.exports.createDummy = (req, res, next) => {
  const date =  new Date(req.params.date);
  const newPost = new Post({
    author: "Tester",
    title: "Test title",
    text: "test text",
    createdAt: date.toISOString(),
  })
  newPost
    .save()
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 201;
      return next();
    }).catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}

module.exports.get = (req, res, next) => {
  Post.findById(req.params.id)
    .populate('comments')
    .then(post => {
      res.locals.data = { post }
      res.locals.status = post === null ? 404 : 200
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.errors = { error: err.message }
      return next()
    })
}

module.exports.store = (req, res, next) => {
  const newPost = new Post(req.body)
  newPost
    .save()
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 201
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}

module.exports.update = (req, res, next) => {
  Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
    runValidators: true,
    new: true,
  })
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 200
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}

module.exports.delete = (req, res, next) => {
  Post.findByIdAndCascadeDelete({ _id: req.params.id })
    .then(_ => {
      res.locals.data = { deleted: 'Success' }
      res.locals.status = 200
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}

module.exports.comment = (req, res, next) => {
  Post.findByIdAndAddComment(req.params.id, req.body)
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 201
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}
