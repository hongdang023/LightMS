import React, { useState } from 'react';
import { PageHeader } from '../../components/PageHeader';

export const HelpDesk: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tất cả FAQ' },
    { id: 'materials-schedule', label: 'Học liệu & Lịch' },
    { id: 'methods', label: 'Phương pháp học' },
    { id: 'gamification', label: 'Hải lý & Kudos' },
    { id: 'support-community', label: 'Cộng đồng & Hỗ trợ' }
  ];

  const faqs = [
    {
      category: 'materials-schedule',
      q: "Câu hỏi 01: Tôi có thể tìm học liệu (Recording, Study Notes,…) ở đâu?",
      a: (
        <div>
          <p>Ngay tại Notion học tập của lớp, mục <strong>03 | Tài liệu học tập & BTVN (Update sau từng buổi)</strong>.</p>
          <p className="mt-2">Ngoài ra, mỗi khi cập nhật tài liệu học tập, đội ngũ The1ight sẽ thông báo tại:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li><a href="https://www.facebook.com/share/g/18fRTLTSE3/" target="_blank" rel="noreferrer" className="text-[#214C54] font-bold hover:underline">Facebook Group (mục Đáng chú ý)</a></li>
            <li><a href="https://m.me/ch/AbYXkhY5TwUcD9zz/" target="_blank" rel="noreferrer" className="text-[#214C54] font-bold hover:underline">Phòng chat Bảng tin Ánh sáng trên Messenger</a></li>
          </ul>
        </div>
      )
    },
    {
      category: 'methods',
      q: "Câu hỏi 02: Khoá học có quá nhiều tài liệu cần đọc, nhiều thuật ngữ tiếng Anh chuyên ngành. Tôi cảm thấy bị quá tải và không biết bắt đầu từ đâu.",
      a: (
        <div>
          <p>Đừng lo lắng, bạn không phải người duy nhất. Bạn vui lòng truy cập vào Tài liệu hướng dẫn phương pháp học tập sau để vượt qua cảm giác ngợp nhé:</p>
          <a href="https://canva.link/wgmj35t6pzf2pby" target="_blank" rel="noreferrer" className="inline-block mt-2 font-bold text-xs bg-[#214C54] text-white px-3 py-1.5 rounded-lg hover:bg-[#15333B] transition-colors">
            📖 Xem Hướng dẫn vượt ngợp (Canva Link)
          </a>
        </div>
      )
    },
    {
      category: 'materials-schedule',
      q: "Câu hỏi 03: Tôi có thể tìm thông tin lịch học, link phòng học qua đâu? BTC có hỗ trợ nhắc lịch học không?",
      a: (
        <div className="space-y-2">
          <p>• Bạn có thể đọc tổng quan lịch học tại tab <strong>Lịch trình & Kết nối</strong> ở phần Giới thiệu khóa học.</p>
          <p>• Đội ngũ The1ight sẽ nhắc lịch học qua Google Calendar. Lịch trình sẽ được gửi ngay đầu khoá học nên bạn vui lòng add lịch.</p>
          <p>• Link phòng học sẽ <strong>CỐ ĐỊNH</strong> toàn khoá học tại phòng Zoom/Meet được gửi qua email/lịch hẹn Google Calendar.</p>
        </div>
      )
    },
    {
      category: 'methods',
      q: "Câu hỏi 04: Tôi muốn Tracking tiến độ học tập của bản thân vì học online nhiều lúc khá nản. Tôi có thể làm gì?",
      a: (
        <div>
          <p>Chúng tôi đã chuẩn bị sẵn một bảng tính tracking công khai của cả lớp để bạn tiện theo dõi tiến độ, thi đua và leo rank cùng đồng đội:</p>
          <a href="https://docs.google.com/spreadsheets/d/1MkdyolJBxs8xjvBmRlooO9QmZAnIGZM1oWN_WyD2zJg/edit?gid=1843915489#gid=1843915489" target="_blank" rel="noreferrer" className="inline-block mt-2 font-bold text-xs bg-[#214C54] text-white px-3 py-1.5 rounded-lg hover:bg-[#15333B] transition-colors">
            📊 Bảng Tracking Tiến độ & Leo Rank
          </a>
        </div>
      )
    },
    {
      category: 'gamification',
      q: "Câu hỏi 05: Kudos là gì? Vì sao cần Phòng tiếp lửa vinh danh?",
      a: (
        <div className="space-y-2">
          <p>Build sản phẩm là một hành trình dài và khá cô đơn, bởi vậy việc Kudos ghi nhận những chiến thắng nhỏ của bản thân và bạn học là điều rất cần thiết để vững bước trên hành trình này.</p>
          <p className="font-bold">Bạn được khuyến khích để Kudos:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Chính bạn</strong> vì đã vượt khó, vượt ngại, vượt khổ.</li>
            <li><strong>Các bạn học khác</strong> vì đã hỗ trợ bạn trong quá trình học (chia sẻ hay, hỗ trợ tinh thần, sửa lỗi hộ,...).</li>
            <li>Thầy giáo và đội ngũ The1ight.</li>
          </ul>
        </div>
      )
    },
    {
      category: 'support-community',
      q: "Câu hỏi 06: Nếu có các vấn đề khác ngoài các câu hỏi được nêu ra trên đây, tôi có thể liên hệ với ai?",
      a: (
        <div className="space-y-2">
          <p>Chúng mình rất mừng vì bạn đã có tinh thần đặt câu hỏi. Tinh thần của khoá học là <strong>“Hỏi ngu còn hơn không hỏi”</strong>. Có 04 cách để nhận được sự hỗ trợ:</p>
          <ul className="list-decimal pl-5 space-y-1.5">
            <li><strong>Cách 01 (KHUYẾN KHÍCH NHẤT - Cho các câu hỏi kiến thức):</strong> Đặt câu hỏi trên phòng <a href="https://m.me/ch/AbZBhshrDpB2lylD/" target="_blank" rel="noreferrer" className="text-[#214C54] font-bold hover:underline">Light Support</a> thuộc Messenger Community. Bạn sẽ được giải đáp nhanh chóng từ thầy và bạn học khác.</li>
            <li><strong>Cách 02:</strong> Hỏi AI (Bạn sẽ được học cách hỏi AI hiệu quả tại Onboarding Week — Ngày 3).</li>
            <li><strong>Cách 03 (Liên quan đến vận hành lớp học):</strong> Liên hệ Ms. Đặng Hồng (Quản lý lớp học) qua SĐT <strong>0985679417</strong> hoặc <a href="https://www.facebook.com/danghong.harunoyuki" target="_blank" rel="noreferrer" className="text-[#214C54] font-bold hover:underline">Messenger</a>.</li>
            <li><strong>Cách 04:</strong> Tham gia Office Hour để được thầy giáo hỗ trợ trực tiếp.</li>
          </ul>
        </div>
      )
    },
    {
      category: 'support-community',
      q: "Câu hỏi 07: Tôi không thích sử dụng Mạng xã hội, vì sao tôi nên tham gia vào Messenger Community Chat?",
      a: (
        <div className="space-y-2">
          <p>Đây là nơi xây dựng <strong>văn hóa học tập tập thể,</strong> giúp bạn đi xa hơn thay vì chỉ đi một mình:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Học từ người khác:</strong> Đọc câu hỏi và câu trả lời ở phòng thảo luận giúp bạn học thêm nhiều kiến thức mới mà có khi mình chưa nghĩ tới.</li>
            <li><strong>Giải đáp nhanh:</strong> Đội ngũ hỗ trợ và các bạn học viên thường trực ở đây gỡ rối cho bạn ngay lập tức.</li>
            <li><strong>Kiểm soát thông tin dễ dàng:</strong> Chat được chia nhỏ theo từng phòng chủ đề giúp bạn vào đúng chỗ cần thiết, tránh loãng thông tin.</li>
          </ul>
        </div>
      )
    },
    {
      category: 'methods',
      q: "Câu hỏi 08: Kiến thức quá nặng, tôi không có thời gian nghe lý thuyết và quá bận rộn. Có chiến thuật nào giúp tôi theo kịp lớp?",
      a: (
        <div className="space-y-3">
          <p className="font-bold text-[#15333B] text-sm">💡 CHIẾN THUẬT HỌC BÀI CHO NGƯỜI BẬN VÀ THẤY MÌNH NHƯ ĐANG TRÊN MÂY:</p>
          <p className="text-gray-600">Nhiều học viên cũng gặp khó khăn vì bận quá không xem lại recording được, đọc kiến thức mới không hiểu gì... Đừng hoang mang! Đây là gợi ý vàng từ đội ngũ The1ight:</p>
          
          <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-xs font-semibold text-red-800">
            ⚠️ ĐỀ NGHỊ: KHÔNG XEM LẠI RECORDING NỮA!
          </div>

          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li><strong>Bắt tay làm BTVN trước:</strong> Khi làm bài mình không hiểu ở đâu/cần đến cái gì, thì đó mới chính là đơn vị kiến thức mình CẦN QUAN TÂM.</li>
            <li><strong>Học thực chiến:</strong> Học lý thuyết chăm chỉ ghi chú đầy tài liệu nhưng không thực hành thì lúc làm bài vẫn theo bản năng. Chỉ khi thực hành, kiến thức mới thực sự ngấm.</li>
          </ul>

          <div className="pt-2">
            <p className="font-bold text-xs text-gray-700">🔍 Tra cứu nhanh thông qua AI Notebook:</p>
            <p className="text-xs text-gray-500 mt-0.5">Chúng mình đã tạo sẵn một NotebookLM tổng hợp học liệu từ khóa trước đến khóa này. Lủng ở đâu, hỏi AI ở đó để được giải đáp tức thì:</p>
            <a href="https://notebooklm.google.com/notebook/b0b2b953-c851-4580-9eef-934ff1ff4ac4" target="_blank" rel="noreferrer" className="inline-block mt-2 font-bold text-xs bg-[#15333B] text-[#FFD94C] px-3 py-1 rounded hover:bg-[#214C54] transition-colors">
              🚀 Truy cập Link NotebookLM
            </a>
          </div>
        </div>
      )
    },
    {
      category: 'support-community',
      q: "Câu hỏi 09: Tôi muốn học các kiến thức khác (Automation, IDE,…) từ các khóa cũ. Làm thế nào để tôi truy cập?",
      a: (
        <div>
          <p>Có, bạn hoàn toàn có thể xem lại video bài giảng và học liệu của các khóa trước để tự học nâng cao:</p>
          <a href="https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.notion.so%2FOverall-Syllabus-to-be-updated-264fb1613f7081d4ad7de0541bc29e98%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExQXFnRzRPRXRsWVlySU1lcnNydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR4cmn2PRzb_ZjSCrj0miY6HUYgUnkKUUJ0BiIrAIiESbtNcX8U_a_wDVPIuKA_aem_Uc0XDllQNDAjusEMcX6Nyg&h=AT6niBRBUTkS6MfSj5x38S5_Uo45ASz_pGTysG4gxHrIiwt6cNqVlxzTC8WEbCmREhaaekRNg6SM9UigEDxKTaW6iW0yEzsvQaHgKtcdYPtYezOjYkcadwSIcpRqRsJ5CZSky6axvuj-FnF3Q0k-q4CNqTs0yd3hCIOD6g&__tn__=R]-R&c[0]=AT4mVNQ9slJKiTNngGhFYlD98-neU0v9R-mbsO6md7jJD7NelLFO3AAZO6pzV8uOEPr9OBqWWu6bZTnfSFoh2hyiZfFTBSs_SGl0z70Gjl0Wnjy78lqvvpcTXwNR82G87EGW5bFZUrOKgmNB4Xh4cY1zobRVcrXMGnCPK3Q3ckrB" target="_blank" rel="noreferrer" className="inline-block mt-2 font-bold text-xs bg-[#214C54] text-white px-3 py-1.5 rounded-lg hover:bg-[#15333B] transition-colors">
            🔗 Recording các Khoá Học Trước
          </a>
        </div>
      )
    }
  ];

  // Filter FAQs based on active category
  const filteredFaqs = faqs.filter(faq => activeCategory === 'all' || faq.category === activeCategory);

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in select-none">
      <PageHeader
        title="Hỏi đáp & Hỗ trợ"
        description="Gặp khó khăn kỹ thuật hay có thắc mắc về nội dung? Lọc theo chủ đề bên dưới để xem giải đáp."
        helpTitle="Support"
        helpSummary="Danh sách FAQ và kênh hỗ trợ trực tiếp qua Telegram."
        helpPurpose="Giúp bạn gỡ rối nhanh chóng mà không mất đà học — mọi câu hỏi cơ bản đều được trả lời sẵn ở đây."
      />
      <div className="card space-y-6">

        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenFaq(null); // Close active FAQ when changing categories
              }}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#214C54] text-[#FFD94C]'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ list */}
        <div className="space-y-3 pt-2">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              // We need to map the relative index back to the overall index or just use a dynamic matching scheme
              // Let's match by the question text to keep open states correct
              const actualIndex = faqs.findIndex(f => f.q === faq.q);
              const isOpen = openFaq === actualIndex;

              return (
                <div 
                  key={faq.q}
                  className="border border-gray-150 rounded-xl bg-white overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : actualIndex)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-xs text-[#15333B] hover:bg-gray-50 transition-colors"
                  >
                    <span className="pr-4">{faq.q}</span>
                    {isOpen ? <span className="text-[#214C54]">▲</span> : <span className="text-gray-400">▼</span>}
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-xs text-[#3E5E63] leading-relaxed font-medium">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-xs text-gray-400 text-center py-6 font-medium">Không tìm thấy câu hỏi nào thuộc chủ đề này.</p>
          )}
        </div>

        {/* Telegram Direct Support Action */}
        <div className="bg-[#214C54]/5 border border-[#214C54]/20 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛟</span>
            <div>
              <h4 className="font-extrabold text-sm text-[#15333B]">Phòng Light Support trên Telegram</h4>
              <p className="text-[10px] text-gray-500 mt-0.5 font-semibold">Tự động kết nối trực tiếp đến trợ lý vận hành lớp để giải đáp trong 5 phút.</p>
            </div>
          </div>
          <a 
            href="https://t.me/the1ight_support" 
            target="_blank" 
            rel="noreferrer"
            className="btn btn-accent text-xs font-extrabold flex items-center gap-1.5 shrink-0"
          >
            <span>🚀</span>
            <span>Liên hệ Telegram Support</span>
          </a>
        </div>
      </div>
    </div>
  );
};
