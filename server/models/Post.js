import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    comment: { type: String, required: true },
    commentUserId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Nouvelle propriété pour enregistrer l'ID de l'utilisateur qui a posté le commentaire
  },
  { timestamps: true }
);

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: [commentSchema], // Modification pour inclure le schéma de commentaire
  },
  { timestamps: true }
);

postSchema.methods.createComment = async function (
  userId,
  firstName,
  lastName,
  comment
) {
  this.comments.push({
    userId,
    firstName,
    lastName,
    comment,
    commentUserId: userId,
  }); // Ajoutez commentUserId ici
  await this.save();
};

postSchema.methods.getComments = function () {
  return this.comments;
};

const Post = mongoose.model("Post", postSchema);

export default Post;
