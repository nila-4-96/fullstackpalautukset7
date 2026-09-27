const lodash = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (max, item) => {
    if (item.likes > max.likes) {
      return item
    } else {
      return max
    }
  }
  return {
    title: blogs.reduce(reducer).title,
    author: blogs.reduce(reducer).author,
    url: blogs.reduce(reducer).url,
    likes: blogs.reduce(reducer).likes,
  }
}

const mostBlogs = (blogs) => {
  const counted = lodash.countBy(blogs, 'author')
  const valmax = lodash.max(Object.values(counted))
  const authmax = lodash.find(blogs, function (o) {
    return counted[o.author] === valmax
  })

  return {
    author: authmax.author,
    blogs: valmax,
  }
}

const mostLikes = (blogs) => {
  const totals = lodash.map(
    lodash.groupBy(blogs, 'author'),
    (blogs, author) => ({
      author: author,
      likes: lodash.sumBy(blogs, 'likes'),
    }),
  )

  return lodash.maxBy(totals, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
