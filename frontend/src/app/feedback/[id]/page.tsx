'use client'; 
import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { Feedback, Reply, User } from './../../../types/types';
import StarRating from './StarRating';
import Cookies from 'js-cookie';

const FeedbackPage = ({ params }: { params: any }) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [previousFeedback, setPreviousFeedback] = useState<Feedback[]>([]);
  const [rating, setRating] = useState(0);
  const [adExpertName, setAdExpertName] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);

  const accessToken = Cookies.get('access_token');
  const user = typeof window !== 'undefined' && window.sessionStorage ? window.sessionStorage.getItem('user') : null;
const userId = user ? JSON.parse(user).id : null;

const fetchFeedback = async () => {
  try {
    const response = await api.get(`/feedback/${params.id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    }); 
    setFeedback(response.data.feedback);
    setAverageRating(response.data.averageRating);
    setAdExpertName(response.data.adExpertName); // assuming the response includes adExpertName
  } catch (err) {
    console.error(err);
  }
};

  const fetchPreviousFeedback = async () => {
    try {
      const { data } = await api.get(`/feedback/${params.id}`,{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      setPreviousFeedback(data.feedback);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFeedback();
    fetchPreviousFeedback();
  }, []);

  const handleReplySubmit = async (feedbackId: number, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const replyText = (e.currentTarget.elements.namedItem('reply') as HTMLInputElement)?.value || '';
    try {
      const { data } = await api.post<Reply>(`/feedback/${feedbackId}/reply`, {
        comment: replyText,
      },{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      setFeedback((prevFeedback) =>
        prevFeedback.map((f) =>
          f.id === feedbackId ? { ...f, replies: f.replies ? [...f.replies, data] : [data] } : f
        )
      );
      e.currentTarget.reset();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        //make params.id a number
        const paramid = parseInt(params.id);
        const requestBody = {
            "rating": rating,
            "comment": newComment,
            "adExpertId": paramid,
            "clientId": userId
          } 
      const { data } = await api.post<Feedback>(
        `/feedback/${params.id}`, requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      setFeedback((prevFeedback) => [...prevFeedback, data]);
      setNewComment('');
      setRating(0); // Reset the rating after successful submission
      console.log('Request body:', requestBody);
    } catch (err) {
      console.error(err);
    }
  };

  // Dummy function for non-editable star ratings
  const dummyRatingChange = () => {};
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Feedback for Ad Expert {params.id}</h1>
      
    <div className="mb-8">
        <span className="text-2xl font-semibold">Average Rating:</span>
        <StarRating
            initialRating={Math.round(averageRating)}
            onRatingChange={dummyRatingChange} />
        <span className="text-gray-600 ml-2 text-xl">({averageRating.toFixed(2)})</span>
    </div>
      <div className="add-feedback mb-8">

        <h3 className="text-2xl font-semibold mb-4">Leave your feedback..</h3>
        
        <form onSubmit={handleCommentSubmit} className="flex flex-col">
        <StarRating
            initialRating={rating}
            onRatingChange={handleRatingChange}
            editable={true}
          />
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your feedback..."
            className="mb-4 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
          
          <button
            type="submit"
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
          >
            Submit Feedback
          </button>
        </form>
        <br></br>
        <a className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md" href="/dashboard">Go Back to Dashboard</a>

      </div>
    <div className="mb-4">
  {[5, 4, 3, 2, 1].map((rating) => (
    <button
      key={rating}
      onClick={() => setSelectedRating(rating)}
      className={`mr-2 py-1 px-2 text-sm ${selectedRating === rating ? 'text-blue-500' : ''}`}
    >
      ({rating}<span style={{ color: '#47ab27' }}>★)</span>
    </button>
  ))}
</div>
      <div className="mb-8">
        
        <h2 className="text-2xl font-semibold mb-4">Higlighted</h2>
        {previousFeedback && previousFeedback.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {previousFeedback
      .filter((f) => selectedRating === 0 || f.rating === selectedRating)
      .map((f) => (
              <div
                key={f.id}
                className="bg-white rounded-lg shadow-md p-1 feedback-item"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Feedback from {f.client?.lastName || 'Anonymous'}
                  </h3>
                  <StarRating
                    initialRating={f.rating}
                    onRatingChange={dummyRatingChange}
                  />
                </div>
                <p className="text-gray-700 mb-2">{f.comment}</p>
                <p className="text-sm text-gray-500">
                  {new Date(f.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
            </div>
          ) : (
            <p className="text-gray-600">No previous feedback available.</p>
          )}
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">All Ratings & Feedbacks</h2><hr/>
        {feedback && feedback.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedback.map((f) => (
              <div
                key={f.id}
                className="bg-white rounded-lg shadow-md p-6 feedback-item"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Feedback from {f.client?.lastName || 'Anonymous'}
                  </h3>
                  <StarRating
                    initialRating={f.rating}
                    onRatingChange={dummyRatingChange}
                  />
                </div>
                <p className="text-gray-700 mb-2">{f.comment}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(f.createdAt).toLocaleString()}
                </p>
                <div className="replies">
                  <h4 className="text-lg font-semibold mb-2">Replies</h4>
                  {f.replies && f.replies.length > 0 ? (
                    <div className="space-y-2">
                      {f.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="bg-gray-100 rounded-md p-2 reply"
                        >
                          <p className="text-gray-700 mb-1">
                            {reply.user.lastName}: {reply.comment}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(reply.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No replies yet.</p>
                  )}
                  <form
                    onSubmit={(e) => handleReplySubmit(f.id, e)}
                    className="mt-4 flex"
                  >
                    <input
                      name="reply"
                      placeholder="Write a reply..."
                      className="flex-grow rounded-l-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required />
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-r-md"
                    >
                      Submit Reply
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No feedback available.</p>
        )}
      </div>
      
    </div>
  );

};

export default FeedbackPage;