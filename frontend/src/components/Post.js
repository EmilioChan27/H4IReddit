import React from 'react'
import {useState} from 'react'
import Comment from './Comment'
import AddComment from './AddComment'
import './Post.css'

const Post = props => {
  const [replyOpen, setReplyOpen] = React.useState(false)
  const [upVoted, setUpVoted] = useState(false);
  const [downVoted, setDownVoted] = useState(false);

  const changeVoteCount = (upVote) => {
    if (upVote) {
      if (upVoted) {
        props.post.upVotes-=1;
        props.onRmUpVote();
      } else if (downVoted) {
        props.post.upVotes+=1;
        props.post.downVotes-=1;
        props.onAddUpVote();
        props.onRmDownVote();
      } else {
        props.onAddUpVote();
        props.post.upVotes+=1;
      }
      setUpVoted(!upVoted);
      setDownVoted(false);
    } else {
      if (downVoted){
        props.post.downVotes-=1;
        props.onRmDownVote();
      } 
      else if (upVoted) {
        props.onAddDownVote();
        props.onRmUpVote();
        props.post.downVotes+=1;
        props.post.upVotes-=1;
      } else {
        props.onAddDownVote();
        props.post.downVotes+=1;
      }
      setDownVoted(!downVoted);
      setUpVoted(false);
    }
  }

  const toggleReply = () => setReplyOpen(!replyOpen)

  const saveComment = commentData => {
    setReplyOpen(false)
    props.onComment(props.post._id, commentData)
  }

  return (
    <>
      <section className="post">
        <div className="arrows">
          <button class={upVoted ? "button-selected" : "button"} onClick={() => (changeVoteCount(true))}>↑</button>
          <span className="center">
            {props.post.upVotes-props.post.downVotes}
          </span>
          <button class={downVoted ? "button-selected" : "button"} onClick={() => (changeVoteCount(false))}>↓</button>
        </div>
        <div className="post-body">
          <div className="author">Posted by {props.post.author}</div>
          <div className="header">{props.post.title}</div>
          <div>{props.post.text}</div>
          <div className="button-row">
            <button onClick={() => props.onDelete(props.post._id)}>
              Delete
            </button>
            <button onClick={toggleReply}>Reply</button>​
            {replyOpen && (
              <AddComment
                onSubmit={saveComment}
                onCancel={() => setReplyOpen(false)}
              />
            )}
          </div>
        </div>
      </section>
      <section className="comments">
        {props.post.comments.map(com => (
          <Comment
            key={com._id}
            comment={com}
            onDelete={props.onCommentDelete}
            onEdit={props.onCommentEdit}
            onComment={props.onSubComment}
          />
        ))}
      </section>
    </>
  )
}

export default Post
