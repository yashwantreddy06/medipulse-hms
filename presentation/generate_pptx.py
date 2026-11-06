"""
MediPulse Presentation PPTX Generator
Generates a polished 10-slide PowerPoint presentation from slides-outline.md
"""

import os
import sys

try:
    from pptx import Presentation
    from pptx.util import Inches, Pt
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN
    from pptx.enum.shapes import MSO_SHAPE
except ImportError:
    print("\n[INFO] 'python-pptx' is not installed in your Python environment.")
    print("To install it and generate the slides, run:")
    print("    pip install python-pptx")
    print("    python presentation/generate_pptx.py\n")
    sys.exit(0)

# Robust target path resolution (works regardless of current working directory)
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(CURRENT_DIR, "MediPulse_Presentation.pptx")

# MediPulse Color Palette
PRIMARY = RGBColor(2, 132, 199)       # #0284c7 Sky Blue
PRIMARY_LIGHT = RGBColor(224, 242, 254) # #e0f2fe Soft Blue
ACCENT = RGBColor(13, 148, 136)       # #0d9488 Teal
DARK = RGBColor(15, 23, 42)           # #0f172a Slate Dark
MUTED = RGBColor(100, 116, 139)       # #64748b Slate Muted
BORDER = RGBColor(226, 232, 240)      # #e2e8f0 Border Grey
WHITE = RGBColor(255, 255, 255)

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Safely choose a blank or minimal layout
blank_layout = None
for layout in prs.slide_layouts:
    if len(layout.placeholders) == 0:
        blank_layout = layout
        break
if blank_layout is None:
    blank_layout = prs.slide_layouts[-1]

slides_data = [
    {
        "title": "MediPulse — Smart Healthcare Platform",
        "subtitle": "Full-Stack MERN Architecture for Digital Clinical Consultations",
        "bullets": [
            "Domain: Healthcare Appointment Booking & Doctor Consultation System",
            "Team: Apex Innovators",
            "1. Yashwant Reddy — Reg No. 21BCE1042 (Full-Stack Architecture & API)",
            "2. Priya Sharma — Reg No. 21BCE1189 (Frontend UI & State Management)",
            "3. Rahul Varma — Reg No. 21BCE1254 (Database Schema & Automated Testing)"
        ]
    },
    {
        "title": "Introduction & Problem Statement",
        "subtitle": "Tackling Friction and Fragmentation in Patient Consultations",
        "bullets": [
            "Healthcare Accessibility Gap: Long queues, manual phone booking, and fragmented records.",
            "Lack of Cost Transparency: Patients rarely know doctor fees and verified credentials beforehand.",
            "Administrative Overhead: Clinics face schedule collisions, missed slots, and chaotic tracking.",
            "The MediPulse Solution: An integrated, responsive web platform for real-time doctor discovery and booking."
        ]
    },
    {
        "title": "Project Objectives",
        "subtitle": "Core Technical & Operational Targets",
        "bullets": [
            "Frictionless Scheduling: Enable patients to book verified doctors in under 30 seconds.",
            "Transparent Profiles: Showcase credentials, experience years, upfront fees, and patient reviews.",
            "Hospital Administration: Empower clinic staff to manage physician rosters (CRUD) and triage appointments.",
            "Security by Design: Implement JWT authentication, bcrypt hashing, rate limiting, and RBAC guards."
        ]
    },
    {
        "title": "Technologies and Tools (MERN Stack)",
        "subtitle": "Decoupled Modern Web Architecture",
        "bullets": [
            "Frontend: React.js (Vite), React Router DOM (Guarded routing), Axios (Interceptors), React-Toastify.",
            "Backend: Node.js & Express.js RESTful API, Helmet, CORS allowlist, Express-Rate-Limit.",
            "Database: MongoDB Atlas (M0 Shared Cloud Cluster) with Mongoose ODM modeling and validation.",
            "Hosting Blueprint: Vercel (Frontend Edge) and Render (Backend Web Service) with zero cost."
        ]
    },
    {
        "title": "System Architecture & Workflow",
        "subtitle": "Decoupled 3-Tier Layered Implementation",
        "bullets": [
            "Client Tier: React SPA communicating asynchronously with backend over HTTPS REST calls.",
            "Server Tier: Express API Gateway enforcing rate-limiting, JWT authentication, and centralized error handling.",
            "Data Tier: MongoDB Atlas storing indexed collections for Users, Doctors, Appointments, and Reviews.",
            "Patient Flow: Browse Specialists -> Select Available Time Slot -> Submit Reason -> Real-time Tracking."
        ]
    },
    {
        "title": "Key Features & Functionalities",
        "subtitle": "Delivering Value for Patients and Clinical Administrators",
        "bullets": [
            "Specialist Discovery: Filter by specialty (Cardiology, Dermatology, etc.) and search across doctor bios.",
            "Smart Booking Form: Automated past-date blocking and dynamic slot selection from doctor schedule.",
            "Patient Portal: Track pending, confirmed, completed, and cancelled consultations with owner cancellation.",
            "Admin Management Console: Live metrics, doctor creation/editing/deletion modal, and appointment status triage."
        ]
    },
    {
        "title": "Database Design & API Integration",
        "subtitle": "Relational Integrity and Clean REST Endpoints",
        "bullets": [
            "User Schema: Role-based access control ('user' vs 'admin') with adaptive bcrypt salt rounds.",
            "Doctor Schema: Embedded schedules, specialty classifications, and auto-computed aggregate ratings.",
            "Appointment Schema: Foreign key references linking User and Doctor ObjectIds with status enums.",
            "Review Schema: Compound unique index { user: 1, doctor: 1 } ensuring one review per doctor visit."
        ]
    },
    {
        "title": "System Walkthrough & Screenshots",
        "subtitle": "Visual Interface Highlights",
        "bullets": [
            "Hero & Value Showcase: Clean medical aesthetic with quick statistics banner (50+ Specialists, 15k+ Patients).",
            "Specialist Directory: Dynamic category filter pills and responsive physician cards.",
            "Doctor Profile & Reviews: Comprehensive clinical background, consultation fees, and patient testimonials.",
            "Administrative Dashboard: High-level metric counters and modal-driven physician roster management."
        ]
    },
    {
        "title": "Challenges Faced & Future Scope",
        "subtitle": "Engineering Solutions and Growth Roadmap",
        "bullets": [
            "Concurrent Booking Collisions: Solved via database uniqueness and pre-flight slot availability queries.",
            "CORS & Auth Synchronization: Solved via environment allowlists and Axios response interceptors.",
            "Future Scope - Telehealth: WebRTC real-time browser video consultations.",
            "Future Scope - Payment Gateway: Stripe / Razorpay integration for upfront consultation prepayment."
        ]
    },
    {
        "title": "Conclusion & Summary",
        "subtitle": "MediPulse Project Completion",
        "bullets": [
            "Production-Grade MERN Application: 100% original, verified from scratch codebase.",
            "Robust Security & UX: Fully guarded client and server routes with rich visual feedback.",
            "Deployment Ready: Comprehensive deployment guide and configuration for Atlas, Render, and Vercel.",
            "Thank You! Questions and Live Demonstration."
        ]
    }
]

for idx, data in enumerate(slides_data):
    slide = prs.slides.add_slide(blank_layout)

    # 1. Top accent bar
    top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(0.18))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = PRIMARY
    top_bar.line.color.rgb = PRIMARY

    # 2. Slide Number & Meta Tag
    tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(11.7), Inches(0.35))
    tf_tag = tag_box.text_frame
    tf_tag.word_wrap = True
    p_tag = tf_tag.paragraphs[0]
    p_tag.text = f"SLIDE {idx + 1} OF 10  |  MEDIPULSE HEALTHCARE PLATFORM"
    p_tag.font.size = Pt(11)
    p_tag.font.bold = True
    p_tag.font.color.rgb = ACCENT

    # 3. Slide Title
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.8))
    tf_title = title_box.text_frame
    tf_title.word_wrap = True
    p_title = tf_title.paragraphs[0]
    p_title.text = data["title"]
    p_title.font.size = Pt(28)
    p_title.font.bold = True
    p_title.font.color.rgb = DARK

    # 4. Slide Subtitle
    sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.55), Inches(11.7), Inches(0.45))
    tf_sub = sub_box.text_frame
    tf_sub.word_wrap = True
    p_sub = tf_sub.paragraphs[0]
    p_sub.text = data["subtitle"]
    p_sub.font.size = Pt(15)
    p_sub.font.color.rgb = PRIMARY

    # 5. Divider Line
    div = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(2.1), Inches(11.733), Inches(0.02))
    div.fill.solid()
    div.fill.fore_color.rgb = BORDER
    div.line.color.rgb = BORDER

    # 6. Content Box
    body_box = slide.shapes.add_textbox(Inches(0.8), Inches(2.35), Inches(11.7), Inches(4.7))
    tf_body = body_box.text_frame
    tf_body.word_wrap = True

    for b_idx, bullet in enumerate(data["bullets"]):
        p_b = tf_body.add_paragraph() if b_idx > 0 else tf_body.paragraphs[0]
        p_b.text = f"•   {bullet}"
        p_b.font.size = Pt(17)
        p_b.font.color.rgb = DARK
        p_b.space_after = Pt(18)

# Ensure output directory exists and save
os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
prs.save(OUTPUT_FILE)
print(f"[SUCCESS] Presentation successfully generated at:")
print(f"          {OUTPUT_FILE}")
