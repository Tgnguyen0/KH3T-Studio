# UC025: Hỏi trợ lý ảo

## 1. Biểu đồ hoạt động (Activity Diagram)

```mermaid
flowchart TD
    Start([Bắt đầu]) --> InputMessage[Khách hàng nhập câu hỏi & gửi]
    InputMessage --> IdentifyUser[Xác định danh tính & lịch sử chat]
    IdentifyUser --> SearchProducts[Truy vấn thông tin sản phẩm phù hợp trong DB]
    SearchProducts --> ConstructPrompt[Tạo Prompt đầy đủ ngữ cảnh]
    ConstructPrompt --> CallGemini[Gửi yêu cầu tới Gemini API]
    CallGemini --> CheckAPI{API hoạt động?}
    
    CheckAPI -- Không / Timeout --> FallbackReply[Sử dụng kịch bản trả lời FAQ tĩnh làm dự phòng]
    CheckAPI -- Có --> ReceiveGemini[Gemini trả về câu trả lời tự động]
    
    ReceiveGemini --> SaveHistory[Lưu tin nhắn & phản hồi vào Database]
    SaveHistory --> ParseLinks[Phân tích sản phẩm để chèn Link trực quan]
    
    FallbackReply --> DisplayReply[Hiển thị phản hồi lên khung chat]
    ParseLinks --> DisplayReply
    DisplayReply --> End([Kết thúc])
```

## 2. Biểu đồ tuần tự (Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    actor KhachHang as Khách hàng
    participant FE as Frontend Chat UI (React)
    participant BE as Backend Controller (Spring Boot)
    participant Service as ChatService
    database DB as Database (MySQL)
    participant Gemini as Gemini AI (Google API)

    KhachHang->>FE: Nhập tin nhắn cần hỏi, nhấn Gửi
    activate FE
    FE->>BE: POST /api/v1/chat/send (Message, SessionId)
    activate BE
    BE->>Service: processChatMessage(message, sessionId)
    activate Service
    
    Service->>DB: Lấy lịch sử chat gần đây & Tìm sản phẩm phù hợp qua từ khóa
    activate DB
    DB-->>Service: Trả về danh sách chat & dữ liệu sản phẩm mẫu
    deactivate DB
    
    Service->>Service: Ghép Prompt (Context + Chat History + New Message)
    Service->>Gemini: POST /v1beta/models/gemini-pro:generateContent (Prompt)
    activate Gemini
    Gemini-->>Service: HTTP 200 OK (Nội dung câu trả lời JSON)
    deactivate Gemini
    
    Service->>DB: INSERT INTO chat_history (sender, message)
    activate DB
    DB-->>Service: Lưu thành công
    deactivate DB
    
    Service-->>BE: Đối tượng ChatResponseDTO
    deactivate Service
    BE-->>FE: HTTP 200 OK (Chat DTO)
    deactivate BE
    FE-->>KhachHang: Hiển thị phản hồi của Bot và link sản phẩm gợi ý
    deactivate FE
```
