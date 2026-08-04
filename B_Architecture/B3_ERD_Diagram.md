# The1ight LMS - B3: Entity Relationship Diagram (ERD)

Dưới đây là sơ đồ thực thể liên kết (ERD) trực quan hóa cấu trúc dữ liệu của The1ight LMS. Sơ đồ này thể hiện rõ mối quan hệ giữa hệ thống Khóa học, Học viên, và Tiến trình học tập (Outcome-based).

```mermaid
erDiagram
    %% Core Entities
    PROFILES {
        uuid id PK "FK to auth.users"
        text full_name
        text avatar_url
        enum role "student/admin"
        text gmail
        text phone_number
        text facebook_url
        text industry
        text current_job
        text product_idea
        boolean is_profile_completed
        int nautical_miles
        jsonb badges "Array of unlocked badges"
    }

    COURSES {
        uuid id PK
        text title
        text description
        text cover_image
    }

    BATCHES {
        uuid id PK
        uuid course_id FK
        text name
        date start_date
        date end_date
        uuid mentor_id FK
    }

    LESSONS {
        uuid id PK
        uuid course_id FK
        text title
        enum type "video/document"
        text content
        text video_url
        int order_index
        date start_date
        boolean has_materials
        text slide_url
        text study_note_url
        text_array key_concepts
        jsonb supporting_resources
        text assignment_description
        jsonb assignment_rubric_checklist
    }

    ANNOUNCEMENTS {
        uuid id PK
        uuid course_id FK
        uuid batch_id FK
        text title
        text content
        uuid created_by FK
        boolean send_email
        timestamp sent_email_at
        text_array media_urls
        timestamp created_at
    }

    ONBOARDING_DAYS {
        int day PK
        text title
        text intro
        text objective
        text checklist
        text takeaway
        text email_subject
        text email_body
        text companionHint
        text bonusResources
    }

    CALENDAR_EVENTS {
        uuid id PK
        text title
        text time
        text end_time
        boolean all_day
        int date
        int month
        int year
        int day_of_week
        bigint start_recur
        bigint end_recur
        text color_class
        text dot_color_class
        text type
        text event_type
        text details
    }

    NAUTICAL_MILES_TRANSACTIONS {
        uuid id PK
        uuid student_id FK
        int amount
        text action_type
        uuid reference_id
        text description
        timestamp created_at
    }

    BADGES {
        uuid id PK
        text name
        text icon
        text description
        text condition
    }

    %% Relationships
    COURSES ||--o{ LESSONS : "contains"
    COURSES ||--o{ BATCHES : "runs"
    COURSES ||--o{ ANNOUNCEMENTS : "has"
    
    BATCHES ||--o{ ANNOUNCEMENTS : "has"
    PROFILES ||--o{ ANNOUNCEMENTS : "creates"
    
    PROFILES ||--o{ NAUTICAL_MILES_TRANSACTIONS : "accumulates"
```

## Chú giải (Legend):
- `||--o{` : Quan hệ 1 - Nhiều (One-to-Many). Ví dụ: 1 Khóa học có nhiều Bài học (Lessons).
- `PK` : Primary Key (Khóa chính).
- `FK` : Foreign Key (Khóa ngoại).
