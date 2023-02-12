import axios from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../shared/utils/userContext';
import { useHistory, useParams } from 'react-router-dom';
import styles from '../../styles/Category.module.scss';
import { Post as PostType } from '../../shared/types/Post';
import { timeDifference } from '../../shared/utils/dateTime';
import { UserContext as UserContextType } from '../../shared/types/UserContext';

export default function Home() {
  const userContext = useContext(UserContext) as UserContextType;
  const { state: userData } = userContext;
  const { categoryName } = useParams<{ categoryName: string }>();
  const [ posts, setPosts ] = useState<PostType[]>([]);
  const [ fetchFlag, setFetchFlag ] = useState(false);
  const [ createPostToggle, setCreatePostToggle ] = useState(false);
  const history = useHistory();

  const getCategoryData = useCallback(() => {
    axios({
      method: 'get',
      url: '/api/category/' + categoryName,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': userData.access_token
      }
    }).then(res => {
      console.log(res.data);
      setPosts(res.data);
      setFetchFlag(true);
    }).catch(err => {
      if (err) {
        const errorMessage = err.response.data;
        if (errorMessage) {
          console.log(errorMessage);
          history.push('/404');
        } else {
          console.log(err);
        }
      } else {
        console.log(err);
      }
    });
  }, [userData]);

  const handleCreatePostToggle = () => {
    setCreatePostToggle(!createPostToggle)
  };

  const handleCreatePost = () => {
    const title = document.querySelector('input[name=create-post-title-input]') as HTMLInputElement;
    const description = document.querySelector('textarea[name=create-post-content-textarea]') as HTMLInputElement;
    if (title.value && description.value) {
      createPost(title.value, description.value);
    }
  };

  const createPost = (title: string, description: string) => {
    axios({
      method: 'post',
      url: '/api/category/' + categoryName,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': userData.access_token
      },
      params: {
        category_id: 3,
        type: 1,
        title: title,
        content: description
      }
    }).then(res => {
      console.log(res.data);
      // TODO: need to join with PostComments and User
      setPosts([ ...posts, res.data ]);
      setFetchFlag(true);
    }).catch(err => {
      if (err) {
        console.log(err)
        const errorMessage = err.response.data;
        if (errorMessage) {
          console.log(errorMessage);
          history.push('/404');
        } else {
          console.log(err);
        }
      } else {
        console.log(err);
      }
    });
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  const renderPostTitle = (post: PostType) => post.type === 'link' ?
    <a href={post.content}>
      {post.title}
    </a> :
    <a href={'/category/' + categoryName + '/' + post.post_id}>
      {post.title}
    </a>

  const renderPostContent = (post: PostType) => post.type === 'link' ?
    <a href={post.content}>
      {post.content}
    </a> :
    <>
      {post.content}
    </>;

  const renderPostData = (post: PostType) => <>
    Posted by <a href={'/user/' + post.User.username}>{post.User.username}</a> {timeDifference(new Date(), new Date(post.createdAt))}
  </>;

  const renderPostComments = (post: PostType) => <>
    <i className='far fa-comments comments-icon'></i>
    <a href={'/category/' + categoryName + '/' + post.post_id}>
      {post.PostComments.length} {post.PostComments.length === 1 ? 'comment' : 'comments'}
    </a>
  </>;

  const renderPost = (post: PostType, idx: number) =>
    <div className={styles.postContainer} key={idx}>
      <div className={styles.voteContainer}>
        <button className={styles.voteArrowUp}><i className='fas fa-arrow-up'></i></button>
        <span className={styles.voteScore}>{post['upvotes'] - post['downvotes']}</span>
        <button className={styles.voteArrowDown}><i className='fas fa-arrow-down'></i></button>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.postTitle}>{renderPostTitle(post)}</div>
        <div className={styles.postContent}>{renderPostContent(post)}</div>
        <div className={styles.postData}>{renderPostData(post)}</div>
        <div className={styles.postComments}>{renderPostComments(post)}</div>
      </div>
    </div>;

  const renderedPosts = posts.length > 0 ? posts.map((post: PostType, idx: number) => renderPost(post, idx)) : <div>There are no posts in this category.</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.categoryTitle}>{categoryName}</h1>
      <div className={styles.createPostButtonContainer}>
        <a className={styles.createPostButton} 
           onClick={handleCreatePostToggle}>{!createPostToggle ? 'Create Post' : 'Hide'}</a>
      </div>
      {createPostToggle && 
      <div className={styles.createPostContainer}>
        <input type='text' 
               name='create-post-title-input' 
               className={styles.createPostTitleInput} 
               placeholder='enter your title' 
               required />
        <textarea name='create-post-content-textarea' 
                  className={styles.createPostDescriptionTextArea} 
                  placeholder='enter your content' 
                  required />
        <div className={styles.innerCreatePostButtonContainer}>
          <button className={styles.createPostButton}
                  onClick={handleCreatePost}>Create Post</button>
        </div>
      </div>}
      {fetchFlag ? renderedPosts : 'Loading...'}
    </div>
  );
}
