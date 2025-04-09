"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { CustomLoader } from "@components/global/CustomLoader";
import useAuthToken from "@hooks/useAuthToken";
import { connectTwitter, connectLinkedin } from "@functions/social";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Correct import
import { Dialog, DialogContent, DialogTitle } from "@components/ui/dialog";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

export default function MentionSuggestions() {
  const { workspaceId } = useParams();
  const token = useAuthToken();
  const router = useRouter();

  const colors = {
    primary: "#FF6600",
    navBg: "#111315",
    cardBg: "#1a1d1f",
    textPrimary: "#FFFFFF",
    textSecondary: "#9E9E9E",
    border: "#2D3235",
  };

  const [posts, setPosts] = useState([]);
  const [newReply, setNewReply] = useState({});
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState({});
  const [showReplyField, setShowReplyField] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [selectedAccounts, setSelectedAccounts] = useState({});
  const [connectedAccounts, setConnectedAccounts] = useState([]);

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.bot.thesquirrel.tech/workspace/get/${workspaceId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setWorkspace(response.data.data);
          if (response.data.data?.connectedAccounts) {
            const twitterAccounts = response.data.data.connectedAccounts.filter(
              (account) => account.type === "twitter" && account.isConnected
            );
            setConnectedAccounts(twitterAccounts);
          }

          if (response.data.data?.boostEngagements?.posts) {
            const transformedPosts =
              response.data.data.boostEngagements.posts.map((post) => ({
                id: post.postDetail.id,
                author: post.postDetail.author.name,
                username: `@${post.postDetail.author.userName}`,
                profileUrl: `https://x.com/${post.postDetail.author.userName}`,
                avatar:
                  post.postDetail.author.profilePicture ||
                  "/api/placeholder/48/48",
                content: post.postDetail.text,
                timestamp: formatTimeAgo(new Date(post.postDetail.createdAt)),
                likes: post.postDetail.likeCount,
                retweets: post.postDetail.retweetCount,
                replies: post.postDetail.replyCount,
                postUrl: post.postDetail.url,
                hasReplied: post.hasreplied,
                postedReply: post.postedReply || "",
              }));
            setPosts(transformedPosts);
          }
        } else {
          setError(response.data.message || "Failed to fetch workspace data");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId && token) {
      fetchWorkspaceData();
    }
  }, [workspaceId, token]);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 604800)}w ago`;
    return date.toLocaleDateString();
  };

  const handleReplyChange = useCallback(
    debounce((postId, value) => {
      if (value.length <= 200) {
        setNewReply((prev) => ({ ...prev, [postId]: value }));
      }
    }, 50),
    []
  );

  const handleReplyInputChange = (postId, value) => {
    const truncatedValue = value.slice(0, 200);
    handleReplyChange(postId, truncatedValue);
    setNewReply((prev) => ({ ...prev, [postId]: truncatedValue }));
  };

  const handleSuggestReply = async (postId) => {
    setIsGeneratingSuggestion((prev) => ({ ...prev, [postId]: true }));

    try {
      const post = posts.find((p) => p.id === postId);

      // Get API key from environment variable
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

      // Verify API key exists
      if (!apiKey) {
        throw new Error(
          "Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file."
        );
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      const prompt = `Generate a professional, engaging reply to this social media post. The reply should be relevant to the post content, sound natural, and be no more than 200 characters in length. The post is: "${post.content}"`;

      const result = await model.generateContent(prompt);
      let suggestion = result.response.text();

      if (suggestion.length > 200) {
        suggestion = suggestion.substring(0, 197) + "...";
      }

      setNewReply((prev) => ({ ...prev, [postId]: suggestion }));
      setShowReplyField((prev) => ({ ...prev, [postId]: true }));
    } catch (error) {
      console.error("Error generating suggestion:", error);
      alert(
        error.message ||
          "Failed to generate reply. Please check your API configuration and try again."
      );
    } finally {
      setIsGeneratingSuggestion((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleReplyClick = (postId) => {
    setCurrentPostId(postId);
    setIsDialogOpen(true);
    if (connectedAccounts.length === 1 && !selectedAccounts[postId]) {
      setSelectedAccounts((prev) => ({
        ...prev,
        [postId]: [connectedAccounts[0].userId],
      }));
    }
  };

  const toggleAccountSelection = (postId, accountId) => {
    const currentSelected = selectedAccounts[postId] || [];
    setSelectedAccounts((prev) => ({
      ...prev,
      [postId]: currentSelected.includes(accountId)
        ? currentSelected.filter((id) => id !== accountId)
        : [...currentSelected, accountId],
    }));
  };

  const handleSubmitReply = async (postId) => {
    if (newReply[postId]?.trim()) {
      try {
        const accountsToUse =
          connectedAccounts.length === 1
            ? [connectedAccounts[0].userId]
            : selectedAccounts[postId] || [];

        if (accountsToUse.length === 0) return;

        const replyPromises = accountsToUse.map((accountId) =>
          axios.post(
            `https://api.bot.thesquirrel.tech/workspace/boost-engagement/reply/`,
            {
              tweetId: postId,
              accountId,
              replyText: newReply[postId],
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        );

        await Promise.all(replyPromises);

        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, hasReplied: true, postedReply: newReply[postId] }
              : post
          )
        );

        setNewReply((prev) => ({ ...prev, [postId]: "" }));
        setShowReplyField((prev) => ({ ...prev, [postId]: false }));
        setIsDialogOpen(false);
        setSelectedAccounts((prev) => ({ ...prev, [postId]: [] }));
      } catch (error) {
        console.error("Error posting reply:", error);
        alert("Failed to post reply. Please try again.");
      }
    }
  };

  const handleConnectTwitter = () => connectTwitter(workspaceId, router, token);
  const handleConnectLinkedin = () =>
    connectLinkedin(workspaceId, router, token);
  const handleVisitProfile = (profileUrl) => window.open(profileUrl, "_blank");
  const handleVisitPost = (postUrl) => window.open(postUrl, "_blank");

  if (loading) return <CustomLoader />;
  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-navBg text-white">
        <div className="text-red-500 text-xl mb-4">Error</div>
        <div className="text-gray-300">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary rounded-md hover:bg-orange-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div
      style={{ backgroundColor: colors.navBg }}
      className="h-full w-full"
    >
      <div className="py-6 px-4 border-b border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-2">Boost Engagement</h2>
        <p className="text-gray-400">
          Optimize your social media engagement with AI-powered reply
          suggestions
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="py-8 !w-full px-4">
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div key={post.id} style={{ backgroundColor: colors.cardBg }} className="rounded-xl shadow-lg border border-gray-800 overflow-hidden h-fit">
                <div className="p-4">
                  <div className="flex items-start space-x-3 mb-2">
                    <img 
                      src={post.avatar} 
                      alt={post.author} 
                      className="w-10 h-10 rounded-full cursor-pointer" 
                      onClick={() => handleVisitProfile(post.profileUrl)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex items-center cursor-pointer" 
                          onClick={() => handleVisitProfile(post.profileUrl)}
                        >
                          <p className="font-bold text-white">{post.author}</p>
                          <p className="text-gray-500 text-sm ml-1">{post.username} · {post.timestamp}</p>
                        </div>
                        <button 
                          className="text-gray-400 hover:text-gray-300"
                          onClick={() => handleVisitPost(post.postUrl)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 mt-2">
                    <p className="text-white text-sm">{post.content}</p>
                  </div>

                  <div className="flex justify-between text-gray-400 text-xs mt-10 mb-1">
                    <div className="flex items-center space-x-1 hover:text-blue-400 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{post.replies}</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-green-400 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>{post.retweets}</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-red-400 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-blue-400 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </div>
                  </div>

                  {post.hasReplied && (
                    <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                      <p className="text-gray-300 text-xs">
                        <span className="text-orange-400 font-medium">Your reply: </span>
                        {post.postedReply}
                      </p>
                    </div>
                  )}
                  
                  {!post.hasReplied && (
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => handleSuggestReply(post.id)}
                        className="flex items-center justify-center text-xs text-gray-300 hover:text-orange-400 bg-gray-800 hover:bg-gray-700 rounded-full px-4 py-1.5 w-fit"
                        disabled={isGeneratingSuggestion[post.id]}
                      >
                        {isGeneratingSuggestion[post.id] ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-orange-500 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>Suggest Reply</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {!post.hasReplied && showReplyField[post.id] && (
                  <div className="bg-[#141618] p-3 flex flex-col">
                    <div className="flex items-center">
                      <div className="flex-1 relative">
                        <textarea
                          value={newReply[post.id] || ''}
                          onChange={(e) => handleReplyInputChange(post.id, e.target.value)}
                          placeholder="Post your reply..."
                          className="w-full bg-[#090a0b] border border-gray-700 rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500 no-scrollbar text-sm"
                          rows="4"
                          resize="none"
                          autoFocus
                          maxLength={100}
                        />
                        <div className="absolute bottom-1 right-3 text-xs text-gray-500">
                          {(newReply[post.id] || '').length}/200
                        </div>
                      </div>
                      <div className="flex items-center ml-2">
                        <button
                          onClick={() => handleReplyClick(post.id)}
                          style={{ backgroundColor: colors.primary }}
                          className="text-white font-medium rounded-xl px-4 py-1.5"
                          disabled={!newReply[post.id]?.trim()}
                        >
                          Reply
                        </button>
                      </div>
                    </div>

                    <Dialog open={isDialogOpen && currentPostId === post.id} onOpenChange={setIsDialogOpen}>
                      <DialogContent className="w-[90%] md:w-[60vw] md:max-w-[60vw] h-1/2 py-12 bg-headerBg space-y-6 border-transparent gap-2 flex flex-col items-center justify-center">
                        {connectedAccounts.length === 0 ? (
                          <>
                            <DialogTitle className="text-3xl text-white">
                              No Accounts To Connect
                            </DialogTitle>
                            <div className="w-[60%] p-4 grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-5">
                              <button
                                onClick={handleConnectTwitter}
                                className="py-6 rounded-2xl w-full cursor-pointer mx-auto px-5 flex items-center justify-start gap-3 bg-navBg !text-white"
                              >
                                <img src="/twitter.png" alt="Twitter" className="w-4 h-4 mr-1" />
                                Connect X
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <DialogTitle className="text-3xl text-white">
                              Select Account(s)
                            </DialogTitle>
                            <div className="w-[60%] p-4">
                              <div className="flex flex-col space-y-2 max-h-32 overflow-y-auto">
                                {connectedAccounts.map(account => (
                                  <div key={account.userId} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      id={`account-${account.userId}`}
                                      checked={(selectedAccounts[post.id] || []).includes(account.userId)}
                                      onChange={() => toggleAccountSelection(post.id, account.userId)}
                                      className="mr-2"
                                    />
                                    <label htmlFor={`account-${account.userId}`} className="text-gray-300 text-xs">
                                      @{account.username}
                                    </label>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3 flex justify-end">
                                <button
                                  onClick={() => setIsDialogOpen(false)}
                                  className="text-gray-400 text-xs mr-2"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSubmitReply(post.id)}
                                  disabled={connectedAccounts.length > 1 && !(selectedAccounts[post.id]?.length > 0)}
                                  style={{ backgroundColor: (connectedAccounts.length === 1 || selectedAccounts[post.id]?.length > 0) ? colors.primary : 'rgba(255, 102, 0, 0.5)' }}
                                  className="text-white text-xs px-3 py-1 rounded-lg"
                                >
                                  Post Reply
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            ))}
          </div> */}

          <ResponsiveMasonry
            style={{width: "100%"}}
            className="!w-full "
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 2 }}
          >
            <Masonry  gutter="16px" className="!w-full ">
              {posts.map((post) => (
                <div key={post.id} style={{ backgroundColor: colors.cardBg }} className="rounded-xl shadow-lg border border-gray-800 overflow-hidden h-fit w-full">
                <div className="p-4">
                  <div className="flex items-start space-x-3 mb-2">
                    <img 
                      src={post.avatar} 
                      alt={post.author} 
                      className="w-10 h-10 rounded-full cursor-pointer" 
                      onClick={() => handleVisitProfile(post.profileUrl)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div 
                          className="flex items-center cursor-pointer" 
                          onClick={() => handleVisitProfile(post.profileUrl)}
                        >
                          <p className="font-bold text-white">{post.author}</p>
                          <p className="text-gray-500 text-sm ml-1">{post.username} · {post.timestamp}</p>
                        </div>
                        <button 
                          className="text-gray-400 hover:text-gray-300"
                          onClick={() => handleVisitPost(post.postUrl)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 mt-2">
                    <p className="text-white text-sm">{post.content}</p>
                  </div>

                  <div className="flex justify-between text-gray-400 text-xs mt-10 mb-1">
                    <div className="flex items-center space-x-1 hover:text-blue-400 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{post.replies}</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-green-400 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>{post.retweets}</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-red-400 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1 hover:text-blue-400 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </div>
                  </div>

                  {post.hasReplied && (
                    <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                      <p className="text-gray-300 text-xs">
                        <span className="text-orange-400 font-medium">Your reply: </span>
                        {post.postedReply}
                      </p>
                    </div>
                  )}
                  
                  {!post.hasReplied && (
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => handleSuggestReply(post.id)}
                        className="flex items-center justify-center text-xs text-gray-300 hover:text-orange-400 bg-gray-800 hover:bg-gray-700 rounded-full px-4 py-1.5 w-fit"
                        disabled={isGeneratingSuggestion[post.id]}
                      >
                        {isGeneratingSuggestion[post.id] ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-orange-500 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>Suggest Reply</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {!post.hasReplied && showReplyField[post.id] && (
                  <div className="bg-[#141618] p-3 flex flex-col">
                    <div className="flex items-center">
                      <div className="flex-1 relative">
                        <textarea
                          value={newReply[post.id] || ''}
                          onChange={(e) => handleReplyInputChange(post.id, e.target.value)}
                          placeholder="Post your reply..."
                          className="w-full bg-[#090a0b] border border-gray-700 rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent text-white placeholder-gray-500 no-scrollbar text-sm"
                          rows="4"
                          resize="none"
                          autoFocus
                          maxLength={100}
                        />
                        <div className="absolute bottom-1 right-3 text-xs text-gray-500">
                          {(newReply[post.id] || '').length}/200
                        </div>
                      </div>
                      <div className="flex items-center ml-2">
                        <button
                          onClick={() => handleReplyClick(post.id)}
                          style={{ backgroundColor: colors.primary }}
                          className="text-white font-medium rounded-xl px-4 py-1.5"
                          disabled={!newReply[post.id]?.trim()}
                        >
                          Reply
                        </button>
                      </div>
                    </div>

                    <Dialog open={isDialogOpen && currentPostId === post.id} onOpenChange={setIsDialogOpen}>
                      <DialogContent className="w-[90%] md:w-[60vw] md:max-w-[60vw] h-1/2 py-12 bg-headerBg space-y-6 border-transparent gap-2 flex flex-col items-center justify-center">
                        {connectedAccounts.length === 0 ? (
                          <>
                            <DialogTitle className="text-3xl text-white">
                              No Accounts To Connect
                            </DialogTitle>
                            <div className="w-[60%] p-4 grid grid-cols-1 lg:grid-cols-2 items-center justify-center gap-5">
                              <button
                                onClick={handleConnectTwitter}
                                className="py-6 rounded-2xl w-full cursor-pointer mx-auto px-5 flex items-center justify-start gap-3 bg-navBg !text-white"
                              >
                                <img src="/twitter.png" alt="Twitter" className="w-4 h-4 mr-1" />
                                Connect X
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <DialogTitle className="text-3xl text-white">
                              Select Account(s)
                            </DialogTitle>
                            <div className="w-[60%] p-4">
                              <div className="flex flex-col space-y-2 max-h-32 overflow-y-auto">
                                {connectedAccounts.map(account => (
                                  <div key={account.userId} className="py-6 rounded-2xl w-full cursor-pointer mx-auto px-5 flex items-center justify-start gap-3 bg-navBg !text-white">
                                    <input
                                      type="checkbox"
                                      id={`account-${account.userId}`}
                                      checked={(selectedAccounts[post.id] || []).includes(account.userId)}
                                      onChange={() => toggleAccountSelection(post.id, account.userId)}
                                      className="mr-2"
                                    />
                                    <label htmlFor={`account-${account.userId}`} className="text-gray-300 text-xs">
                                      @{account.username}
                                    </label>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-3 flex justify-end">
                                <button
                                  onClick={() => setIsDialogOpen(false)}
                                  className="text-gray-400 text-xs mr-2"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSubmitReply(post.id)}
                                  disabled={connectedAccounts.length > 1 && !(selectedAccounts[post.id]?.length > 0)}
                                  style={{ backgroundColor: (connectedAccounts.length === 1 || selectedAccounts[post.id]?.length > 0) ? colors.primary : 'rgba(255, 102, 0, 0.5)' }}
                                  className="text-white text-xs px-3 py-1 rounded-lg"
                                >
                                  Post Reply
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-lg mb-2">No posts found</p>
          <p className="text-sm text-gray-500">
            Connect your social accounts or set up relevant keywords to monitor
            conversations
          </p>
        </div>
      )}
    </div>
  );
}
