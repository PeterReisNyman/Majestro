# MVP Majestro Lead Flow System Design

## 1. Entry Points

### 1.1 New Property

```mermaid
flowchart TD

    %% ===== NODES =====

    REALTOR[Realtor]

    UPLOAD[Upload PDFs + Info]

    CLAUDE[Claude SDK / Codex SDK]

    MAPS[Google Maps API]

    DB[(Database)]

    LOU_DB[(Loupes Database)]

    SEARCH[Internet Search Agent]


    %% ===== CONNECTIONS =====

    %% Realtor uploads property
    REALTOR --> UPLOAD

    %% Process documents
    UPLOAD -->|Extract info| CLAUDE

    %% Get location data
    REALTOR -->|Address| MAPS

    %% Claude extracts

    LOU_DB --> |e.g: 'Apartments on the same building'| CLAUDE
    CLAUDE -->|Price, size, rooms, features| DB
    CLAUDE --> SEARCH
    SEARCH -->|General Info| DB

    %% Maps returns
    MAPS -->|Schools, metro, shops nearby| DB


    %% ===== STYLES =====

    style REALTOR fill:#9C27B0,color:#fff
    style UPLOAD fill:#9C27B0,color:#fff
    style CLAUDE fill:#ff9800,color:#000
    style MAPS fill:#4CAF50,color:#fff
    style DB fill:#2196F3,color:#fff
    style LOU_DB fill:#ef9a9a,color:#000
    style SEARCH fill:#ff9800,color:#000
```

### 1.2 New Lead

```mermaid
flowchart TD

    %% ===== NODES =====

    PIXEL[Majestro Pixel]

    DB[(Database)]

    ASSIGN{Realtor Assigner}


    %% ===== CONNECTIONS =====

    PIXEL --> DB

    %% Assign realtor
    DB --> ASSIGN
    ASSIGN -->|Location, specialty, availability| DB


    %% ===== STYLES =====

    style DB fill:#2196F3,color:#fff
    style ASSIGN fill:#ff9800,color:#000
```

---

## 2. Processing

### 2.1 Lead Communication

**AI Chatbot/Calling (WhatsApp):**
- [Convin AI](https://convin.ai)
- [Roof AI](https://roofai.com)
- [Structurely](https://structurely.com)
- [Twilio](https://twilio.com)
- [Plaza](https://www.useplaza.com.br/)



```mermaid
flowchart TD

    %% ===== NODES =====

    LEAD[Lead]

    NESTJS{Nest JS}

    MSG[Twilio]

    CALL[Structurely]

    BOOK[Book Showing]

    DASH[Realtor Dashboard]

    DB[(Database)]

    %% ===== CONNECTIONS =====

    %% Lead enters system
    LEAD --> NESTJS

    DB --> NESTJS
    %% Nest JS decides action
    NESTJS -->|Message| MSG
    NESTJS -->|Call| CALL


    MSG -->|Wants to book| BOOK
    CALL -->|Wants to book| BOOK

    %% Updates to dashboard
    NESTJS -.->|Updates intent| DASH


    %% ===== STYLES =====

    style LEAD fill:#9C27B0,color:#fff
    style NESTJS fill:#ff9800,color:#000
    style MSG fill:#4CAF50,color:#fff
    style CALL fill:#4CAF50,color:#fff
    style BOOK fill:#ff9800,color:#000
    style DASH fill:#4CAF50,color:#fff
    style DB fill:#2196F3,color:#fff
```

### 2.2 First Contact Lead

```mermaid
flowchart TD

    %% ===== NODES =====

    PIXEL[Majestro Pixel]

    NESTJS{NestJS}

    CONTACT[Contact]

    DB[(Database)]

    %% ===== CONNECTIONS =====


    PIXEL --> NESTJS
    NESTJS --> DB

    %% NestJS decides action
    NESTJS -->|fit| CONTACT



    %% ===== STYLES =====

    style NESTJS fill:#ff9800,color:#000
    style CONTACT fill:#4CAF50,color:#fff
    style DB fill:#2196F3,color:#fff
```

---

## 3. Optimal Roteiro

**AI Engine:** [GPT-5.2](https://evals.openai.com/gdpval/leaderboard) — 60.0% wins • 77.8% wins+ties

```mermaid
flowchart TD

    %% ===== NODES =====

    DB[(Database)]

    PROP_DATA[Property Data]
    LEAD_DATA[Lead Data]

    GPT[GPT-5.2 or img blw]

    ROTEIRO[Custom Roteiro]

    VR[Start VR Tour]


    %% ===== CONNECTIONS =====

    DB --> PROP_DATA
    DB --> LEAD_DATA

    PROP_DATA --> GPT
    LEAD_DATA --> GPT

    GPT -->|Personalized walkthrough| ROTEIRO

    ROTEIRO -->|maybe updates live?| ROTEIRO

    ROTEIRO --> VR


    %% ===== STYLES =====

    style DB fill:#2196F3,color:#fff
    style PROP_DATA fill:#9C27B0,color:#fff
    style LEAD_DATA fill:#9C27B0,color:#fff
    style GPT fill:#ff9800,color:#000
    style ROTEIRO fill:#ff9800,color:#000
    style VR fill:#4CAF50,color:#fff
```

![TourAi](../imgs/TourAI.png)

---

# Insights
