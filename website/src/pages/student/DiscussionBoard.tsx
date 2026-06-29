import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Plus, Search, Tag, X, Sparkles, ChevronLeft, MessageSquare, Award, Info } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';

export const DiscussionBoard: React.FC = () => {
  const {
    submissions,
    comments,
    users,
    assignments,
    lessons,
    activeUser,
    addComment,
    upvoteComment,
    verifyComment,
    topics,
    discussionPosts,
    addTopic,
    addDiscussionPost,
    upvoteDiscussionPost,
    upvoteSubmission
  } = useDatabase();

  // Selected Topic (All or Topic ID)
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'upvotes'>('newest');

  // Topic Creation Dialog (Admin only)
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');

  // Post Creation Dialog
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTag, setNewPostTag] = useState<string>('');

  const isUserAdmin = activeUser.role === 'admin' || activeUser.role === 'mentor';
  const isAdminMode = isUserAdmin;

  const handleTopicChange = (topicId: string) => {
    setSelectedTopicId(topicId);
    setActiveThreadId(null);
    setCommentInput('');
    setSearchQuery('');
    setSelectedLessonId('all');
    setIsAddingPost(false);
  };

  const handleAddTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim() || !newTopicDesc.trim()) return;
    addTopic(newTopicName.trim(), newTopicDesc.trim());
    setNewTopicName('');
    setNewTopicDesc('');
    setIsAddingTopic(false);
  };

  const handleAddPostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    
    // Determine tags
    const tagsList: string[] = [];
    if (newPostTag) {
      const les = lessons.find(l => l.id === newPostTag);
      if (les) {
        tagsList.push(les.title.split(':')[0]); // e.g. "Buổi 1"
      } else {
        tagsList.push(newPostTag);
      }
    } else {
      tagsList.push('Hỏi đáp');
    }

    // Default to 'topic-light-support' if All is active, or use selectedTopicId
    const targetTopicId = selectedTopicId === 'all' ? 'topic-light-support' : selectedTopicId;
    
    addDiscussionPost(targetTopicId, newPostTitle.trim(), newPostContent.trim(), tagsList);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostTag('');
    setIsAddingPost(false);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThreadId || !commentInput.trim()) return;
    addComment(activeThreadId, commentInput);
    setCommentInput('');
  };

  // Helper to format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  // Helper to render next lesson reminder (mimics live notice in Skool)
  const getNextLessonNotice = () => {
    const futureLessons = lessons.filter(l => l.start_date && new Date(l.start_date).getTime() > Date.now());
    if (futureLessons.length === 0) return null;
    futureLessons.sort((a, b) => {
      const aTime = a.start_date ? new Date(a.start_date).getTime() : 0;
      const bTime = b.start_date ? new Date(b.start_date).getTime() : 0;
      return aTime - bTime;
    });
    const nextLes = futureLessons[0];
    if (!nextLes.start_date) return null;
    const diffTime = new Date(nextLes.start_date).getTime() - Date.now();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `📅 Live Session: ${nextLes.title} sẽ lên sóng trong ${diffDays} ngày tới.`;
  };

  // Compile list of threads based on active topic and filters
  let filteredThreads: any[] = [];

  // 1. Gather all assignment submissions
  const assgSubmissions = submissions.filter(s => s.status !== 'draft');
  const assignmentThreads = assgSubmissions.map(sub => {
    const authorObj = users.find(u => u.id === sub.student_id);
    const assg = assignments.find(a => a.id === sub.assignment_id);
    const les = assg ? lessons.find(l => l.id === assg.lesson_id) : null;
    const countComments = comments.filter(c => c.submission_id === sub.id).length;
    
    return {
      id: sub.id,
      topic_id: 'topic-assignments',
      topic_name: 'Assignments 📝',
      author_id: sub.student_id,
      author: authorObj,
      title: `${authorObj?.full_name} - Nộp bài tập ${les?.title.split(':')[0] || ''}`,
      content: sub.content,
      created_at: sub.created_at,
      upvotes_count: sub.upvotes_count || 0,
      upvoted_by: sub.upvoted_by || [],
      comment_count: countComments,
      lesson_id: les?.id,
      lesson_title: les?.title,
      is_assignment: true,
      status: sub.status,
      tags: [les?.title.split(':')[0] || 'Bài tập']
    };
  });

  // 2. Gather all general discussion posts
  const customThreads = discussionPosts.map(post => {
    const authorObj = users.find(u => u.id === post.author_id);
    const topicObj = topics.find(t => t.id === post.topic_id);
    const countComments = comments.filter(c => c.submission_id === post.id).length;
    
    let lessonId = 'all';
    if (post.tags && post.tags.length > 0) {
      const matchingLesson = lessons.find(l => post.tags.some(t => l.title.includes(t)));
      if (matchingLesson) lessonId = matchingLesson.id;
    }

    return {
      id: post.id,
      topic_id: post.topic_id,
      topic_name: topicObj ? `${topicObj.name} ${post.topic_id === 'topic-light-support' ? '🛟' : '⛵'}` : 'Thảo luận',
      author_id: post.author_id,
      author: authorObj,
      title: post.title,
      content: post.content,
      created_at: post.created_at,
      upvotes_count: post.upvotes_count,
      upvoted_by: post.upvoted_by || [],
      comment_count: countComments,
      tags: post.tags || [],
      lesson_id: lessonId,
      is_assignment: false
    };
  });

  // Unify
  filteredThreads = [...assignmentThreads, ...customThreads];

  // Filter by Topic Pill
  if (selectedTopicId !== 'all') {
    filteredThreads = filteredThreads.filter(t => t.topic_id === selectedTopicId);
  }

  // Filter by Search Query
  filteredThreads = filteredThreads.filter(t => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      (t.author?.full_name || '').toLowerCase().includes(query) ||
      (t.author?.gmail || '').toLowerCase().includes(query) ||
      (t.title || '').toLowerCase().includes(query) ||
      (t.content || '').toLowerCase().includes(query);
      
    let matchesLesson = true;
    if (selectedLessonId !== 'all') {
      if (t.is_assignment) {
        matchesLesson = t.lesson_id === selectedLessonId;
      } else {
        const selectedLessonObj = lessons.find(l => l.id === selectedLessonId);
        if (selectedLessonObj) {
          const lessonNumber = selectedLessonObj.title.split(':')[0]; // e.g. "Buổi 1"
          matchesLesson = t.tags.some((tag: string) => tag.includes(lessonNumber));
        }
      }
    }
    
    return matchesSearch && matchesLesson;
  });

  // Sort
  filteredThreads.sort((a, b) => {
    // Pinning system (keep Sparrow help post and general tips post pinned at the top)
    const isPinnedA = a.id === 'post-help-1' || a.id === 'post-general-1';
    const isPinnedB = b.id === 'post-help-1' || b.id === 'post-general-1';
    if (isPinnedA && !isPinnedB) return -1;
    if (!isPinnedA && isPinnedB) return 1;

    if (sortBy === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      return b.upvotes_count - a.upvotes_count;
    }
  });

  // Active thread details
  const activeThread = filteredThreads.find(t => t.id === activeThreadId);
  const threadComments = activeThread ? comments.filter(c => c.submission_id === activeThread.id) : [];

  // Leaderboard Calculation (Students with most Nautical Miles)
  const studentRankings = users
    .filter(u => u.role === 'student')
    .sort((a, b) => (b.nautical_miles || 0) - (a.nautical_miles || 0))
    .slice(0, 4);

  const getRankBadge = (idx: number) => {
    if (idx === 0) return '🥇';
    if (idx === 1) return '🥈';
    if (idx === 2) return '🥉';
    return '⚓';
  };

  const getRoleLabel = (role?: string) => {
    if (role === 'admin') return 'Thuyền trưởng';
    if (role === 'mentor') return 'Sĩ quan';
    return 'Thủy thủ';
  };

  const getRoleBadgeClass = (role?: string) => {
    if (role === 'admin') return 'bg-red-50 text-red-700 border-red-100';
    if (role === 'mentor') return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-[#214C54]/5 text-[#214C54] border-[#214C54]/10';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in select-none">
      <PageHeader
        title="Hội quán thảo luận"
        description="Không gian trao đổi kiến thức, hỏi đáp và hỗ trợ lẫn nhau của thủy thủ đoàn."
        helpTitle="Discussions Tavern"
        helpSummary="Thảo luận chéo, hỏi đáp hỗ trợ và tặng Kudos công nhận bài tập xuất sắc của đồng đội."
        helpPurpose="Xây dựng văn hóa tương trợ, cọ xát góc nhìn thực tế và cùng vượt qua giông bão bài tập."
      />

      {/* Skool 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-[calc(100vh-210px)] overflow-hidden">
        
        {/* Left Column: Feed Content & Detail (8 cols) */}
        <div className="lg:col-span-8 flex flex-col h-full overflow-hidden bg-transparent">
          
          {!activeThread ? (
            // ==================== FEED VIEW ====================
            <div className="flex-1 overflow-y-auto space-y-4 pb-6 pr-1 custom-scrollbar">
              
              {/* 1. "Write something" input card */}
              <div 
                onClick={() => setIsAddingPost(true)}
                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-3 cursor-pointer hover:border-gray-300 transition-all"
              >
                <img
                  src={activeUser.avatar_url}
                  alt={activeUser.full_name}
                  className="w-9 h-9 rounded-full object-cover border border-gray-150"
                />
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-400 font-semibold select-none">
                  Viết điều gì đó thảo luận với đồng đội...
                </div>
              </div>

              {/* 2. Live Q&A / Upcoming class Notice */}
              {getNextLessonNotice() && (
                <div className="text-center bg-[#214C54]/5 text-[#214C54] text-[11px] font-bold py-2 px-4 rounded-xl border border-[#214C54]/10">
                  {getNextLessonNotice()}
                </div>
              )}

              {/* 3. Horizontal scrolling category pills */}
              <div className="flex justify-between items-center gap-4 bg-transparent pt-1">
                <div className="flex-1 flex gap-2 overflow-x-auto py-1 custom-scrollbar scrollbar-none">
                  {/* "Tất cả" Pill */}
                  <button
                    onClick={() => handleTopicChange('all')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all border ${
                      selectedTopicId === 'all'
                        ? 'bg-[#15333B] text-white border-[#15333B] shadow-sm'
                        : 'bg-white text-[#3E5E63] border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Tất cả
                  </button>

                  {/* Topic Pills */}
                  {topics.map(topic => {
                    const isActive = topic.id === selectedTopicId;
                    let iconStr = "💬";
                    if (topic.id === 'topic-light-support') iconStr = "🛟";
                    if (topic.id === 'topic-assignments') iconStr = "📝";
                    if (topic.id === 'topic-general') iconStr = "⛵";

                    return (
                      <button
                        key={topic.id}
                        onClick={() => handleTopicChange(topic.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all border flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-[#15333B] text-white border-[#15333B] shadow-sm'
                            : 'bg-white text-[#3E5E63] border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span>{iconStr}</span>
                        <span>{topic.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Admin add topic pill */}
                  {isUserAdmin && (
                    <button
                      onClick={() => setIsAddingTopic(true)}
                      className="p-1.5 rounded-full bg-white border border-gray-200 text-[#214C54] hover:bg-gray-50 transition-colors shadow-sm"
                      title="Thêm phòng thảo luận mới"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Filter / Sort Control */}
                  <button
                    onClick={() => setSortBy(sortBy === 'newest' ? 'upvotes' : 'newest')}
                    className="flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-full border border-gray-200 bg-white text-[#3E5E63] hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <span>{sortBy === 'newest' ? '📅 Mới nhất' : '🔥 Kudos/Up'}</span>
                  </button>
                </div>
              </div>

              {/* Sub-filtering Panel */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm bài đăng hoặc tác giả..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control text-xs w-full pl-9 pr-4 py-2 bg-white"
                  />
                </div>
                
                <select
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(e.target.value)}
                  className="form-control text-xs font-bold px-3 py-2 bg-white border-gray-200 text-[#15333B]"
                >
                  <option value="all">Lọc theo buổi học</option>
                  {lessons.map(les => (
                    <option key={les.id} value={les.id}>
                      {les.title.split(':')[0]}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Posts Cards List */}
              <div className="space-y-4">
                {filteredThreads.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl space-y-3">
                    <span className="text-4xl block">⛵</span>
                    <p className="text-xs font-semibold text-gray-400 max-w-sm mx-auto px-4">
                      Hội quán trống trơn. Hãy là người đầu tiên đặt câu hỏi hỗ trợ hoặc nộp bài tập để tạo luồng thảo luận!
                    </p>
                  </div>
                ) : (
                  filteredThreads.map(thread => {
                    const isPinned = thread.id === 'post-help-1' || thread.id === 'post-general-1';
                    const threadComments = comments.filter(c => c.submission_id === thread.id);
                    const uniqueCommenterIds = Array.from(new Set(threadComments.map(c => c.author_id)));
                    const commenterAvatars = uniqueCommenterIds
                      .map(id => users.find(u => u.id === id)?.avatar_url)
                      .filter(Boolean);

                    return (
                      <div
                        key={thread.id}
                        className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                      >
                        {/* Pinned Soft Gold Banner */}
                        {isPinned && (
                          <div className="bg-[#FDF5DA] border-b border-[#EAB308]/20 px-4 py-1.5 flex justify-between items-center text-[10px] font-bold text-[#854D0E]">
                            <span className="flex items-center gap-1">📌 Được ghim bởi Thuyền trưởng</span>
                          </div>
                        )}

                        <div className="p-5 space-y-3">
                          {/* Card Header */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={thread.author?.avatar_url}
                                alt={thread.author?.full_name}
                                className="w-8 h-8 rounded-full object-cover border border-gray-150"
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-extrabold text-[#15333B]">{thread.author?.full_name}</span>
                                  <span className={`text-[7px] font-bold px-1 py-0.2 rounded border ${getRoleBadgeClass(thread.author?.role)}`}>
                                    {getRoleLabel(thread.author?.role)}
                                  </span>
                                </div>
                                <span className="text-[9px] text-gray-400 block font-medium mt-0.5">
                                  {formatDate(thread.created_at)} • trong <span className="text-[#214C54] font-bold">{thread.topic_name}</span>
                                </span>
                              </div>
                            </div>

                            <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded ${
                              thread.is_assignment 
                                ? (thread.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800')
                                : 'bg-blue-50 text-blue-800'
                            }`}>
                              {thread.is_assignment 
                                ? (thread.status === 'graded' ? 'Graded' : 'Pending')
                                : 'Discussion'
                              }
                            </span>
                          </div>

                          {/* Card Body */}
                          <div 
                            onClick={() => {
                              setActiveThreadId(thread.id);
                              setCommentInput('');
                            }}
                            className="flex gap-4 cursor-pointer group"
                          >
                            <div className="flex-1 space-y-1.5">
                              <h3 className="text-sm font-black text-[#15333B] group-hover:text-[#214C54] transition-colors leading-snug">
                                {thread.title}
                              </h3>
                              <p className="text-xs text-[#3E5E63] font-medium leading-relaxed line-clamp-3">
                                {thread.content}
                              </p>
                            </div>

                            {/* Right side Thumbnail mimicking Skool play widget */}
                            <div className="hidden sm:flex items-center justify-center bg-gray-50 border border-gray-150 rounded-xl p-3 w-28 h-20 shrink-0">
                              <div className="text-center space-y-1">
                                <span className="text-xl block">{thread.is_assignment ? '📝' : '💡'}</span>
                                <span className="text-[8px] font-extrabold text-[#3E5E63] uppercase block tracking-wider font-mono">
                                  {thread.is_assignment ? 'PRD / CODE' : 'TIPS / Q&A'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Card Footer Actions */}
                          <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => thread.is_assignment ? upvoteSubmission(thread.id) : upvoteDiscussionPost(thread.id)}
                                className={`flex items-center gap-1.5 text-xs font-bold transition-all px-2.5 py-1 rounded-xl border ${
                                  thread.upvoted_by.includes(activeUser.id)
                                    ? 'bg-[#214C54]/5 text-[#214C54] border-[#214C54]'
                                    : 'text-gray-400 border-transparent hover:border-gray-200'
                                }`}
                              >
                                <span>{thread.is_assignment ? '👏' : '👍'}</span>
                                <span className="text-xs text-[#15333B]">{thread.upvotes_count}</span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveThreadId(thread.id);
                                  setCommentInput('');
                                }}
                                className="flex items-center gap-1.5 text-xs font-bold text-gray-400 border border-transparent hover:border-gray-200 px-2.5 py-1 rounded-xl"
                              >
                                <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-xs text-[#15333B]">{thread.comment_count}</span>
                              </button>
                            </div>

                            {/* Commenters overlap avatars */}
                            {commenterAvatars.length > 0 && (
                              <div className="flex items-center gap-1.5">
                                <div className="flex -space-x-1.5 overflow-hidden">
                                  {commenterAvatars.slice(0, 3).map((url, idx) => (
                                    <img
                                      key={idx}
                                      src={url}
                                      alt=""
                                      className="inline-block h-5.5 w-5.5 rounded-full ring-2 ring-white object-cover"
                                    />
                                  ))}
                                </div>
                                <span className="text-[9px] text-[#214C54] font-bold">
                                  Mới bình luận
                                </span>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          ) : (
            // ==================== DETAIL VIEW ====================
            <div className="flex-1 overflow-y-auto space-y-4 pb-6 pr-1 custom-scrollbar bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              {/* Back to feed button */}
              <button
                onClick={() => setActiveThreadId(null)}
                className="flex items-center gap-1 text-xs font-extrabold text-[#214C54] hover:text-[#15333B] transition-colors mb-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Quay lại danh sách
              </button>

              {/* Thread Header */}
              <div className="flex justify-between items-center border-b border-gray-150 pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={activeThread.author?.avatar_url}
                    alt={activeThread.author?.full_name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-[#15333B]">{activeThread.author?.full_name}</h4>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${getRoleBadgeClass(activeThread.author?.role)}`}>
                        {getRoleLabel(activeThread.author?.role)}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {activeThread.is_assignment ? 'Bài nộp bài tập' : 'Bài thảo luận'} • {new Date(activeThread.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1">
                  {activeThread.is_assignment ? (
                    <span className="text-[9px] font-bold bg-[#214C54]/10 text-[#214C54] px-2.5 py-1 rounded-lg flex items-center gap-0.5">
                      <Tag className="w-2.5 h-2.5" />
                      {activeThread.lesson_title ? activeThread.lesson_title.split(':')[0] : 'Bài tập'}
                    </span>
                  ) : (
                    activeThread.tags?.map((t: string) => (
                      <span key={t} className="text-[9px] font-bold bg-gray-100 text-[#3E5E63] px-2.5 py-1 rounded-lg flex items-center gap-0.5 border border-gray-150">
                        <Tag className="w-2.5 h-2.5" />
                        {t}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Thread Main Content */}
              <div className="space-y-4 py-4">
                <h3 className="text-base font-black text-[#15333B]">
                  {activeThread.title}
                </h3>
                <p className="text-xs text-[#3E5E63] leading-relaxed font-mono whitespace-pre-wrap break-words bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  {activeThread.content}
                </p>
              </div>

              {/* Thread Interaction (Kudos / Upvote) */}
              {activeThread.is_assignment ? (
                <div className="flex items-center justify-between p-3.5 bg-[#FDF5DA] border border-[#EAB308]/20 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-[#15333B] block">Gửi Kudos động viên đồng đội! 👏</span>
                    <span className="text-[9px] text-gray-500 font-semibold block">Tặng Kudos sẽ thưởng +15 hải lý cho đồng đội.</span>
                  </div>
                  <button
                    onClick={() => upvoteSubmission(activeThread.id)}
                    className={`flex items-center gap-1 text-[11px] font-extrabold px-3 py-1.5 rounded-xl border transition-all ${
                      activeThread.upvoted_by.includes(activeUser.id)
                        ? 'bg-[#EAB308] text-[#15333B] border-[#EAB308] shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>👏 Kudos</span>
                    <span>{activeThread.upvotes_count}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3.5 bg-[#214C54]/5 border border-[#214C54]/10 rounded-xl">
                  <div>
                    <span className="text-xs font-bold text-[#15333B] block">Thấy bài viết hữu ích? 👍</span>
                    <span className="text-[9px] text-gray-500 font-semibold block">Bấm upvote để đẩy bài viết lên và khích lệ đồng đội.</span>
                  </div>
                  <button
                    onClick={() => upvoteDiscussionPost(activeThread.id)}
                    className={`flex items-center gap-1 text-[11px] font-extrabold px-3 py-1.5 rounded-xl border transition-all ${
                      activeThread.upvoted_by.includes(activeUser.id)
                        ? 'bg-[#214C54] text-white border-[#214C54] shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>👍 Upvote</span>
                    <span>{activeThread.upvotes_count}</span>
                  </button>
                </div>
              )}

              {/* Comments List Section */}
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Thảo luận ({threadComments.length}):</span>

                {threadComments.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50/20 rounded-xl border border-dashed border-gray-200">
                    <span className="text-2xl block">🍃</span>
                    <p className="text-xs text-gray-400 font-semibold mt-1">Chưa có bình luận. Hãy mở bát thảo luận ngay!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {threadComments.map((comment) => {
                      const commenter = users.find(u => u.id === comment.author_id);
                      const hasUpvoted = (comment.upvoted_by || []).includes(activeUser.id);

                      return (
                        <div 
                          key={comment.id} 
                          className={`p-4 rounded-xl border transition-all ${
                            comment.is_verified 
                              ? 'bg-[#FDF5DA] border-[#EAB308]/40 shadow-xs' 
                              : 'bg-white border-gray-150'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-1">
                            <div className="flex items-center gap-2.5">
                              <img src={commenter?.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover border border-gray-150" />
                              <div>
                                <span className="text-xs font-bold text-[#15333B] flex items-center gap-1">
                                  {commenter?.full_name}
                                  {comment.is_verified && <span title="Verified Mentor Tick" className="text-xs">🎖️</span>}
                                </span>
                                <span className="text-[9px] text-gray-400 block">{new Date(comment.created_at).toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => upvoteComment(comment.id)}
                                className={`flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-lg transition-all border ${
                                  hasUpvoted 
                                    ? 'bg-red-50 text-red-600 border-red-100' 
                                    : 'bg-white text-gray-400 border-gray-150 hover:bg-gray-50'
                                }`}
                              >
                                <span>❤️</span>
                                <span>{comment.upvotes_count}</span>
                              </button>

                              {isAdminMode && !comment.is_verified && (
                                <button
                                  onClick={() => verifyComment(comment.id)}
                                  className="flex items-center gap-1 text-[8px] font-extrabold bg-[#EAB308]/15 border border-[#EAB308]/30 text-[#854D0E] px-2 py-1 rounded-lg hover:bg-[#EAB308] hover:text-[#15333B] transition-all"
                                  title="Trao Tích Xanh & thưởng +200 Hải Lý"
                                >
                                  Duyệt 🎖️
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-[#3E5E63] font-semibold leading-relaxed mt-2.5 pl-8 whitespace-pre-wrap break-words">
                            {comment.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Comment Input */}
              <form onSubmit={handleSendComment} className="p-3 border-t border-gray-200 bg-gray-50 rounded-xl mt-6 flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Góp ý bài tập, hỗ trợ gỡ lỗi hoặc thảo luận..."
                  className="form-control text-xs flex-1 bg-white"
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary text-xs px-4 py-2 font-bold"
                >
                  Gửi 🚀
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar containing Leaderboard & Rules (4 cols) */}
        <div className="lg:col-span-4 hidden lg:flex flex-col gap-6 overflow-y-auto pr-1 h-full custom-scrollbar">
          
          {/* Sidebar Widget 1: Crew Leaderboard */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-1.5 border-b border-gray-100 pb-3">
              <Award className="w-4.5 h-4.5 text-[#EAB308]" />
              <h3 className="font-extrabold text-xs text-[#15333B] uppercase tracking-wider">
                Bảng xếp hạng thủy thủ
              </h3>
            </div>
            
            <div className="space-y-3.5">
              {studentRankings.map((student, idx) => {
                const isSelf = student.id === activeUser.id;
                return (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-2 rounded-xl transition-all border ${
                      isSelf 
                        ? 'bg-[#214C54]/5 border-[#214C54]/30' 
                        : 'border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold w-5 text-center shrink-0">
                        {getRankBadge(idx)}
                      </span>
                      <img
                        src={student.avatar_url}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover border border-gray-100"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#15333B] block leading-tight">
                          {student.full_name}
                        </span>
                        <span className="text-[9px] text-[#3E5E63] font-medium block">
                          {idx === 0 ? 'Thủy thủ xuất sắc' : 'Thành viên cốt cán'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-[#214C54] block">
                        {student.nautical_miles || 0}
                      </span>
                      <span className="text-[8px] font-extrabold uppercase text-gray-400 block tracking-wider">
                        Hải lý
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Widget 2: Tavern Rules */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-1.5 border-b border-gray-100 pb-3">
              <Info className="w-4 h-4 text-[#214C54]" />
              <h3 className="font-extrabold text-xs text-[#15333B] uppercase tracking-wider">
                Luật chơi hội quán
              </h3>
            </div>
            
            <ul className="space-y-2 text-[11px] text-[#3E5E63] font-semibold list-disc pl-4 leading-relaxed">
              <li>Mỗi bài nộp bài tập tự động mở ra một luồng thảo luận.</li>
              <li>Học viên tương trợ gỡ lỗi hoặc cho ý kiến xây dựng bài làm.</li>
              <li>Hãy tặng **Kudos 👏** cho bài tập bạn thấy ấn tượng để tặng họ +15 Hải Lý.</li>
              <li>Mentor duyệt **Tích Xanh 🎖️** cho câu trả lời hay sẽ thưởng lớn +200 Hải Lý.</li>
            </ul>
          </div>

        </div>

      </div>

      {/* Add Topic Inline Dialog (only when Admin clicks +, visible above all columns if overlay) */}
      {isAddingTopic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <span className="font-extrabold text-sm text-[#15333B] uppercase tracking-wider">Tạo phòng thảo luận mới</span>
              <button onClick={() => setIsAddingTopic(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddTopicSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase block">Tên phòng thảo luận</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Tech Support, Pitching..."
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  className="form-control text-xs w-full"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase block">Mô tả chi tiết</label>
                <textarea
                  placeholder="Mô tả mục đích và luật chơi trong phòng..."
                  value={newTopicDesc}
                  onChange={(e) => setNewTopicDesc(e.target.value)}
                  className="form-control text-xs w-full h-24 resize-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                <button type="button" onClick={() => setIsAddingTopic(false)} className="btn btn-secondary text-xs px-4">
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary text-xs px-5 font-bold">
                  Tạo phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Post Creation Modal */}
      {isAddingPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-up">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#EAB308]" />
                <span className="font-extrabold text-sm text-[#15333B] uppercase tracking-wider">Đăng bài viết mới</span>
              </div>
              <button
                onClick={() => setIsAddingPost(false)}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPostSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase block">Tiêu đề bài đăng</label>
                <input
                  type="text"
                  placeholder="Đặt tiêu đề rõ ràng, ví dụ: Lỗi Docker Desktop không kết nối..."
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="form-control text-xs w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase block">Chủ đề thảo luận (Pills)</label>
                  <select
                    value={selectedTopicId === 'all' ? 'topic-light-support' : selectedTopicId}
                    onChange={(e) => setSelectedTopicId(e.target.value)}
                    className="form-control text-xs w-full font-bold"
                  >
                    {topics.filter(t => t.id !== 'topic-assignments').map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase block">Liên kết tới Buổi học (Tag)</label>
                  <select
                    value={newPostTag}
                    onChange={(e) => setNewPostTag(e.target.value)}
                    className="form-control text-xs w-full font-bold"
                  >
                    <option value="">-- Chọn buổi học liên quan (Nếu có) --</option>
                    {lessons.map(les => (
                      <option key={les.id} value={les.id}>
                        {les.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase block">Nội dung chi tiết</label>
                <textarea
                  placeholder="Nhập nội dung câu hỏi, đính kèm log lỗi, hoặc mô tả rào cản bạn đang gặp..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="form-control text-xs w-full h-32 resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddingPost(false)}
                  className="btn btn-secondary text-xs px-4"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs px-5 font-bold flex items-center gap-1"
                >
                  <span>Đăng bài</span>
                  <span>🚀</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
