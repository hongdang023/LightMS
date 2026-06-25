import React, { useState } from 'react';
import { AnchorIcon, RouteIcon, GiftIcon } from '../../components/Icons';
import { PageHeader } from '../../components/PageHeader';
import { useDatabase } from '../../context/DatabaseContext';
import { EditableText } from '../../components/EditableText';

interface AboutViewProps {
  onPageChange: (page: string) => void;
  isEditMode?: boolean;
}

export const AboutView: React.FC<AboutViewProps> = ({ onPageChange, isEditMode = false }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'benefits'>('overview');
  const { aboutContent, updateAboutContent } = useDatabase();

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <PageHeader 
        title="Giới thiệu khoá học"
        description="01 Giới thiệu khoá học [READ ME FIRST]"
        helpTitle="Giới thiệu"
        helpSummary="Tất cả thông tin cần biết trước khi bắt đầu khoá học."
        helpPurpose="Giúp bạn hiểu rõ lộ trình, phương pháp học và cách lấy tối đa giá trị từ khoá học này."
      />
      
      <div className="card space-y-6">

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-150 gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-[#214C54] text-[#214C54]'
                : 'border-transparent text-gray-500 hover:text-[#214C54]'
            }`}
          >
            <AnchorIcon active={activeTab === 'overview'} className="w-4 h-4" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'schedule'
                ? 'border-[#214C54] text-[#214C54]'
                : 'border-transparent text-gray-500 hover:text-[#214C54]'
            }`}
          >
            <RouteIcon active={activeTab === 'schedule'} className="w-4 h-4" />
            <span>Schedule</span>
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'benefits'
                ? 'border-[#214C54] text-[#214C54]'
                : 'border-transparent text-gray-500 hover:text-[#214C54]'
            }`}
          >
            <GiftIcon active={activeTab === 'benefits'} className="w-4 h-4" />
            <span>Benefits</span>
          </button>
        </div>


        {/* Tab Content */}
        <div className="rich-text space-y-4 text-sm leading-relaxed min-h-[300px]">
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-[#214C54]/5 border-l-4 border-[#214C54] rounded-r-xl whitespace-pre-wrap text-[#3E5E63]">
                {isEditMode ? (
                  <EditableText
                    value={aboutContent.overviewText}
                    onSave={v => updateAboutContent({ overviewText: v })}
                    className="text-[#3E5E63]"
                    minRows={3}
                  />
                ) : aboutContent.overviewText}
              </div>

              <blockquote className="italic border-l-4 border-gray-300 pl-4 py-1 text-gray-600 font-medium">
                "Bạn không cần biết code, không cần có team. Chỉ cần bạn – và một vấn đề bạn muốn giải quyết."
              </blockquote>

              <p className="font-medium text-[#214C54]">
                Không giống như các khoá dạy làm sản phẩm truyền thống, ở <strong>Build With The1ight</strong>, bạn sẽ:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#3E5E63]">
                <li>Học cách nâng cấp sản phẩm của mình từ prototype chạy được đến một sản phẩm có cấu trúc hệ thống.</li>
                <li>Hiểu tech sâu hơn để tự tin xây sản phẩm với AI (IDE, GitHub, backend, deploy, MCP và automation,..).</li>
                <li>Và đặc biệt, có mentor kèm và một cộng đồng bạn học đồng hành cùng bạn trong suốt hành trình.</li>
              </ul>

              <h3 className="font-extrabold text-base text-[#15333B] pt-4">🎯 Tư duy sản phẩm qua 3 trụ cột:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-150">
                  <span className="font-bold text-[#214C54] block mb-1">1. Tư duy đúng 🧠</span>
                  <span className="text-xs text-gray-500 font-semibold block uppercase tracking-wider mb-2">Mindset & Product Logic</span>
                  <p className="text-xs text-[#3E5E63]">Hiểu đúng về sản phẩm – từ lý thuyết đến thực tế. Tư duy như một PM thật sự: đặt câu hỏi đúng, viết Problem Statement, đặt giả định và kiểm chứng từng bước.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-150">
                  <span className="font-bold text-[#214C54] block mb-1">2. Dụng cụ đúng 🧰</span>
                  <span className="text-xs text-gray-500 font-semibold block uppercase tracking-wider mb-2">Tooling & Prototyping</span>
                  <p className="text-xs text-[#3E5E63]">Làm quen với AI, no-code và các công cụ automation (Lovable, Supabase, Make, Notion...) để bắt đầu xây dựng phiên bản đầu tiên của sản phẩm.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-150">
                  <span className="font-bold text-[#214C54] block mb-1">3. Thử nghiệm đúng 🔬</span>
                  <span className="text-xs text-gray-500 font-semibold block uppercase tracking-wider mb-2">Build – Test – Learn</span>
                  <p className="text-xs text-[#3E5E63]">Tư duy MVP và kiểm nghiệm giả định bằng sản phẩm thật, không cần chờ code hay kỹ thuật cao. Tự tay xây và học được bài học thật từ người dùng thật.</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-6">
                <p className="font-bold text-[#15333B]">Bạn sẽ rời khỏi lớp học với:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2 text-[#3E5E63]">
                  <li>1 sản phẩm thật do chính bạn tự xây dựng.</li>
                  <li>Tư duy đúng để lặp lại quy trình này lần nữa.</li>
                  <li>Sự tự tin để bước ra thế giới và kiếm tiền từ khả năng làm sản phẩm của mình ✨.</li>
                </ul>
                <p className="mt-4 font-semibold text-xs text-[#214C54]">
                  * Là một người xây sản phẩm, mình biết cái cảm giác lôi đứa con tinh thần từ trong đầu ra ngoài nó đẹp như thế nào. Mình muốn trong 30 ngày, bạn sẽ làm được và có được trải nghiệm này.
                </p>
                <p className="mt-2 font-bold text-xs text-[#15333B]">Thân gửi, Đội ngũ The1ight</p>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <div className="p-4 bg-[#214C54]/5 border-l-4 border-[#214C54] rounded-xl whitespace-pre-wrap text-sm text-[#3E5E63]">
                  {isEditMode ? (
                    <EditableText
                      value={aboutContent.scheduleText}
                      onSave={v => updateAboutContent({ scheduleText: v })}
                      className="text-sm text-[#3E5E63]"
                      minRows={5}
                    />
                  ) : aboutContent.scheduleText}
                </div>
                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={() => onPageChange('onboarding')}
                    className="inline-block text-xs font-bold text-[#FFD94C] bg-[#15333B] px-3 py-1.5 rounded-lg hover:bg-[#214C54] cursor-pointer"
                  >
                    Đi đến trang Onboarding ➔
                  </button>
                  <button 
                    onClick={() => onPageChange('syllabus')}
                    className="inline-block text-xs font-bold text-[#FFD94C] bg-[#15333B] px-3 py-1.5 rounded-lg hover:bg-[#214C54] cursor-pointer"
                  >
                    Đi đến trang Syllabus ➔
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-[#15333B] mb-3">🛠️ Hướng dẫn sử dụng & Set-up nền tảng học tập:</h3>
                <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📹</span>
                    <a 
                      href="https://drive.google.com/file/d/1bhtSzABAjKHPB_1LzzTG0wxiscAilC0a/view?usp=sharing" 
                      target="_blank" 
                      rel="noreferrer"
                      className="font-bold text-[#214C54] hover:underline text-xs"
                    >
                      Video Hướng dẫn sử dụng và set-up nền tảng học tập
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <a href="https://app.notion.com/p/f152df46dabf83ceb8788165361bf772?pvs=21" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <span className="text-lg">📒</span>
                      <div>
                        <span className="text-xs font-bold text-gray-700 block">Notion học tập tổng hợp</span>
                        <span className="text-[10px] text-gray-400">Build with the1ight (Batch 3)</span>
                      </div>
                    </a>

                    <a href="https://calendar.google.com/calendar/u/0?cid=NjMyNjQwNzkyZDc1YzM1ZGM2YWNhMzA2MjVlMWMzNWRlM2Y2ZDRkYmY3OTlmNTBmOTI0MmExMzg4ZDc5NjllZEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <span className="text-lg">📅</span>
                      <div>
                        <span className="text-xs font-bold text-gray-700 block">Google Calendar lớp học</span>
                        <span className="text-[10px] text-gray-400">Nhấp để tích hợp lịch học</span>
                      </div>
                    </a>

                    <a href="https://m.me/cm/AbakX4jK92v0eIxm/" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <span className="text-lg">💬</span>
                      <div>
                        <span className="text-xs font-bold text-gray-700 block">Messenger Community Chat</span>
                        <span className="text-[10px] text-gray-400">Thảo luận cùng tập thể lớp</span>
                      </div>
                    </a>

                    <a href="https://www.facebook.com/share/g/1HyBCrQS9D/" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <span className="text-lg">👥</span>
                      <div>
                        <span className="text-xs font-bold text-gray-700 block">Facebook Group</span>
                        <span className="text-[10px] text-gray-400">Nơi đăng thông tin chính thức</span>
                      </div>
                    </a>
                  </div>

                  <p className="text-[10px] text-gray-500 pt-2 border-t border-gray-100">
                    💡 Nếu chưa nhận được quyền truy cập các link trên, vui lòng liên hệ <strong>Ms. Đặng Hồng (Quản lý lớp học)</strong> qua SĐT <strong>0985679417</strong> hoặc <a href="https://www.facebook.com/danghong.harunoyuki" target="_blank" rel="noreferrer" className="text-[#214C54] font-bold hover:underline">Messenger</a>.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-[#15333B] mb-3">👨‍🏫 Hoạt động hỗ trợ học tập:</h3>
                <div className="bg-white border border-[#214C54]/20 rounded-2xl p-4 shadow-sm flex items-start gap-4">
                  <div className="text-3xl pt-1">💬</div>
                  <div>
                    <h4 className="font-bold text-[#15333B] text-sm">Office Hour với Trainer</h4>
                    <p className="text-xs text-gray-500 mt-1">Học viên có các vấn đề cần hỏi đáp chuyên sâu hoặc muốn nhận tư vấn trực tiếp từ thầy giáo có thể đăng ký tham gia Office Hour.</p>
                    <a 
                      href="https://m.me/ch/AbZBhshrDpB2lylD/" 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-block text-xs font-bold text-[#FFD94C] bg-[#15333B] px-3 py-1.5 rounded-md mt-3 hover:bg-[#214C54] transition-colors"
                    >
                      👉 Đăng ký Office Hour tại Light Support
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h3 className="font-extrabold text-base text-[#15333B] mb-2">🎁 Quyền lợi khi gia nhập cộng đồng:</h3>
                <div className="p-4 bg-gray-50 border border-gray-150 rounded-xl whitespace-pre-wrap text-sm text-[#3E5E63] mb-4">
                  {isEditMode ? (
                    <EditableText
                      value={aboutContent.benefitsText}
                      onSave={v => updateAboutContent({ benefitsText: v })}
                      className="text-sm text-[#3E5E63]"
                      minRows={3}
                    />
                  ) : aboutContent.benefitsText}
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-2xl pt-1">🎪</span>
                    <div>
                      <h4 className="font-bold text-[#15333B] text-sm">1ight Club</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Không gian kết nối, chia sẻ ý tưởng sản phẩm, công nghệ mới và các buổi sinh hoạt chuyên sâu giữa các thế hệ cướp biển.</p>
                      <div className="flex gap-2 mt-3">
                        <a href="https://www.facebook.com/share/g/1BCEoxNoqv/" target="_blank" rel="noreferrer" className="text-[10px] font-bold text-[#214C54] bg-[#214C54]/5 px-2 py-1 rounded hover:bg-[#214C54]/10">Group Facebook</a>
                        <a href="https://zalo.me/g/zuydzj265?fbclid=IwZXh0bgNhZW0CMTAAYnJpZBExTnVuakhSOW53WUNmbjE0SXNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR66E6u7YYxLMEoN0f1iKj2StV_GHxTo7TyyiiHN712xPyg_U0qUaru3EftTqA_aem_bap_taXXL7PXNVn0nfLHGA" target="_blank" rel="noreferrer" className="text-[10px] font-bold text-[#214C54] bg-[#214C54]/5 px-2 py-1 rounded hover:bg-[#214C54]/10">Zalo Group</a>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-2xl pt-1">🎖️</span>
                    <div>
                      <h4 className="font-bold text-[#15333B] text-sm">Alumni Club</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Nơi quy tụ toàn bộ các cựu học viên từ Batch 1 đến nay. Cơ hội cộng tác, tuyển dụng và đồng hành lâu dài.</p>
                      <div className="flex gap-2 mt-3">
                        <a href="https://www.facebook.com/share/g/1DJpuDdX9s/" target="_blank" rel="noreferrer" className="text-[10px] font-bold text-[#214C54] bg-[#214C54]/5 px-2 py-1 rounded hover:bg-[#214C54]/10">Group Facebook</a>
                        <a href="https://m.me/cm/AbbnQvQATe0KSg2O/" target="_blank" rel="noreferrer" className="text-[10px] font-bold text-[#214C54] bg-[#214C54]/5 px-2 py-1 rounded hover:bg-[#214C54]/10">Messenger Chat</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#FFD94C]/10 border border-[#FFD94C]/30 rounded-2xl text-[11px] text-[#554300] font-medium">
                  ⚠️ <strong>Lưu ý:</strong> Đây là các hoạt động phụ trợ bên ngoài khoá học để các học viên giao lưu với nhau, bạn <strong>KHÔNG BẮT BUỘC</strong> phải tham gia ngay đầu khoá học.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
