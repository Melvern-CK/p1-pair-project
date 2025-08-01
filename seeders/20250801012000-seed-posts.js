"use strict"
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Posts", [
      {
        title: "Welcome to our platform",
        content: "This is the first post on our new social media app!",
        imgUrl: "https://example.com/welcome.jpg",
        slug: "welcome-to-our-platform",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])

    await queryInterface.bulkInsert("PostTags", [
      { postId: 1, tagId: 1, createdAt: new Date(), updatedAt: new Date() },
    ])
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete("PostTags", null, {})
    await queryInterface.bulkDelete("Posts", null, {})
  },
}
