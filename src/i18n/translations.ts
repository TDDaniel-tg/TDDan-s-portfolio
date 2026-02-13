export type Lang = "en" | "ru";

export const translations = {
    nav: {
        about: { en: "About", ru: "Обо мне" },
        skills: { en: "Skills", ru: "Навыки" },
        projects: { en: "Projects", ru: "Проекты" },
        experience: { en: "Experience", ru: "Опыт" },
        contact: { en: "Contact", ru: "Контакт" },
        cta: { en: "Get in touch", ru: "Связаться" },
    },
    hero: {
        pretitle: { en: "Hey, I'm a", ru: "Привет, я —" },
        title1: { en: "FULL-STACK", ru: "FULL-STACK" },
        title2: { en: "& AI DEV", ru: "& AI DEV" },
        desc: {
            en: "Building products that\nactually work. With AI\non a different level.",
            ru: "Создаю продукты, которые\nреально работают. С AI\nна другом уровне.",
        },
        stats: {
            en: [
                { num: "#01", label: "Frontend Dev" },
                { num: "#02", label: "AI Integration" },
                { num: "#03", label: "Backend Systems" },
                { num: "#04", label: "Team Lead @ 17" },
            ],
            ru: [
                { num: "#01", label: "Frontend разработка" },
                { num: "#02", label: "AI интеграции" },
                { num: "#03", label: "Backend системы" },
                { num: "#04", label: "Тим. лид в 17 лет" },
            ],
        },
    },
    marquee: {
        items: {
            en: [
                "FULL-STACK DEVELOPER",
                "AI ENGINEER",
                "REACT & NEXT.JS",
                "PYTHON & DJANGO",
                "PROMPT ENGINEERING",
                "COMPUTER VISION",
                "TEAM LEAD",
            ],
            ru: [
                "FULL-STACK РАЗРАБОТЧИК",
                "AI ИНЖЕНЕР",
                "REACT & NEXT.JS",
                "PYTHON & DJANGO",
                "ПРОМПТ ИНЖЕНЕРИЯ",
                "КОМПЬЮТЕРНОЕ ЗРЕНИЕ",
                "ТИМ ЛИД",
            ],
        },
    },
    about: {
        number: "01",
        label: { en: "ABOUT", ru: "ОБО МНЕ" },
        paragraphs: {
            en: [
                "I'm Daniel Tashmatov — a 17-year-old Full-Stack Developer and AI Engineer. I started coding at 14 and never stopped. By 17, I was leading a development team at NeuroImpuls, shipping real products used by real businesses.",
                "I specialize in building AI-powered systems that actually solve problems — from computer vision bots that measure ceilings from photos, to GPT-4 integrations that automate entire workflows. My stack spans React, Next.js, Django, FastAPI on the backend, and TensorFlow, LangChain, RAG systems on the AI side.",
                "I've built e-commerce platforms, Telegram bots processing thousands of requests, Chrome extensions for marketplace analytics, mobile apps with React Native, and medical voice input systems. I don't just write code — I architect full products from zero to production.",
                "What sets me apart: I move fast, I learn faster, and I deliver products that work in the real world — not just demos. When companies need AI integrated into their workflow, they call me.",
            ],
            ru: [
                "Я Даниэль Ташматов — Full-Stack разработчик и AI-инженер, мне 17 лет. Начал кодить в 14 и с тех пор не останавливался. К 17 годам я уже руководил командой разработки в NeuroImpuls, выпуская реальные продукты для реального бизнеса.",
                "Моя специализация — AI-системы, которые решают настоящие задачи: от ботов с компьютерным зрением, которые измеряют потолки по фото, до интеграций GPT-4, автоматизирующих целые рабочие процессы. Мой стек: React, Next.js, Django, FastAPI на бэкенде и TensorFlow, LangChain, RAG-системы на стороне AI.",
                "В моём портфолио — e-commerce платформы, Telegram-боты, обрабатывающие тысячи запросов, Chrome-расширения для аналитики маркетплейсов, мобильные приложения на React Native и системы голосового ввода для медицины. Я не просто пишу код — я проектирую продукты с нуля до продакшена.",
                "Что меня отличает: я двигаюсь быстро, учусь ещё быстрее и делаю продукты, которые работают в реальном мире — не просто демо. Когда компаниям нужен AI в их процессах — они обращаются ко мне.",
            ],
        },
        stats: {
            en: [
                { value: "20+", label: "Projects completed" },
                { value: "3+", label: "Years of experience" },
                { value: "8+", label: "Tech stacks mastered" },
                { value: "17", label: "Years old" },
            ],
            ru: [
                { value: "20+", label: "Завершённых проектов" },
                { value: "3+", label: "Года опыта" },
                { value: "8+", label: "Стеков освоено" },
                { value: "17", label: "Лет" },
            ],
        },
    },
    skills: {
        number: "03",
        label: { en: "SKILLS & STACK", ru: "НАВЫКИ & СТЕК" },
    },
    projects: {
        number: "04",
        label: { en: "PROJECTS", ru: "ПРОЕКТЫ" },
        viewProject: { en: "View Project", ru: "Смотреть" },
        items: {
            en: [
                {
                    title: "E-Commerce Platform",
                    desc: "Full-stack marketplace with Django backend, React frontend, payments integration, and admin dashboard.",
                    tags: ["Django", "React", "PostgreSQL", "REST API"],
                },
                {
                    title: "Ceiling Measurement Bot",
                    desc: "Computer Vision + GPT-4 bot that calculates ceiling area from a single photo with high accuracy.",
                    tags: ["Computer Vision", "GPT-4", "Python", "Telegram"],
                },
                {
                    title: "PC Optimization Bot",
                    desc: "AI-powered Telegram bot for PC diagnostics and optimization with automated repair scripts.",
                    tags: ["AI", "Python", "Telegram", "Automation"],
                },
                {
                    title: "Wildberries Extension",
                    desc: "Chrome extension for Wildberries marketplace analytics — tracking prices, reviews, and seller metrics.",
                    tags: ["Chrome API", "JavaScript", "Web Scraping"],
                },
                {
                    title: "WB/Ozon Telegram Bot",
                    desc: "Automated notifications bot for Wildberries and Ozon sellers — orders, reviews, stock alerts.",
                    tags: ["Python", "Telegram", "REST API", "Celery"],
                },
                {
                    title: "Medical Voice Input",
                    desc: "Voice-to-text system for medical professionals — speech recognition with domain-specific vocabulary.",
                    tags: ["Speech-to-Text", "Python", "FastAPI", "AI"],
                },
                {
                    title: "AI Beauty Assistant",
                    desc: "React Native mobile app with AI-driven skin analysis and personalized beauty recommendations.",
                    tags: ["React Native", "AI", "Computer Vision", "Mobile"],
                },
                {
                    title: "Salary Calculator",
                    desc: "React Native app for automated salary calculations with complex bonus and deduction logic.",
                    tags: ["React Native", "TypeScript", "Mobile"],
                },
            ],
            ru: [
                {
                    title: "E-Commerce платформа",
                    desc: "Полноценный маркетплейс: Django бэкенд, React фронтенд, платежи и админ-панель.",
                    tags: ["Django", "React", "PostgreSQL", "REST API"],
                },
                {
                    title: "Бот для замера потолков",
                    desc: "Компьютерное зрение + GPT-4: измеряет площадь потолка по одному фото с высокой точностью.",
                    tags: ["Computer Vision", "GPT-4", "Python", "Telegram"],
                },
                {
                    title: "Бот для оптимизации ПК",
                    desc: "AI Telegram-бот для диагностики и оптимизации ПК с автоматическими скриптами.",
                    tags: ["AI", "Python", "Telegram", "Автоматизация"],
                },
                {
                    title: "Расширение для Wildberries",
                    desc: "Chrome-расширение для аналитики Wildberries — отслеживание цен, отзывов и метрик продавцов.",
                    tags: ["Chrome API", "JavaScript", "Парсинг"],
                },
                {
                    title: "WB/Ozon Telegram бот",
                    desc: "Бот уведомлений для продавцов WB и Ozon — заказы, отзывы, остатки.",
                    tags: ["Python", "Telegram", "REST API", "Celery"],
                },
                {
                    title: "Медицинский голосовой ввод",
                    desc: "Система речи-в-текст для врачей — распознавание с медицинским словарём.",
                    tags: ["Speech-to-Text", "Python", "FastAPI", "AI"],
                },
                {
                    title: "AI Beauty ассистент",
                    desc: "Мобильное приложение (React Native) с AI-анализом кожи и персональными рекомендациями.",
                    tags: ["React Native", "AI", "Computer Vision", "Mobile"],
                },
                {
                    title: "Калькулятор зарплат",
                    desc: "React Native приложение для расчёта зарплат с логикой бонусов и вычетов.",
                    tags: ["React Native", "TypeScript", "Mobile"],
                },
            ],
        },
    },
    experience: {
        number: "05",
        label: { en: "EXPERIENCE", ru: "ОПЫТ" },
        items: {
            en: [
                {
                    period: "2023 — Present",
                    role: "Development Manager",
                    company: "NeuroImpuls",
                    description:
                        "Leading a development team building AI-powered products. Architecting full-stack systems, managing sprints, code reviews, and shipping production-ready applications.",
                    stack: ["Python", "Django", "React", "Next.js", "GPT-4", "Docker"],
                },
            ],
            ru: [
                {
                    period: "2023 — Настоящее время",
                    role: "Менеджер разработки",
                    company: "NeuroImpuls",
                    description:
                        "Руковожу командой, создающей AI-продукты. Проектирую full-stack системы, управляю спринтами, провожу код-ревью и выпускаю готовые приложения в продакшен.",
                    stack: ["Python", "Django", "React", "Next.js", "GPT-4", "Docker"],
                },
            ],
        },
    },
    contact: {
        number: "06",
        label: { en: "CONTACT", ru: "КОНТАКТ" },
        bgText: { en: "LET'S BUILD", ru: "ДАВАЙ СОЗДАДИМ" },
        heading: {
            en: "Have a project in mind?",
            ru: "Есть проект на уме?",
        },
        subheading: {
            en: "Let's make something extraordinary together.",
            ru: "Давай сделаем что-то невероятное вместе.",
        },
        cta: { en: "Get in touch", ru: "Связаться" },
        email: "tashmatov.daniel@gmail.com",
        telegram: "@danieltashmatov",
        github: "github.com/danieltashmatov",
    },
    footer: {
        available: { en: "Available for projects", ru: "Открыт к проектам" },
        rights: { en: "All rights reserved.", ru: "Все права защищены." },
    },
} as const;
