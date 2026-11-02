const fs = require('fs');
const path = require('path');

const explanations = [
  // 0-24: Website
  "Website là kênh sở hữu (owned media) duy nhất mà doanh nghiệp kiểm soát toàn diện mọi dữ liệu, nội dung và đóng vai trò trung tâm điều phối tất cả các kênh kéo traffic về.",
  "Không có website, doanh nghiệp bị lệ thuộc hoàn toàn vào thuật toán và chính sách của các nền tảng mạng xã hội, không sở hữu dữ liệu khách hàng và rất khó đo lường hành vi chuyên sâu.",
  "Website thuộc toàn quyền sở hữu của doanh nghiệp nên có thể tự do phát triển tính năng, mở rộng quy mô dữ liệu và lưu trữ giá trị thương hiệu lâu dài mà không sợ bị khóa tài khoản như trên mạng xã hội.",
  "Website là điểm cuối của phễu marketing nơi khách hàng thực hiện các hành động chuyển đổi giá trị cốt lõi như đặt hàng, thanh toán trực tuyến hoặc điền form đăng ký tư vấn.",
  "Tính năng tương tác giúp giữ chân người dùng trên trang, thu thập thông tin liên hệ (leads) qua biểu mẫu/hộp chat và hỗ trợ chăm sóc khách hàng kịp thời.",
  "Website thương mại điện tử tích hợp giỏ hàng và cổng thanh toán giúp hoàn tất toàn bộ quy trình mua sắm và trực tiếp tạo ra doanh thu cho doanh nghiệp.",
  "Các nền tảng xã hội và diễn đàn trực tuyến có thế mạnh lớn nhất về tương tác nhiều chiều, gắn kết cộng đồng và thúc đẩy nội dung lan truyền tự nhiên (viral).",
  "Shopee và Lazada là các sàn thương mại điện tử khổng lồ với hàng chục triệu người dùng, hàng triệu sản phẩm và hệ thống hạ tầng máy chủ phân tán toàn cầu.",
  "Website càng lớn thì lưu lượng truy cập, dữ liệu và độ phức tạp tính năng càng cao, đòi hỏi đầu tư tương xứng về máy chủ, an ninh mạng và đội ngũ vận hành.",
  "Các trang landing page hoặc microsite được thiết kế riêng nhằm phục vụ việc giới thiệu, quảng bá cho một sản phẩm mới hoặc một chiến dịch/dự án cụ thể.",
  "Tên miền .edu.vn dành riêng cho các cơ sở giáo dục - đào tạo, còn .gov.vn được pháp luật quy định dành riêng cho các cơ quan nhà nước, chính phủ.",
  "Website cá nhân đóng vai trò hồ sơ năng lực trực tuyến, giúp khẳng định uy tín chuyên môn và mở ra các cơ hội tuyển dụng, hợp tác kinh doanh.",
  "Bất động sản là sản phẩm giá trị lớn, khách hàng không mua ngay qua nút bấm mà cần đăng ký form để nhận tư vấn chuyên sâu và tham quan thực tế.",
  "Mỗi ngành hàng có chân dung khách hàng, hành trình mua hàng và ý định tìm kiếm khác nhau, đòi hỏi thông điệp và điểm chuyển đổi phải được tùy biến phù hợp.",
  "Website tĩnh gồm các file HTML/CSS cố định được gửi trực tiếp đến trình duyệt, không có cơ sở dữ liệu để thay đổi nội dung động theo thời gian thực.",
  "Website tĩnh không cần xử lý script máy chủ hay truy vấn database nên thời gian phản hồi cực nhanh, ít lỗ hổng bảo mật và chi phí lưu trữ rất rẻ.",
  "Website động phải liên tục kết nối cơ sở dữ liệu và xử lý logic phía máy chủ cho mỗi lượt truy cập, dẫn đến tốn nhiều tài nguyên hosting và chi phí bảo trì hơn.",
  "Web Hosting là dịch vụ lưu trữ trực tuyến cung cấp không gian máy chủ để chứa mã nguồn, hình ảnh và cơ sở dữ liệu giúp website luôn truy cập được trên Internet.",
  "Database là nơi lưu trữ có cấu trúc các thông tin thường xuyên biến đổi như tài khoản, mật khẩu, đơn hàng, bình luận và nội dung bài viết.",
  ".edu.vn là TLD (Top-Level Domain - Tên miền cấp cao nhất), phân loại tổ chức giáo dục (.edu) thuộc mã quốc gia Việt Nam (.vn).",
  "SSL/TLS do các tổ chức cấp chứng chỉ CA phát hành nhằm mã hóa đường truyền dữ liệu giữa trình duyệt và máy chủ, ngăn chặn nghe lén và bảo vệ thông tin người dùng.",
  "UI (Giao diện người dùng) bao gồm tất cả các thành phần trực quan thị giác mà người dùng nhìn thấy và tương tác trực tiếp trên màn hình như layout, font chữ, màu sắc.",
  "RWD (Responsive Web Design - Thiết kế web thích ứng) là kỹ thuật giúp giao diện tự động co giãn và hiển thị tối ưu trên mọi kích thước màn hình từ điện thoại đến máy tính.",
  "UX (Trải nghiệm người dùng) đánh giá mức độ tiện lợi, trực quan và cảm xúc mượt mà của khách hàng trong suốt quá trình hoàn thành mục tiêu (như quy trình mua hàng đơn giản).",
  "UI là phần nhìn (giao diện, màu sắc, tính thẩm mỹ), còn UX là phần cảm nhận (hành trình tiện lợi, tốc độ thao tác và sự thỏa mãn khi sử dụng).",

  // 25-56: Marketing công cụ tìm kiếm
  "SEO mang lại lượng truy cập tự nhiên (organic) không tốn phí click, trong khi SEM (Google Search Ads) vận hành theo mô hình PPC - tính phí trên mỗi lượt nhấp chuột.",
  "SEO cần thời gian nhiều tháng để xây dựng uy tín nội dung và backlink, nhưng khi đã lên top thì lượng truy cập sẽ duy trì ổn định và lâu dài.",
  "Quảng cáo SEM phụ thuộc hoàn toàn vào ngân sách; ngay khi chiến dịch hết hạn mức tiền hoặc tạm dừng đấu thầu, quảng cáo sẽ biến mất khỏi kết quả tìm kiếm ngay lập tức.",
  "SEM tập trung vào việc nghiên cứu từ khóa quảng cáo, tối ưu tiêu đề/mô tả mẫu quảng cáo và điều chỉnh giá thầu (bidding) để tối ưu chi phí và vị trí hiển thị.",
  "SEO là chiến lược dài hạn giúp nâng cao thứ hạng tự nhiên, gia tăng độ nhận diện và củng cố niềm tin vững chắc của khách hàng vào thương hiệu.",
  "Integrated Campaign (Chiến dịch tích hợp) là sự kết hợp đồng thời giữa SEO và SEM để thống trị cả kết quả tìm kiếm tự nhiên lẫn quảng cáo trả phí trên cùng một trang kết quả SERP.",
  "Quy trình cốt lõi của công cụ tìm kiếm Google gồm 3 bước tuần tự: Thu thập dữ liệu (Crawl) → Lập chỉ mục lưu trữ (Index) → Xếp hạng hiển thị (Rank).",
  "Index là giai đoạn Googlebot đọc nội dung, phân tích ngữ nghĩa, hình ảnh của trang web và lưu trữ vào kho dữ liệu khổng lồ của Google để sẵn sàng hiển thị khi có truy vấn.",
  "Thuật toán của Google liên tục cập nhật và đối thủ cạnh tranh luôn tối ưu mới, do đó SEO đòi hỏi phải theo dõi và cập nhật liên tục để giữ vững vị trí.",
  "Nhồi nhét từ khóa sẽ bị Google phạt; SEO hiện đại yêu cầu tối ưu tổng thể từ kỹ thuật (Technical SEO), trải nghiệm nội dung hữu ích đến độ uy tín (Authority).",
  "Technical SEO liên quan trực tiếp đến cấu trúc hạ tầng website gồm tốc độ tải trang (PageSpeed), chứng chỉ bảo mật HTTPS và khả năng hiển thị trên thiết bị di động (Mobile-friendly).",
  "Các tín hiệu uy tín xuất phát từ bên ngoài website của bạn như đánh giá của khách hàng, nhắc đến thương hiệu (brand mentions) và mạng xã hội thuộc nhóm Off-page SEO.",
  "SERP là viết tắt của Search Engine Results Page - trang hiển thị danh sách kết quả bao gồm liên kết tự nhiên, quảng cáo, bản đồ và đoạn trích nổi bật khi người dùng tìm kiếm.",
  "Thẻ Alt (Alternative Text) cung cấp đoạn văn bản mô tả nội dung hình ảnh, giúp bot tìm kiếm hiểu được ngữ cảnh của ảnh và hỗ trợ hiển thị khi ảnh bị lỗi tải.",
  "Backlink (liên kết ngược) là liên kết từ một website bên ngoài trỏ về website của bạn; nó đóng vai trò như một phiếu bầu tín nhiệm mạnh mẽ giúp tăng độ uy tín với Google.",
  "Tệp robots.txt đặt ở thư mục gốc của website chứa các chỉ thị thông báo cho bot tìm kiếm biết thư mục hoặc tệp nào được phép (allow) hoặc không được phép (disallow) thu thập dữ liệu.",
  "Internal link (liên kết nội bộ) giúp điều hướng người dùng thuận tiện, hỗ trợ bot Google khám phá các trang con và truyền dẫn sức mạnh thẩm quyền (PageRank) xuyên suốt website.",
  "Impressions (Lượt hiển thị) đo lường số lần mẫu quảng cáo xuất hiện trên màn hình kết quả tìm kiếm của người dùng, bất kể người dùng có nhấp vào hay không.",
  "Reach đo lường số lượng người dùng độc nhất (unique users) đã nhìn thấy quảng cáo ít nhất một lần trong một khoảng thời gian nhất định.",
  "Bounce rate là tỷ lệ phần trăm số lượt truy cập mà người dùng vào trang đích rồi thoát ra ngay mà không xem thêm trang nào khác hay có tương tác tiếp theo.",
  "Google chấm điểm Quality Score theo thang từ 1 (kém nhất) đến 10 (tốt nhất) dựa trên CTR kỳ vọng, độ liên quan của quảng cáo và trải nghiệm trang đích.",
  "CPM (Cost Per Mille - Mille trong tiếng Latinh là 1.000) là hình thức tính phí quảng cáo cho mỗi một nghìn lượt hiển thị đến người dùng.",
  "Tỷ lệ nhấp CTR = (Số lượt nhấp / Số lượt hiển thị) × 100% = (250 / 10.000) × 100% = 2,5%.",
  "Tỷ suất hoàn vốn trên chi phí quảng cáo ROAS = Doanh thu / Chi phí quảng cáo = 40.000.000 / 10.000.000 = 4.",
  "Chi phí cho mỗi hành động CPA = Tổng chi phí / Số lượt chuyển đổi = 6.000.000 / 120 = 50.000 đồng/đơn hàng.",
  "Thứ hạng quảng cáo (Ad Rank) của Google được xác định bởi công thức: Ad Rank = Giá thầu (Bid) × Điểm chất lượng (Quality Score) + Tác động tiện ích mở rộng.",
  "Google ưu tiên trải nghiệm người dùng; nhà quảng cáo có điểm chất lượng cao và nội dung phù hợp có thể giành vị trí top đầu với mức giá thầu thấp hơn đối thủ có điểm chất lượng kém.",
  "3 thành phần cấu thành Quality Score của Google Ads gồm: CTR kỳ vọng, Độ liên quan của quảng cáo và Trải nghiệm trang đích; số lượng backlink là yếu tố của SEO tự nhiên.",
  "Khi điểm chất lượng thấp, Google đánh giá quảng cáo không hữu ích cho người dùng, do đó bạn phải trả chi phí mỗi click (CPC) đắt hơn nhiều hoặc thậm chí bị từ chối hiển thị.",
  "Cấu trúc tài khoản Google Ads chuẩn gồm 4 tầng: Cấp tài khoản (Account) → Chiến dịch (Campaign) → Nhóm quảng cáo (Ad Group) → Từ khóa & Mẫu quảng cáo (Keywords & Ads).",
  "Trong Google Ads, dấu ngoặc vuông [...] quy định loại đối sánh chính xác (Exact Match), quảng cáo chỉ kích hoạt khi người dùng tìm kiếm đúng cụm từ đó hoặc biến thể cùng ý nghĩa.",
  "Ký hiệu dấu trừ (-) được đặt trước từ khóa (Negative Keyword) để ngăn quảng cáo hiển thị khi truy vấn của người dùng có chứa từ khóa không mong muốn đó (ví dụ: -miễn phí).",

  // 57-77: Marketing truyền thông xã hội
  "SMM là hình thức marketing tận dụng các mạng xã hội (Facebook, TikTok, LinkedIn...) nhằm kết nối tương tác, lan tỏa thương hiệu và thúc đẩy chuyển đổi đơn hàng.",
  "Không giống quảng cáo một chiều truyền thống, truyền thông mạng xã hội là tương tác đối thoại hai chiều, đòi hỏi doanh nghiệp phải lắng nghe, giải đáp và tương tác qua lại với cộng đồng.",
  "UGC (User Generated Content) là nội dung do chính người tiêu dùng tự nguyện sáng tạo và chia sẻ (như bài review, unboxing, clip trải nghiệm), tạo nên hiệu ứng lan truyền tự nhiên mạnh mẽ.",
  "Nền tảng mạng xã hội cung cấp dữ liệu phân tích số liệu (lượt xem, tương tác, click, chuyển đổi) tức thì theo thời gian thực (real-time) giúp nhà quảng cáo tối ưu chiến dịch kịp thời.",
  "Trên mạng xã hội, khách hàng không chỉ là đối tượng tiếp nhận thông tin thụ động mà còn là người sáng tạo nội dung, đánh giá và chia sẻ thông điệp thương hiệu đến cộng đồng.",
  "Paid Media (Truyền thông trả phí) chỉ duy trì sự hiện diện khi còn ngân sách chi trả; ngay khi ngừng nạp tiền quảng cáo, lượng tiếp cận và hiển thị sẽ biến mất lập tức.",
  "Earned Media (Truyền thông lan truyền/kiếm được) gồm lời khen ngợi, bài báo, review tự nhiên có độ tin cậy khách quan cao nhất với người dùng nhưng doanh nghiệp không thể can thiệp hay kiểm soát trực tiếp.",
  "Mọi chiến lược marketing hiệu quả đều phải khởi đầu bằng việc thiết lập mục tiêu theo tiêu chuẩn SMART (Cụ thể, Đo lường được, Khả thi, Liên quan và Giới hạn thời gian).",
  "Luật Quảng cáo sửa đổi (số 75/2025/QH15) xác định rõ tư cách pháp lý của KOL, KOC, streamer khi quảng bá sản phẩm là 'Người chuyển tải sản phẩm quảng cáo'.",
  "Để ngăn chặn thông tin sai lệch và deepfake, pháp luật quy định các sản phẩm truyền thông hình ảnh/video do trí tuệ nhân tạo (AI) tạo ra hoặc mô phỏng người thật bắt buộc phải được gắn nhãn nhận diện rõ ràng.",
  "TikTok là nền tảng video ngắn định dạng dọc toàn màn hình trên điện thoại thông minh, do đó tỷ lệ khung hình chuẩn và tối ưu trải nghiệm nhất là 9:16.",
  "Quy tắc 80/20 khuyến nghị dành 80% dung lượng nội dung để cung cấp kiến thức, giải trí và chia sẻ giá trị cho cộng đồng, chỉ dành 20% còn lại cho nội dung chào bán sản phẩm trực tiếp.",
  "Trên môi trường video ngắn lướt nhanh, 3 giây đầu tiên (Hook) mang tính quyết định liệu người xem có dừng ngón tay lại để tiếp tục xem hết clip hay lướt qua clip khác.",
  "KOC (Key Opinion Consumer) là người tiêu dùng có sức ảnh hưởng bắt đầu từ việc trực tiếp trải nghiệm, đánh giá sản phẩm một cách chân thực và đưa ra lời khuyên cho cộng đồng.",
  "Shoppertainment là xu hướng kết hợp giữa mua sắm (Shopping) và giải trí (Entertainment), cho phép người dùng đặt mua hàng ngay khi đang thưởng thức livestream hoặc video giải trí.",
  "Messenger là kênh hội thoại 1-1 trực tiếp giúp doanh nghiệp kết nối cá nhân hóa, giải đáp thắc mắc, gửi báo giá và chốt đơn hàng nhanh chóng với khách hàng tiềm năng.",
  "Cấu trúc quảng cáo Meta (Facebook) gồm 3 cấp độ: Cấp Chiến dịch (chọn mục tiêu) → Cấp Nhóm quảng cáo (chọn đối tượng, ngân sách, vị trí) → Cấp Quảng cáo (chọn định dạng, nội dung, hình ảnh/video).",
  "Đối tượng tùy chỉnh (Custom Audience) là tệp đối tượng gồm những người đã từng tương tác với doanh nghiệp như truy cập web (Pixel), tương tác trang, xem video hoặc nằm trong danh sách khách hàng.",
  "Chỉ số ROAS (Return On Ad Spend) = Doanh thu / Chi phí quảng cáo = 24.000.000 / 8.000.000 = 3.",
  "Share of Voice (SOV) trong lắng nghe mạng xã hội là tỷ lệ phần trăm số lượng thảo luận nhắc đến thương hiệu của bạn so với tổng lượng thảo luận của toàn bộ các đối thủ trong ngành.",
  "Trong khủng hoảng truyền thông xã hội, 24 giờ đầu tiên là 'thời điểm vàng' để doanh nghiệp tiếp nhận thông tin, xác minh sự việc và đưa ra phản hồi chính thức trước khi khủng hoảng bùng phát mất kiểm soát.",

  // 78-92: Email Marketing - CRM
  "Kotler & Armstrong xếp Email Marketing vào nhóm Direct Marketing (Marketing trực tiếp) vì nó cho phép gửi thông điệp cá nhân hóa trực tiếp đến từng khách hàng mục tiêu cụ thể.",
  "Email marketing gồm 2 hình thức gửi cơ bản: Gửi hàng loạt cùng lúc theo chiến dịch (Broadcast Email) và Gửi tự động theo kích hoạt hành vi của người dùng (Triggered Email).",
  "Khoản 1 Điều 13 Nghị định 91/2020/NĐ-CP quy định mọi thư điện tử quảng cáo gửi đi bắt buộc phải có chữ [QC] hoặc [ADV] đặt ở đầu tiêu đề thư.",
  "Điểm a Khoản 2 Điều 13 Nghị định 91/2020/NĐ-CP quy định người gửi không được gửi quá 03 thư điện tử quảng cáo tới một địa chỉ email trong vòng 24 giờ, trừ khi có thỏa thuận khác.",
  "Welcome series là chuỗi email tự động gửi ngay lập tức khi khách hàng vừa hoàn tất đăng ký tài khoản hoặc đăng ký nhận bản tin (newsletter) để tạo ấn tượng ban đầu tốt đẹp.",
  "Email bỏ quên giỏ hàng được hệ thống kích hoạt tự động khi khách hàng đã chọn sản phẩm vào giỏ nhưng thoát trang mà chưa hoàn tất bước thanh toán.",
  "Hầu hết ứng dụng email trên điện thoại chỉ hiển thị trọn vẹn từ 30 đến 50 ký tự đầu tiên của tiêu đề trước khi bị cắt ngắn bởi dấu ba chấm (...).",
  "Preheader (đoạn trích trước) là dòng văn bản ngắn hiển thị ngay cạnh tiêu đề trong hòm thư đến, đóng vai trò như lời mào đầu kích thích người nhận bấm mở thư.",
  "Tiêu đề cá nhân hóa theo tên riêng kết hợp nhắc đúng sản phẩm khách vừa xem và ưu đãi cụ thể (ví dụ: 'Nam ơi, giảm 20%...') có tỷ lệ mở (Open Rate) cao vượt trội so với tiêu đề chung chung.",
  "Thiết kế email chuẩn mobile-first cần sử dụng bố cục một cột duy nhất, kích thước chữ tối thiểu 14-16px và nút kêu gọi hành động (CTA) kích thước tối thiểu 44x44px để dễ chạm ngón tay.",
  "Chân trang email bắt buộc phải chứa thông tin nhận diện doanh nghiệp, địa chỉ thực tế và liên kết Hủy đăng ký (Unsubscribe) theo chuẩn phòng chống thư rác quốc tế.",
  "Hard bounce là lỗi trả về vĩnh viễn do địa chỉ email không tồn tại hoặc tên miền bị khóa; cần xóa ngay khỏi danh sách để bảo vệ độ uy tín của máy chủ gửi thư (Sender Reputation).",
  "Tỷ suất hoàn vốn đầu tư ROI = [(Doanh thu - Chi phí) / Chi phí] × 100% = [(30 - 10) / 10] × 100% = (20 / 10) × 100% = 200%.",
  "CRM là viết tắt của Customer Relationship Management (Quản trị quan hệ khách hàng), là hệ thống phần mềm và chiến lược nhằm quản lý toàn diện mọi tương tác với khách hàng.",
  "Email win-back (kích hoạt lại) với thông điệp nhớ nhung kèm mã voucher ưu đãi đặc biệt là giải pháp tối ưu để thu hút nhóm khách hàng có nguy cơ rời bỏ quay lại mua sắm.",

  // 93-118: Nhóm tổng hợp & nâng cao
  "Google Keyword Planner là công cụ miễn phí chính thức của Google Ads giúp nghiên cứu xu hướng tìm kiếm, dự báo lưu lượng và gợi ý giá thầu cho các từ khóa.",
  "Lookalike Audience (Đối tượng tương tự) là tính năng của Meta AI giúp tự động tìm kiếm những người dùng mới có đặc điểm nhân khẩu học và hành vi tương đồng với tệp khách hàng tốt nhất hiện tại của bạn.",
  "Lead chưa mua hàng cần được xây dựng niềm tin qua chuỗi email nuôi dưỡng (Lead Nurturing) cung cấp kiến thức giá trị, câu chuyện thành công và bằng chứng xã hội trước khi chào bán.",
  "Website tĩnh không có giao diện quản trị nội dung (CMS) và không có cơ sở dữ liệu động, do đó việc thay đổi bài viết bắt buộc phải chỉnh sửa thủ công từng dòng mã nguồn HTML.",
  "Website của các cơ quan chính quyền và tổ chức phi lợi nhuận hoạt động vì lợi ích cộng đồng, công khai thủ tục hành chính và cung cấp các dịch vụ công trực tuyến cho công dân.",
  "Cá nhân hóa (Personalization) sử dụng dữ liệu hành vi quá khứ và sở thích của từng người dùng để hiển thị nội dung, banner và đề xuất sản phẩm may đo riêng biệt cho mỗi cá nhân.",
  "Rank là bước thuật toán Google đánh giá hàng trăm tín hiệu (tính liên quan, độ uy tín, trải nghiệm trang) để xếp hạng các trang web từ cao xuống thấp và hiển thị cho người tìm kiếm.",
  "Nhóm quảng cáo (Ad Group) nằm trong Chiến dịch, có nhiệm vụ tập hợp một nhóm từ khóa chặt chẽ cùng chia sẻ một thông điệp quảng cáo và dẫn về một trang đích phù hợp.",
  "Trong Google Ads, đặt từ khóa trong dấu ngoặc kép \"...\" quy định loại đối sánh cụm từ (Phrase Match), quảng cáo sẽ hiển thị khi tìm kiếm chứa cụm từ đó hoặc có ý nghĩa tương đương.",
  "Email giao dịch là email phát sinh từ hành động cụ thể của người dùng như xác nhận đặt hàng, biên lai thanh toán, đặt lại mật khẩu và có tỷ lệ mở thư cao nhất.",
  "Mặc dù kích hoạt theo hành vi, email giỏ hàng bỏ quên chứa thông tin sản phẩm và kêu gọi thanh toán kèm ưu đãi, nên được xếp vào nhóm email bán hàng - xúc tiến thương mại.",
  "Hành trình chuyển đổi qua email diễn ra tuần tự: Email phải vào được hộp thư (Delivery) → Khách hàng mở thư (Open) → Khách nhấp vào liên kết (Click) → Tin tưởng và thực hiện chuyển đổi (Conversion).",
  "Tiêu đề (Subject Line) là yếu tố đập vào mắt người đọc đầu tiên trong hòm thư đến và đóng vai trò quyết định trên 70% quyết định mở hay bỏ qua một bức thư điện tử.",
  "Tỷ lệ gửi thành công Delivery Rate = (Số email được chấp nhận / Tổng số email gửi đi) × 100% = (9.700 / 10.000) × 100% = 97%.",
  "Đây là 2 khung giờ người dùng bắt đầu ngày làm việc mới (kiểm tra hòm thư công việc 8-10h) hoặc thời điểm thư giãn buổi tối ở nhà (20-22h), mang lại tỷ lệ mở thư cao nhất.",
  "Analytical CRM tập trung vào khai phá dữ liệu (Data Mining), phân tích lịch sử giao dịch nhằm vẽ chân dung khách hàng, phân khúc thị trường và dự báo xu hướng tiêu dùng.",
  "Danh sách email do chính khách hàng tự nguyện cung cấp cho doanh nghiệp; doanh nghiệp toàn quyền lưu trữ, sở hữu và tiếp cận trực tiếp mà không bị bóp tương tác bởi thuật toán mạng xã hội.",
  "Các tệp thực thi (.exe), tệp nén dung lượng lớn hoặc đuôi lạ thường bị các bộ lọc thư rác (Spam Filter) của Gmail, Outlook nhận diện là nguy cơ mã độc và đưa thẳng vào hộp Spam.",
  "Khách hàng cần sự yên tâm tức thì sau khi chuyển tiền hoặc bấm đặt hàng, do đó email giao dịch phải được hệ thống tự động kích hoạt gửi ngay lập tức (real-time).",
  "ROI = [(Doanh thu - Chi phí) / Chi phí] × 100% = [(10 - 2) / 2] × 100% = (8 / 2) × 100% = 400%.",
  "Hệ thống tự động nhúng một ảnh GIF vô hình kích thước 1x1 pixel (Tracking Pixel) vào nội dung thư; khi người nhận mở email, ảnh được tải về từ máy chủ và ghi nhận 1 lượt mở thư.",
  "Single Customer View (Góc nhìn khách hàng 360 độ duy nhất) là việc hợp nhất toàn bộ dữ liệu mua sắm, tương tác, khiếu nại của một khách hàng từ tất cả các kênh vào một hồ sơ trung tâm.",
  "Collaborative CRM kết nối và đồng bộ hóa dòng thông tin khách hàng giữa các phòng ban nội bộ (Bán hàng, Kế toán, Chăm sóc khách hàng) và đối tác bên ngoài để tạo trải nghiệm liền mạch.",
  "Email quan hệ không đặt nặng việc bán hàng ngay lập tức mà nhằm cung cấp bản tin hữu ích, chúc mừng sinh nhật, cảm ơn để duy trì mối liên hệ gắn bó thân thiết với người nhận.",
  "Triggered Email là hình thức gửi thư kích hoạt tự động theo điều kiện hành vi cụ thể của người dùng (như đăng ký mới, sinh nhật, đặt hàng, click link).",
  "Operational CRM tập trung vào việc tự động hóa các quy trình nghiệp vụ tiếp xúc trực tiếp với khách hàng hằng ngày bao gồm: Tự động hóa bán hàng (SFA), Marketing Automation và Dịch vụ khách hàng."
];

console.log('Total explanations crafted:', explanations.length);

const qsPath = path.join(__dirname, 'default_questions.json');
const questions = JSON.parse(fs.readFileSync(qsPath, 'utf8'));

if (questions.length !== explanations.length) {
  console.error(`Mismatch! Questions count: ${questions.length}, Explanations count: ${explanations.length}`);
  process.exit(1);
}

questions.forEach((q, i) => {
  q.explain = explanations[i];
});

fs.writeFileSync(qsPath, JSON.stringify(questions, null, 2), 'utf8');
console.log('Successfully injected explanations into default_questions.json!');
