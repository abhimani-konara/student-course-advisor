% ===================================================================
% Student Course Advisor - Enhanced AI Logic
% ===================================================================
% Project: Student Course Advisor Web Application
% Group: 7
% Institution: NIBM - Diploma in Computer Science with AI
% 
% Team Members:
% - Pasindu Bandara (KIC-DCSAI-251-F-030)
% - Abhimani Konara (KIC-DCSAI-251-F-028) - IDE, Git & Version Control
% - Chethani Thakshila (KIC-DCSAI-251-F-048)
% - Isurika Bandara (KIC-DCSAI-251-F-029)
%
% Developed by: Abhimani Konara
% Role: IDE Setup, Version Control, AI Logic Integration
% Date: January 2026
% ===================================================================

% ==================== FACTS ====================
% Stream-Interest mappings for Sri Lankan A/L students

stream_interest("Physical","Technology").
stream_interest("Physical","Engineering").
stream_interest("Biological","Medical").
stream_interest("Biological","Science").
stream_interest("Commerce","Management").
stream_interest("Commerce","Technology").
stream_interest("Arts","Teaching").
stream_interest("Arts","Design").
stream_interest("Arts","Management").
stream_interest("Technology","Design").
stream_interest("Technology","Technology").

% ==================== RECOMMENDATION RULES ====================
% These rules implement AI-based decision making for course recommendations
% Developed and integrated by: Abhimani Konara

% Rule 1: Physical Science + Technology + Excellent GPA
recommend(Stream, Interest, GPA, "Software Engineering"):-
    Stream = "Physical",
    Interest = "Technology",
    GPA >= 3.5.

% Rule 2: Physical Science + Technology + Good GPA
recommend(Stream, Interest, GPA, "Computer Science/IT"):-
    Stream = "Physical",
    Interest = "Technology",
    GPA >= 2.5,
    GPA < 3.5.

% Rule 3: Physical Science + Engineering + Excellent GPA
recommend(Stream, Interest, GPA, "Mechanical Engineering"):-
    Stream = "Physical",
    Interest = "Engineering",
    GPA >= 3.5.

% Rule 4: Physical Science + Engineering + Good GPA
recommend(Stream, Interest, GPA, "Civil Engineering"):-
    Stream = "Physical",
    Interest = "Engineering",
    GPA >= 2.5,
    GPA < 3.5.

% Rule 5: Biological Science + Medical + Excellent GPA (Top tier)
recommend(Stream, Interest, GPA, "Medicine (MBBS)"):-
    Stream = "Biological",
    Interest = "Medical",
    GPA >= 3.7.

% Rule 6: Biological Science + Medical + Very Good GPA
recommend(Stream, Interest, GPA, "Pharmacy"):-
    Stream = "Biological",
    Interest = "Medical",
    GPA >= 3.0,
    GPA < 3.7.

% Rule 7: Biological Science + Medical + Good GPA
recommend(Stream, Interest, GPA, "Nursing"):-
    Stream = "Biological",
    Interest = "Medical",
    GPA >= 2.5,
    GPA < 3.0.

% Rule 8: Biological Science + Science Interest
recommend(Stream, Interest, _, "Biomedical Science"):-
    Stream = "Biological",
    Interest = "Science".

% Rule 9: Commerce + Management + Excellent GPA
recommend(Stream, Interest, GPA, "Business Administration (BBA)"):-
    Stream = "Commerce",
    Interest = "Management",
    GPA >= 3.5.

% Rule 10: Commerce + Management + Good GPA
recommend(Stream, Interest, GPA, "Business Management"):-
    Stream = "Commerce",
    Interest = "Management",
    GPA >= 2.5,
    GPA < 3.5.

% Rule 11: Commerce + Technology (Cross-disciplinary)
recommend(Stream, Interest, _, "Management Information Systems"):-
    Stream = "Commerce",
    Interest = "Technology".

% Rule 12: Arts + Teaching + Good GPA
recommend(Stream, Interest, GPA, "Education Degree (B.Ed)"):-
    Stream = "Arts",
    Interest = "Teaching",
    GPA >= 2.5.

% Rule 13: Arts + Design
recommend(Stream, Interest, _, "Graphic Design & Multimedia"):-
    Stream = "Arts",
    Interest = "Design".

% Rule 14: Arts + Management
recommend(Stream, Interest, _, "Human Resource Management"):-
    Stream = "Arts",
    Interest = "Management".

% Rule 15: Technology Stream + Design + Good GPA
recommend(Stream, Interest, GPA, "UI/UX Design"):-
    Stream = "Technology",
    Interest = "Design",
    GPA >= 3.0.

% Rule 16: Technology Stream + Design
recommend(Stream, Interest, _, "Multimedia Technology"):-
    Stream = "Technology",
    Interest = "Design".

% Rule 17: Technology Stream + Technology
recommend(Stream, Interest, _, "Information Technology"):-
    Stream = "Technology",
    Interest = "Technology".

% Rule 18: Physical + Medical Interest (Cross-stream option)
recommend(Stream, Interest, GPA, "Biomedical Engineering"):-
    Stream = "Physical",
    Interest = "Medical",
    GPA >= 3.0.

% Rule 19: Any Stream + Data Science Interest (Emerging field)
recommend(_, "Data Science", GPA, "Data Science & Analytics"):-
    GPA >= 3.0.

% Rule 20: Low GPA students - Foundation pathway
recommend(_, _, GPA, "Foundation Program"):-
    GPA < 2.0.

% Rule 21: Moderate GPA students - Diploma pathway
recommend(_, _, GPA, "Diploma Programs"):-
    GPA >= 2.0,
    GPA < 2.5.

% Default rule - Catches all unmatched cases
recommend(_, _, _, "General Studies / Design & Multimedia").

% ===================================================================
% End of Prolog Rules
% System developed using SWI-Prolog 9.2.9
% Integrated with Node.js Express backend
% Version Control: Git & GitHub
% Managed by: Abhimani Konara
% ===================================================================