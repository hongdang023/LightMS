import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Plus, Search, Tag, X, Sparkles, ChevronLeft, MessageSquare, ThumbsUp } from 'lucide-react';
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
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'upvotes'>('newest');

  // Topic Creation Dialog (Admin only)
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');

  // Post Creation Dialog
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTag, setNewPostTag] = useState<string>('');
  const [newPostTopicId, setNewPostTopicId] = useState<string>('topic-onboarding');
  const [selectedMediaFiles, setSelectedMediaFiles] = useState<string[]>([]);

  const isUserAdmin = activeUser.role === 'admin' || activeUser.role === 'mentor';
  const isAdminMode = isUserAdmin;

  const renderFormattedContent = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-extrabold text-[#15333B]">{part.slice(2, -2)}</strong>;
        }
        // Match links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        if (urlRegex.test(part)) {
          const urlParts = part.split(urlRegex);
          return urlParts.map((urlPart, uIdx) => {
            if (urlRegex.test(urlPart)) {
              return (
                <a 
                  key={uIdx} 
                  href={urlPart} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[#214C54] hover:underline font-extrabold break-all inline-flex items-center gap-0.5"
                >
                  {urlPart} ↗
                </a>
              );
            }
            return urlPart;
          });
        }
        return part;
      });
      return (
        <div key={idx} className="min-h-[1.25rem]">
          {renderedLine}
        </div>
      );
    });
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedMediaFiles(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveMedia = (idxToRemove: number) => {
    setSelectedMediaFiles(prev => prev.filter((_, idx) => idx !== idxToRemove));
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
      tagsList.push(newPostTopicId === 'topic-onboarding' ? 'Onboarding' : 'Live Class');
    }

    addDiscussionPost(newPostTopicId, newPostTitle.trim(), newPostContent.trim(), tagsList, selectedMediaFiles);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostTag('');
    setSelectedMediaFiles([]);
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



  // Compile list of threads based on active topic and filters
  let filteredThreads: any[] = [];

  // 1. Gather all assignment submissions
  const assgSubmissions = submissions.filter(s => s.status !== 'draft');
  const assignmentThreads = assgSubmissions.map(sub => {
    const authorObj = users.find(u => u.id === sub.student_id);
    const assg = assignments.find(a => a.id === sub.assignment_id);
    const les = assg ? lessons.find(l => l.id === assg.lesson_id) : null;
    const countComments = comments.filter(c => c.submission_id === sub.id).length;
    
    const isOb = les ? (les.title.toLowerCase().includes('ngày') || les.title.toLowerCase().includes('onboarding')) : false;
    const topicId = isOb ? 'topic-onboarding' : 'topic-live-class';
    const topicNameStr = isOb ? 'Onboarding Week 👋' : 'Live Class 🎥';

    let parsedContent = sub.content;
    try {
      const parsed = JSON.parse(sub.content);
      if (parsed && typeof parsed === 'object' && parsed.url) {
        parsedContent = `⚓ **Thủy thủ:** ${authorObj?.full_name || 'Học viên'}
🔗 **Đường dẫn bài làm:** ${parsed.url}

💬 **Cảm nhận & Bài học rút ra:**
${parsed.reflection || 'Không có mô tả cảm nhận.'}`;
      }
    } catch (e) {
      parsedContent = `⚓ **Thủy thủ:** ${authorObj?.full_name || 'Học viên'}
🔗 **Đường dẫn bài làm:** ${sub.content}`;
    }

    const cleanTitle = les ? les.title.replace(/^Buổi\s+\d+\s*:\s*/i, '') : 'Bài tập';
    const lessonMatch = les ? les.title.match(/^Buổi\s+(\d+)/i) : null;
    const lessonNumberTag = lessonMatch ? `Buổi ${lessonMatch[1]}` : (les ? `Buổi ${les.order_index - 1}` : 'Bài tập');

    return {
      id: sub.id,
      topic_id: topicId,
      topic_name: topicNameStr,
      author_id: sub.student_id,
      author: authorObj,
      title: `Bài nộp: ${cleanTitle} - ${authorObj?.full_name || 'Học viên'}`,
      content: parsedContent,
      created_at: sub.created_at,
      upvotes_count: sub.upvotes_count || 0,
      upvoted_by: sub.upvoted_by || [],
      comment_count: countComments,
      lesson_id: les?.id,
      lesson_title: les?.title,
      is_assignment: true,
      status: sub.status,
      tags: ['Live Class', lessonNumberTag],
      media_urls: sub.media_urls || []
    };
  });

  // 2. Gather all general discussion posts
  const customThreads = discussionPosts.map(post => {
    const authorObj = users.find(u => u.id === post.author_id);
    const countComments = comments.filter(c => c.submission_id === post.id).length;
    
    let topicId = post.topic_id;
    if (topicId !== 'topic-onboarding' && topicId !== 'topic-live-class') {
      const hasObTag = post.tags && post.tags.some(t => t.toLowerCase().includes('ngày') || t.toLowerCase().includes('ob'));
      topicId = hasObTag ? 'topic-onboarding' : 'topic-live-class';
    }
    const topicNameStr = topicId === 'topic-onboarding' ? 'Onboarding Week 👋' : 'Live Class 🎥';

    let lessonId = 'all';
    if (post.tags && post.tags.length > 0) {
      const matchingLesson = lessons.find(l => post.tags.some(t => l.title.includes(t)));
      if (matchingLesson) lessonId = matchingLesson.id;
    }

    return {
      id: post.id,
      topic_id: topicId,
      topic_name: topicNameStr,
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
      is_assignment: false,
      media_urls: post.media_urls || []
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
    } else if (sortBy === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else {
      return b.upvotes_count - a.upvotes_count;
    }
  });

  // Active thread details
  const activeThread = filteredThreads.find(t => t.id === activeThreadId);
  const threadComments = activeThread ? comments.filter(c => c.submission_id === activeThread.id) : [];

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

      {/* Skool 1-Column Responsive Layout */}
      <div className="h-[calc(100vh-210px)] overflow-hidden">
        
        {/* Main Column: Feed Content & Detail */}
        <div className="flex flex-col h-full overflow-hidden bg-transparent">
          
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


              {/* 3. Filter & Sort Row (No Card Background, Single Row Layout) */}
              <div className="flex items-center justify-between gap-4 w-full bg-transparent p-0 border-none shadow-none mt-2">
                
                {/* Left Side: Topic Pills */}
                <div className="flex gap-1 overflow-x-auto py-1 custom-scrollbar scrollbar-none shrink-0">
                  {/* "Tất cả" Pill */}
                  <button
                    onClick={() => handleTopicChange('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                      selectedTopicId === 'all'
                        ? 'bg-[#15333B] text-white shadow-xs'
                        : 'bg-transparent text-[#3E5E63] hover:text-[#15333B]'
                    }`}
                  >
                    Tất cả
                  </button>

                  {/* Topic Pills */}
                  {topics.map(topic => {
                    const isActive = topic.id === selectedTopicId;
                    let iconStr = "💬";
                    if (topic.id === 'topic-onboarding') iconStr = "👋";
                    if (topic.id === 'topic-live-class') iconStr = "🎥";

                    return (
                      <button
                        key={topic.id}
                        onClick={() => handleTopicChange(topic.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-[#15333B] text-white shadow-xs'
                            : 'bg-transparent text-[#3E5E63] hover:text-[#15333B]'
                        }`}
                      >
                        <span>{iconStr}</span>
                        <span>{topic.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Right Side: Search, Tag/Lesson Filter, and Sort Select */}
                <div className="flex items-center gap-2 shrink-0">
                  
                  {/* Search Input */}
                  <div className="relative w-36 md:w-44">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-control text-xs w-full pl-8 pr-3 py-2 bg-white border-gray-200"
                    />
                  </div>

                  {/* Tag / Lesson Filter */}
                  <select
                    value={selectedLessonId}
                    onChange={(e) => setSelectedLessonId(e.target.value)}
                    className="form-control text-xs font-bold px-2.5 py-2 bg-white border-gray-200 text-[#15333B] rounded-xl w-36 md:w-44 cursor-pointer"
                  >
                    {selectedTopicId === 'topic-onboarding' ? (
                      <>
                        <option value="all">Lọc theo ngày học</option>
                        <option value="Ngày 1">Ngày 1</option>
                        <option value="Ngày 2">Ngày 2</option>
                        <option value="Ngày 3">Ngày 3</option>
                        <option value="Ngày 4">Ngày 4</option>
                        <option value="Ngày 5">Ngày 5</option>
                        <option value="Ngày 6">Ngày 6</option>
                        <option value="Ngày 7">Ngày 7</option>
                      </>
                    ) : (
                      <>
                        <option value="all">Lọc theo buổi học</option>
                        {lessons.map(les => (
                          <option key={les.id} value={les.id}>
                            {les.title.split(':')[0]}
                          </option>
                        ))}
                      </>
                    )}
                  </select>

                  {/* Sort Filter Select */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'upvotes')}
                    className="form-control text-xs font-bold px-2.5 py-2 bg-white border-gray-200 text-[#3E5E63] rounded-xl cursor-pointer w-28 md:w-32"
                  >
                    <option value="newest">📅 Mới nhất</option>
                    <option value="oldest">⏳ Cũ nhất</option>
                    <option value="upvotes">🔥 Kudos/Up</option>
                  </select>

                  {/* Admin Add Topic Pill (if admin mode) */}
                  {isUserAdmin && (
                    <button
                      onClick={() => setIsAddingTopic(true)}
                      className="p-2 rounded-xl bg-white border border-gray-200 text-[#214C54] hover:bg-gray-50 transition-colors shadow-sm"
                      title="Thêm phòng thảo luận mới"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}

                </div>

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
                            <div className="flex items-center gap-5">
                              <button
                                onClick={() => thread.is_assignment ? upvoteSubmission(thread.id) : upvoteDiscussionPost(thread.id)}
                                className={`flex items-center gap-1.5 transition-all text-[#3E5E63] hover:text-[#214C54] select-none cursor-pointer ${
                                  thread.upvoted_by.includes(activeUser.id) ? 'text-[#214C54]' : ''
                                }`}
                              >
                                <ThumbsUp className={`w-4 h-4 ${thread.upvoted_by.includes(activeUser.id) ? 'fill-current' : ''}`} />
                                <span className="text-xs font-black">{thread.upvotes_count}</span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveThreadId(thread.id);
                                  setCommentInput('');
                                }}
                                className="flex items-center gap-1.5 transition-all text-[#3E5E63] hover:text-[#214C54] select-none cursor-pointer"
                              >
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-xs font-black">{thread.comment_count}</span>
                              </button>
                            </div>
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
              <div className="space-y-4 py-5">
                <h3 className="text-xl md:text-2xl font-black text-[#15333B] tracking-tight leading-snug">
                  {activeThread.title}
                </h3>
                 <div className="text-sm md:text-base text-[#3E5E63] leading-relaxed break-words bg-gray-50/50 p-5 rounded-2xl border border-gray-100 font-medium">
                  {renderFormattedContent(activeThread.content)}
                </div>

                {/* Media Attachments Gallery */}
                {activeThread.media_urls && activeThread.media_urls.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {activeThread.media_urls.map((url: string, idx: number) => {
                      const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(url) || url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || url.includes('loom.com');
                      
                      return (
                        <div key={idx} className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-xs bg-gray-50 flex items-center justify-center min-h-[200px] w-full">
                          {isVideo ? (
                            url.includes('youtube.com') || url.includes('youtu.be') ? (
                              <iframe
                                src={url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                className="w-full h-full aspect-video rounded-xl border-none"
                                allowFullScreen
                              />
                            ) : (
                              <video
                                src={url}
                                controls
                                className="w-full h-full object-contain max-h-[300px]"
                              />
                            )
                          ) : (
                            <img
                              src={url}
                              alt={`Attachment ${idx + 1}`}
                              className="w-full h-full object-contain max-h-[300px]"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Thread Interaction (Kudos / Upvote) */}
              <div className="flex items-center gap-6 py-3 border-t border-b border-gray-100/70 my-4 text-gray-500">
                <button
                  onClick={() => activeThread.is_assignment ? upvoteSubmission(activeThread.id) : upvoteDiscussionPost(activeThread.id)}
                  className={`flex items-center gap-2 hover:text-[#214C54] transition-all select-none cursor-pointer ${
                    activeThread.upvoted_by.includes(activeUser.id) ? 'text-[#214C54]' : ''
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 ${activeThread.upvoted_by.includes(activeUser.id) ? 'fill-current' : ''}`} />
                  <span className="text-sm font-semibold">{activeThread.upvotes_count}</span>
                </button>
                <div className="flex items-center gap-2 select-none text-[#3E5E63]">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-sm font-semibold">{threadComments.length}</span>
                </div>
              </div>

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
                    value={newPostTopicId}
                    onChange={(e) => {
                      setNewPostTopicId(e.target.value);
                      setNewPostTag(''); // Reset tag when topic changes
                    }}
                    className="form-control text-xs w-full font-bold"
                  >
                    {topics.map(t => (
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
                    {newPostTopicId === 'topic-onboarding' ? (
                      <>
                        <option value="">-- Chọn ngày học liên quan (Nếu có) --</option>
                        <option value="Ngày 1">Ngày 1</option>
                        <option value="Ngày 2">Ngày 2</option>
                        <option value="Ngày 3">Ngày 3</option>
                        <option value="Ngày 4">Ngày 4</option>
                        <option value="Ngày 5">Ngày 5</option>
                        <option value="Ngày 6">Ngày 6</option>
                        <option value="Ngày 7">Ngày 7</option>
                      </>
                    ) : (
                      <>
                        <option value="">-- Chọn buổi học liên quan (Nếu có) --</option>
                        {lessons.map(les => (
                          <option key={les.id} value={les.id}>
                            {les.title}
                          </option>
                        ))}
                      </>
                    )}
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

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase block">Đính kèm ảnh / video</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-3 pb-3">
                      <span className="text-xl">📁</span>
                      <p className="text-xs font-bold text-gray-500 mt-1">Chọn ảnh hoặc video từ thiết bị</p>
                      <p className="text-[9px] text-gray-400">Hỗ trợ tải lên nhiều file cùng lúc</p>
                    </div>
                    <input type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>

                {/* Selected files preview */}
                {selectedMediaFiles.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {selectedMediaFiles.map((dataUrl, idx) => {
                      const isVideo = dataUrl.startsWith('data:video');
                      return (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                          {isVideo ? (
                            <video src={dataUrl} className="w-full h-full object-cover" />
                          ) : (
                            <img src={dataUrl} alt="" className="w-full h-full object-cover" />
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveMedia(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center text-[9px] font-bold hover:bg-red-600 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
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
