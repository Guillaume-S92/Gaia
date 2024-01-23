import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  DeleteOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  InputBase,
  Button,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { setPost, removePost, addComment, removeComment } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${postId}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Commentaire supprimé avec succès");
        dispatch(removeComment({ postId, commentId }));
      } else {
        console.log("Erreur lors de la suppression du commentaire");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async () => {
    try {
      if (loggedInUserId !== postUserId) {
        console.log("Vous n'êtes pas autorisé à supprimer ce post.");
        return;
      }

      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Post supprimé avec succès");
        dispatch(removePost({ postId }));
      } else {
        console.log("Erreur lors de la suppression du post");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, comment }),
      });
  
      if (response.ok) {
        console.log("Commentaire ajouté avec succès");
        const updatedPost = await response.json();
        console.log("Post mis à jour après l'ajout du commentaire :", updatedPost);
  
        // Mise à jour locale des commentaires
        dispatch(setPost({ post: updatedPost }));
      } else {
        console.log("Erreur lors de l'ajout du commentaire");
      }
    } catch (error) {
      console.log(error);
    }
  
    setComment("");
  };
  
  
  
  

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: "#a1c794" }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
          {loggedInUserId === postUserId && (
            <IconButton onClick={deletePost}>
              <DeleteOutlined />
            </IconButton>
          )}
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, index) => (
  <Box key={comment._id || index}>
    <Divider />
    <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
      {comment.firstName} {comment.lastName}: {comment.comment}
      {loggedInUserId === comment.userId && (
        <IconButton onClick={() => deleteComment(comment._id)}>
          <DeleteOutlined />
        </IconButton>
      )}
    </Typography>
  </Box>
))}
          <Divider />

          <Box display="flex" alignItems="center" mt="0.5rem">
            <InputBase
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{
                width: "100%",
                backgroundColor: palette.neutral.light,
                borderRadius: "2rem",
                padding: "0.5rem 1rem",
              }}
            />
            <Button
              variant="contained"
              onClick={handleComment}
              disabled={!comment}
              sx={{ marginLeft: "0.5rem" }}
            >
              Post
            </Button>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
