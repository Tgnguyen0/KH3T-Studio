package fit.iuh.kh3tshopbe.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.*;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.util.List;
import java.util.UUID;

@Service
public class GoogleCalendarService {

    private Calendar getCalendarService() throws Exception {
        GoogleCredentials credentials = GoogleCredentials
                .fromStream(new ClassPathResource("credentials.json").getInputStream())
                .createScoped(List.of(CalendarScopes.CALENDAR));


        HttpRequestInitializer requestInitializer = new HttpCredentialsAdapter(credentials);

        return new Calendar.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance(),
                requestInitializer
        )
                .setApplicationName("KH3TShop Meeting Scheduler")
                .build();
    }

    public String createMeeting(String title, String description, String startTime, String endTime) throws Exception {
        Calendar service = getCalendarService();

        Event event = new Event()
                .setSummary(title)
                .setDescription(description)
                // Bạn nên tạo sẵn 1 phòng họp cố định và dán link vào đây
                .setLocation("https://meet.google.com/iqu-kibk-odx");

        EventDateTime start = new EventDateTime()
                .setDateTime(new DateTime(startTime))
                .setTimeZone("Asia/Ho_Chi_Minh");

        EventDateTime end = new EventDateTime()
                .setDateTime(new DateTime(endTime))
                .setTimeZone("Asia/Ho_Chi_Minh");

        event.setStart(start);
        event.setEnd(end);

        Event createdEvent = service.events()
                .insert("20102004hinh@gmail.com", event)
                // .setSendUpdates("all") <--- XÓA LUÔN DÒNG NÀY (Vì không có khách mời để gửi)
                .execute();

        // Code chạy thành công, trả về link để bạn tự gửi qua Zalo/Email cho nhân viên
        return createdEvent.getHtmlLink();
    }
}

