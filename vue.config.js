const repositoryName = "nicechord-vue"

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/' + repositoryName + '/'
    : '/'
}
