# The1ight LMS - B3: Entity Relationship Diagram (ERD)

Dưới đây là sơ đồ thực thể liên kết (ERD) trực quan hóa cấu trúc dữ liệu của The1ight LMS. Sơ đồ này thể hiện rõ mối quan hệ giữa hệ thống Khóa học, Học viên, và Tiến trình học tập (Outcome-based).

```mermaid
erDiagram
    %% Core Entities
    PROFILES {
        uuid id PK "FK to auth.users"
        text full_name
        text avatar_url
        enum role "student/mentor/admin"
        text telegram_id "UK"
        text gmail
        text phone_number
        text facebook_url
        text industry
        text current_job
        enum tech_level "non-tech/low-code/coder"
        text product_idea
        int weekly_hours_commitment
        text motivation_bet
        boolean is_profile_completed
        int nautical_miles
    }

    COURSES {
        uuid id PK
        text title
        text description
    }

    BATCHES {
        uuid id PK
        uuid course_id FK
        text name
        date start_date
        uuid mentor_id FK
    }

    ENROLLMENTS {
        uuid id PK
        uuid student_id FK
        uuid batch_id FK
        enum status
    }

    BATCH_SCHEDULES {
        uuid id PK
        uuid batch_id FK
        uuid lesson_id FK
        timestamp scheduled_at
        boolean unlock_email_sent
        boolean is_holiday
        text notes
    }

    MODULES {
        uuid id PK
        uuid course_id FK
        text title
        int order_index
    }

    LESSONS {
        uuid id PK
        uuid module_id FK
        text title
        enum type "video/doc"
        text video_url "External Link"
        date start_date
        text target
        boolean has_materials
        text slide_url
        text study_note_url
        text_array key_concepts
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
        timestamp created_at
    }

    %% Onboarding & Calendar Schedule
    ONBOARDING_DAYS {
        int day PK
        text title
        text description
        text task
        timestamp scheduled_at
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
        text type
        text event_type
        text details
    }

    %% Action-Oriented (Assignments)
    ASSIGNMENTS {
        uuid id PK
        uuid lesson_id FK
        jsonb rubric_checklist
        jsonb scaffolding
    }

    SUBMISSIONS {
        uuid id PK
        uuid assignment_id FK
        uuid batch_id FK
        uuid student_id FK
        text content "Completion link/metadata"
        enum status
        int upvotes_count
        text[] upvoted_by
    }

    FEEDBACKS {
        uuid id PK
        uuid submission_id FK,UK
        uuid mentor_id FK
        enum mastery_level
    }

    %% Community & Discussion Room
    COMMENTS {
        uuid id PK
        uuid submission_id FK
        uuid batch_id FK
        uuid author_id FK
        int upvotes_count
        boolean is_verified
        text[] upvoted_by
    }

    %% Gamification
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
    }

    PROFILE_BADGES {
        uuid student_id PK,FK
        uuid badge_id PK,FK
        timestamp unlocked_at
    }

    %% Relationships
    COURSES ||--o{ MODULES : "contains"
    COURSES ||--o{ BATCHES : "runs"
    COURSES ||--o{ ANNOUNCEMENTS : "has"
    
    BATCHES ||--o{ ENROLLMENTS : "includes"
    BATCHES ||--o{ BATCH_SCHEDULES : "has_schedule"
    BATCHES ||--o{ ANNOUNCEMENTS : "has"
    PROFILES ||--o{ ENROLLMENTS : "joins"
    PROFILES ||--o{ ANNOUNCEMENTS : "creates"
    
    MODULES ||--o{ LESSONS : "contains"
    
    LESSONS ||--o{ BATCH_SCHEDULES : "scheduled_on"
    LESSONS ||--o| ASSIGNMENTS : "has (1-to-0..1)"
    
    ASSIGNMENTS ||--o{ SUBMISSIONS : "receives"
    PROFILES ||--o{ SUBMISSIONS : "submits"
    BATCHES ||--o{ SUBMISSIONS : "scopes"
    
    SUBMISSIONS ||--o| FEEDBACKS : "gets (1-to-0..1)"
    PROFILES ||--o{ FEEDBACKS : "evaluates (as mentor)"
    
    SUBMISSIONS ||--o{ COMMENTS : "discussed_in (Threads)"
    PROFILES ||--o{ COMMENTS : "authors"
    BATCHES ||--o{ COMMENTS : "scopes"

    PROFILES ||--o{ NAUTICAL_MILES_TRANSACTIONS : "accumulates"
    PROFILES ||--o{ PROFILE_BADGES : "achieves"
    BADGES ||--o{ PROFILE_BADGES : "granted_to"
```

## Chú giải (Legend):
- `||--o{` : Quan hệ 1 - Nhiều (One-to-Many). Ví dụ: 1 Khóa học có nhiều Modules.
- `||--o|` : Quan hệ 1 - 1 (hoặc không có). Ví dụ: 1 Bài nộp (Submission) chỉ có 1 Feedback.
- `PK` : Primary Key (Khóa chính).
- `FK` : Foreign Key (Khóa ngoại).
- `UK` : Unique Key (Khóa duy nhất).
